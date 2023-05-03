import React, { Component } from 'react' 
import L, { LatLngExpression } from 'leaflet'
import RouteInformation from '../Interfaces/RouteInformation';
import Dot from '../Interfaces/Dot'
import MapInfo from '../Interfaces/MapInfo'
import { getRouteById } from '../Functions/getRouteById';
import createMap from '../Functions/createMap'
import WalkthroughDot from '../Components/WalkthroughDot';

interface DotMarker {
    dot: Dot,
    marker: L.Marker
}

interface WalkthroughInfo {
    started: boolean,
    currentDot?: DotMarker
}

interface RoutePageState {
    isLoading: Boolean,
    route?: RouteInformation,
    wtInfo: WalkthroughInfo,
    mapInfo: MapInfo
}

export default class RoutePage extends Component<any, RoutePageState> {
    constructor(props: any) {
        super(props);

        this.state = {
            isLoading: true,
            wtInfo: {
                started: false
            },
            mapInfo: {
                enabled: false,
                map: undefined,
                center: [51.0, 0],
                dots: [],
                lines: [],
                markers: [],
                mapLines: []
            }
        };
    }

    async componentDidMount() {
        this.showMap();

        const id = (new URLSearchParams(window.location.search)).get('id');
        
        if(!id) {
            alert('Произошла ошибка. Попробуйте перезайтина страницу.');
            window.location.href = "/";
            return;
        }

        const route : RouteInformation | null = await getRouteById(parseInt(id));

        if (!route) {
            alert('Произошла ошибка. Попробуйте перезайтина страницу.');
            window.location.href = "/";
            return;
        }

        this.setState({ isLoading: false, route });
    }

    render() {
        const { isLoading, route, wtInfo } = this.state;
        const { started, currentDot } = wtInfo;

        let dotPosition: 'none' | 'first' | 'last' = 'none';
        if (currentDot) {
            const index = route!.dots.indexOf(currentDot.dot);
            if (index === 0) dotPosition = 'first';
            if (index === route!.dots.length - 1) dotPosition = 'last';
        }

        return <div>
            <div id="main-container">
                <aside className="sidebar">
                    <div className="sidebar__content">
                    <div id="routes">
                        {isLoading 
                        ? <div>
                            <h2>Прохождение маршрута</h2>
                            <p>Загрузка...</p>
                        </div>
                        : <div>
                            <h2>{route?.name ?? "Маршрут без названия"}</h2>
                            {!started
                            && <button className="btn btn-success btn-large" onClick={this.handleStart}>
                                Начать проходить маршрут</button>}
                            {started 
                            && <WalkthroughDot 
                                position={dotPosition}
                                dot={currentDot!.dot} 
                                onNext={this.handleNextDot}/>}
                        </div>
                        }
                    </div>
            </div>
            </aside>
            <div id="mapDiv" style={{height: '100%'}}></div>
            </div>
        </div>
    }

    handleStart = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        const { route, mapInfo } = this.state;
        const { dots } = route!;
        const { map } = mapInfo;

        const dot = dots[0];
        const latlng = [dot.positionX, dot.positionY]
        const marker = L.marker(latlng as LatLngExpression);
        marker.addTo(map!);
        map!.setView(latlng as LatLngExpression);
        
        const dotMarker : DotMarker = { dot, marker};
        
        this.setState({ wtInfo: {started: true, currentDot: dotMarker}})
    }

    handleNextDot = (type: 'next' | 'back') => {
        const { route, mapInfo, wtInfo } = this.state;
        const { dots } = route!;
        const { currentDot } = wtInfo;
        const { map } = mapInfo;

        const index = dots.indexOf(currentDot!.dot);
        if (type === 'back' && index === 0) return;
        if (type === 'next' && index === dots.length - 1) return;

        let nextDot = type === 'next' ? dots[index + 1] : dots[index - 1];

        currentDot?.marker.removeFrom(map!);

        const latlng = [nextDot.positionX, nextDot.positionY];
        const marker = L.marker(latlng as LatLngExpression);
        marker.addTo(map!);

        const newCurrDot: DotMarker = {dot: nextDot, marker}
        this.setState({ wtInfo: {...wtInfo, currentDot: newCurrDot } });
    }


    showMap = () => {
        const callback = () : void => {
            const mapDiv = document.getElementById("mapDiv");

            if(!mapDiv) {
                window.requestAnimationFrame(callback);
                return;
            };

            const height = window.innerHeight - document.getElementsByTagName('header')[0]!.offsetHeight;

            const container = document.getElementById('main-container')!;
            container.style.height = `${height}px`;
            
            mapDiv.style.height = container.style.height;

            const map = createMap("mapDiv", "Эрмитаж Санкт-Петербург")!
            this.setState({mapInfo: {...this.state.mapInfo, map, enabled: true}});
        };
        window.requestAnimationFrame(callback);
    }
}