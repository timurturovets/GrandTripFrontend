import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { AuthContextConsumer } from '../AuthContext'
import { get, post } from '../Functions/requests'
import L from 'leaflet'
import RouteInfo from '../Components/RouteInfo'
import RouteInformation from '../Interfaces/RouteInformation'
import Dot from '../Interfaces/Dot'
import Line from '../Interfaces/Line'
import createMap from '../Functions/createMap'

type Theme = 'none' | 'modern-world' | 'history' | 'islands' | 'films' | 'literature' 
| 'activities' | 'gastronomy' | 'abiturients'
type Season = 'none' | 'summer' | 'winter' | 'autumn' | 'spring'
type Time = "none" | number
type Nullable<T> = T | null

interface RouteCriteries {
    theme: Theme,
    season: Season,
    time: Time
}

interface MapInfo {
    enabled: boolean,
    map?: L.Map,
    center: number[],
    dots: Dot[],
    lines: Line[],
    markers: L.Marker[],
    mapLines: L.Polyline[]
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

export default class NewRoutesPage extends Component<any, NewRoutesPageState> {
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
                time: 5
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
            {({isAuthenticated})=><div style={{display: 'flex'}}>
                <aside className="sidebar">
                    <div className="sidebar__content">
                        <button className="sidebar__close-button"> <img src="img/icons/small-arrow.svg" alt=""/><span>Скрыть меню</span></button>
                        <div className="sidebar__title">Поиск по параметрам</div>
                        <div className="sidebar__list">
                        <form className="sidebar__field">
                            <select className="field field--small sidebar__element"
                            onChange={e=>this.handleSeasonChange(e.target.value as Season)}>
                            <option value="none">Любое время года</option>
                            <option value="spring">Весна</option>
                            <option value="winter">Зима</option>
                            <option value="autumn">Осень</option>
                            <option value="summer">Лето</option>
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
                                {...criteries, time: parseInt(e.target.value)}})}>
                            <option selected disabled value="default">Длительность прогулки</option>
                            <option value="1">30 минут</option>
                            <option value="2">1 час</option>
                            <option value="3">1.5 часа</option>
                            <option value="4">2 часа и больше</option>
                            </select>
                            <button className="button button--small sidebar__element" onClick={this.handleSubmit}>искать</button>
                        </form>
                        </div>
                    {//</div>
    }
                    {isAuthenticated && 
                        <Link to="/constructor" className="button button--bordered sidebar__bottom-button">
                            создайте свой маршрут</Link>}
                    {/*<button className="button button--bordered sidebar__bottom-button"
                            onClick={e=>this.handleSendAll(e)}>Отправить всё на новый бэкенд</button>*/}
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
                    <div id="MAP-ID"></div>
        </div>}</AuthContextConsumer>
    }

    /*handleSendAll = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        const { routes } = this.state;
        const { result } = routes;

        for(const route of result) {
            while(!(route.dots instanceof Array)) route.dots = JSON.parse(route.dots as unknown as string);
            while(!(route.lines instanceof Array)) route.lines = JSON.parse(route.lines as unknown as string);

            const { name, description, dots, lines } = route;
            const fd = new FormData();
    
            fd.append('data.RouteName', name!);
            fd.append('data.Description', description!);
    
            const realDots = [...[...dots.map(d=>{
                return { Id: d.id, Name: d.name, Description: d.description,
                    PositionX: d.positionX 
                    || (d as Dot & {PositionX: number}).PositionX, PositionY: d.positionY 
                    || (d as Dot & {PositionY: number}).PositionY }
            })].map(d=>JSON.stringify(d))];
    
            const realLines = [...[...lines.map(l=>{
                return { Id: l.id, LatLngs: l.latLngs || (l as Line & {latlngs: L.LatLngExpression}).latlngs };
            })].map(l=>JSON.stringify(l))];
    
            console.log(realDots);
            console.log(realLines);
    
            for (const dot of realDots) fd.append(`data.Dots`, dot);
            for (const line of realLines) fd.append(`data.Lines`, line);
            
            await fetch(`${process.env.REACT_APP_NEW_API_URL}/api/route/add`, {
                method: 'POST',
                body: fd
            }).then(async response => {
                if(response.ok) console.log('Маршрут сохранён');
                const id = await response.json().catch(err=>alert(err));
                alert(id);
                await fetch(`${process.env.REACT_APP_NEW_API_URL}/api/route/get?id=${id}`)
                    .then(async response => {
                        console.log(await response.json())
                    }).catch(err=>alert(err));
            });
        }

        console.log(result);
    }*/

    handleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        const { routes, criteries } = this.state;
        const { theme, season } = criteries;
        
        const filters = {
            theme: theme === 'none' ? "" : theme, 
            season: season === 'none' ? "" : season
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
        //const center = map!.getCenter();
        const zoom = map!.getZoom();
        /*map!.remove();
        this.handleShowMap(center as L.LatLng, zoom);*/
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
            const content = `<h5 class="display-5">${dot.name}</h5><p>${dot.description || "Нет описания"}</p>`;
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
            //alert('284. Произошла ошибка. Попробуйте позже.')
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

    handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) : void => {
        const time = e.target.value as Time;

        const { criteries } = this.state;
        this.setState({
            criteries:{
                ...criteries,
                time
            }
        });
    }

    /*handleShowMap = (center?: number[] | L.LatLng, zoom?: number) => {
        const height = window.innerHeight - document.getElementsByTagName('header')[0]!.offsetHeight;
        const container = document.getElementById('main-container')!;
        container.style.height = `${height}px`;
        container.style.width = `${document.body.offsetWidth}px`;

        const map = createMap("MAP-ID", "Санкт-Петербург")! 
        this.setState({mapInfo: {...this.state.mapInfo, map, enabled: true}});

        center && map.setView(center as L.LatLngExpression, zoom || 13);
    }*/

    showMap = () => {
        const callback = () : void => {
            console.log('anim frame');
            const mapDiv = document.getElementById("MAP-ID");
            if(!mapDiv) {
                console.log("no div? :(");
                window.requestAnimationFrame(callback);
                return;
            };
            mapDiv.style.height="1000px";
            mapDiv.style.width="100%";
            const aside = document.getElementsByTagName('aside')[0]!;
            mapDiv.style.marginLeft = `${aside.offsetWidth}px`
            //mapDiv.style.width=`${mapDiv.offsetWidth - aside.offsetWidth}`;
            mapDiv.style.width="100vw;"

            const map = createMap("MAP-ID", "Эрмитаж Санкт-Петербург")!
            this.setState({mapInfo: {...this.state.mapInfo, map, enabled: true}});
        };
        window.requestAnimationFrame(callback);
    }
}