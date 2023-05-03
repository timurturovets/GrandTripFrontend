import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { AuthContextConsumer } from '../AuthContext'
import { get, post } from '../Functions/requests'
import L from 'leaflet'
import RouteInfo from '../Components/RouteInfo'
import RouteInformation from '../Interfaces/RouteInformation'
import MapInfo from '../Interfaces/MapInfo'
import createMap from '../Functions/createMap'

type Theme = 'none' | 'modern-world' | 'history' | 'islands' | 'films' | 'literature' 
| 'activities' | 'gastronomy' | 'abiturients'
type Season = 'none' | 'summer' | 'winter' | 'autumn' | 'spring'
type City = 'spb' | 'kzn'
type Duration = "none" | "1h" | "2h" | "4h" | "1d"
type Nullable<T> = T | null

interface RouteCriteries {
    theme: Theme,
    season: Season,
    city: City,
    duration: Duration
}

interface ShareInfo {
    isFromRef: boolean,
    refId: Nullable<number>,
    refRoute?: RouteInformation & { isFavourite: boolean },
    loading: boolean
}

interface StateRoutes {
    clicked: Boolean,
    isLoading: Boolean,
    result: (RouteInformation & { isFavourite: boolean })[],
    error?: string
}

interface NewRoutesPageState {
    shareInfo: ShareInfo,
    mapInfo: MapInfo,
    criteries: RouteCriteries
    routes: StateRoutes
}

export default class RoutesPage extends Component<any, NewRoutesPageState> {
    constructor(props: any){
        super(props);

        const isFromRef = window.location.pathname === "/share" 
            && new URLSearchParams(window.location.search).has('r');

        let refId = isFromRef 
            ? parseInt(new URLSearchParams(window.location.search).get('r')!) 
            : null;

        this.state = {
            shareInfo: {
                isFromRef,
                refId,
                refRoute: undefined,
                loading: true
            },
            mapInfo: {
                enabled: false,
                map: undefined,
                center: [51.0, 0],
                dots: [],
                lines: [],
                markers: [],
                mapLines: []
            },
            criteries: {
                theme: "none",
                season: "none",
                city: 'spb',
                duration: "none"
            },
            routes: {
                clicked: false, 
                isLoading: false,
                result: [],
                error: ""
            }
        }
    }
    componentDidMount() {
        this.showMap();
    }
    render() {
        const { shareInfo, routes, criteries } = this.state;
        const { isFromRef, refRoute, loading } = shareInfo;
        const { clicked, isLoading, result, error } = routes;

        return <AuthContextConsumer>
            {({isAuthenticated})=><div style={{ height: '100%' }}>
                <div id="main-container">
                <aside className="sidebar">
                    <div className="sidebar__content">
                        <div className="sidebar__title">Поиск по параметрам</div>
                        <div className="sidebar__list">
                        <form className="sidebar__field">
                            <select className="field field--small sidebar__element"
                            onChange={e=>this.handleSeasonChange(e.target.value as Season)}>
                            <option value="none">Любое время года</option>            
                            <option value="winter">Зима</option>
                            <option value="summer">Лето</option>
                            </select>
                            <select className="field field--small sidebar__element"
                            onChange={e=>this.handleCityChange(e.target.value as City)}>
                                <option value="spb">Санкт-Петербург</option>
                                <option value="kzn">Казань</option>
                            </select>
                            <select className="field field--small sidebar__element"
                                onChange={e=>this.handleThemeChange(e.target.value as Theme)}>
                                <option value="none">Все тематики</option>
                                <option value="modern-world">Современный мир</option>
                                <option value="history">История</option>
                                <option value="islands">Острова и парки</option>
                                <option value="films">Фильмы</option>
                                <option value="literature">Литературный дворик</option>
                                <option value="activities">Физические активности</option>
                                <option value="gastronomy">Гастрономия</option>
                                <option value="abiturients">Абитуриентам</option>
                            </select>
                            <select className="field field--small sidebar__element"
                            onChange={e=>this.setState({criteries:
                                {...criteries, duration: e.target.value as Duration}})}>
                            <option selected disabled value="default">Длительность прогулки</option>
                            <option value="none">Неважно</option>
                            <option value="1h">1 час</option>
                            <option value="2h">2 часа</option>
                            <option value="4h">4 часа</option>
                            <option value="1d">1 день</option>
                            </select>
                            <div className="d-flex flex-row">
                                <button className="button button--small sidebar__element" onClick={this.handleSubmit}>искать</button>
                                {isAuthenticated && 
                        <Link to="/constructor" className="button button--bordered sidebar__bottom-button ml-5">
                            создайте свой маршрут</Link>}
                            </div>
                        </form>
                        </div>
                    <div id="routes">
                    
                {isFromRef 
                    ? loading || !refRoute
                        ? <p>Загрузка...</p>
                        : error
                            ? <p className="text-danger">{error}</p>
                            : <RouteInfo info={refRoute} 
                            onRouteRendering={this.handleRouteRendering} 
                            onAddingToFavourites={this.handleAddToFavourites} />
                    : clicked
                        ? <p>Нажмите на кнопку "ОК", чтобы отобразить маршруты</p>
                        : isLoading
                            ? <p>Загрузка...</p>
                            : error
                                ? <p className="text-danger">{error}</p>
                                : result.map(route => <div key={route.id}><RouteInfo info={route} 
                                onRouteRendering={this.handleRouteRendering} 
                                onAddingToFavourites={this.handleAddToFavourites} /></div>)
                }
            </div>
            </div>
            </aside>

            <div id="mapDiv" style={{height: '100%'}}></div>

            </div>
        </div>}</AuthContextConsumer>
    }

    handleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        const { routes, criteries } = this.state;
        const { theme, season, city, duration } = criteries;
        
        const filters = {
            theme: theme === 'none' ? "" : theme, 
            season: season === 'none' ? "" : season,
            city,
            duration: duration === "none" ? "" : duration
        };

        this.setState({routes: {...routes, isLoading: true}});

        await get(`${process.env.REACT_APP_NEW_API_URL}/api/route/getall`, filters).then(async res=>{
            const routes = (await res.json()).routes;
            console.log(routes);
            const routeInformations: (RouteInformation & {isFavourite: boolean})[] = [];
            for(const route of routes) {
                if(route) routeInformations.push(route);
            }
        
            console.log(routeInformations);
            this.setState({
                routes: {
                    ...this.state.routes,
                    result: routeInformations,
                    isLoading: false
                }
            });

            const container = document.getElementById('main-container')!;   
            const sideNav = document.getElementById('MySideNav')!;
            sideNav.style.height = container.style.height;
        }).catch(err=>{
            console.log(err);
            //alert('Произошла ошибка. Попробуйте позже.');
        });
    }

    handleRouteRendering = (routeId: number) => {
        console.log(routeId);
        const { result } = this.state.routes;
        let { map, markers, mapLines } = this.state.mapInfo;
        const zoom = map!.getZoom();
        for(const marker of this.state.mapInfo.markers) {
            marker.remove();
        }

        for(const line of mapLines) {
            map!.removeLayer(line);
        }
        let route: RouteInformation = result.find(r => r.id === routeId)!;
        console.log(route);
        while(!(route.dots instanceof Array)) route.dots = JSON.parse(route.dots as unknown as string);
        while(!(route.lines instanceof Array)) route.lines = JSON.parse(route.lines as unknown as string);
        for (const dot of route.dots) {
            console.log(dot);
            let newMarker = L.marker([dot.positionX, dot.positionY]);
            const content = `<h6><b>${dot.name}</b></h6><p class="m-0">${dot.description || "Нет описания"}</p>`;
            newMarker.bindPopup(L.popup().setContent(content));
            newMarker.addTo(map!);
            markers.push(newMarker);
        }
        map!.setView([route.dots[0].positionX, route.dots[0].positionY], zoom > 13 ? zoom : 13);
        console.log(route.lines);
        for (const line of route.lines) {
            let realLatLngs: {lat: number, lng: number}[] = [];
            for(let latlng of line.latLngs) {
                const unwrapped = latlng as number[];
                realLatLngs.push({
                    lat: unwrapped[0] || (latlng as any).lat, 
                    lng: unwrapped[1] || (latlng as any).lng 
                });
            }
            const l = L.polyline(realLatLngs, { color: 'rgba(255, 157, 18, 1)', weight: 5 })
                .addTo(map!);
            mapLines.push(l);
        }
        this.setState({mapInfo: {...this.state.mapInfo, mapLines, markers}})
    }

    handleThemeChange = (theme: Theme) : void => {
        this.setState({
            criteries: {
                ...this.state.criteries,
                theme
            }
        });
    }

    handleCityChange = (city: City) : void => {
        this.setState({
            criteries: {
                ...this.state.criteries,
                city
            }
        });
    }

    handleAddToFavourites = async (id: number, remove: boolean) => {
        const url = `${process.env.REACT_APP_API_URL}/${remove ? "remove" : "add"}_favourite_route`;
        const fd = new FormData();
        fd.append('routeId', `${id}`);

        await post(url, fd).then(async response => {
            const { routes } = this.state;
            const { result } = routes;

            const route = result.find(r => r.id === id);
            if(!route) return;

            route.isFavourite = !remove;
            this.setState({routes: {...routes, result}});
        }).catch(err=>{
            console.log(err);
        });
    }

    handleSeasonChange = (season: Season) : void => {
        const { criteries } = this.state;
        this.setState({
            criteries: {
                ...criteries,
                season
            }
        });
    }

    handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) : void => {
        const duration = e.target.value as Duration;

        const { criteries } = this.state;
        this.setState({
            criteries:{
                ...criteries,
                duration
            }
        });
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