import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import L from 'leaflet'
import RouteInfo from '../Components/RouteInfo'
import RouteInformation from '../Interfaces/RouteInformation'
import Dot from '../Interfaces/Dot'
import Line from '../Interfaces/Line'
import { getRouteById } from '../Functions/getRouteById'
import createMap from '../Functions/createMap'

type Theme = 'none' | 'modern-world' | 'history' | 'islands' | 'films' | 'literature' 
| 'activities' | 'gastronomy' | 'abiturients'
type Season = 'none' | 'summer' | 'winter'
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
    refRoute?: RouteInformation,
    loading: boolean
}

interface StateRoutes {
    clicked: Boolean,
    isLoading: Boolean,
    result: RouteInformation[],
    error?: string
}

interface RoutesPageState {
    shareInfo: ShareInfo,
    mapInfo: MapInfo,
    criteries: RouteCriteries
    routes: StateRoutes
}

export default class RoutesPage extends Component<any, RoutesPageState> {
    static mapDivId: string = "map-div"

    constructor(props: any) {
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

    render() {
        const { shareInfo, mapInfo, criteries, routes } = this.state;
        const { isFromRef, refRoute, loading } = shareInfo;
        const { enabled } = mapInfo;
        const { season} = criteries;
        const { clicked, isLoading, result, error } = routes
        return <div style={{textAlign: "left", display: "flex"}}>
        <div id="MySideNav" className="text-center" style={{zIndex: 100}}>
            <div className="bg-dark text-light p-3">
                {/*<div className="form-check-inline form-switch m-2">
                    <input id="season-radio1" className="form-check-input" 
                    type="radio" name="SEASON" value="summer" checked={season === "summer"}
                        onChange={e => this.handleSeasonChange("summer")} />
                    <label className="form-check-label">Лето</label>
                </div>
                <div className="form-check-inline form-switch m-2">
                    <input id="season-radio2" className=" form-check-input" 
                    type="radio" name="SEASON" value="winter" checked={season === "winter"}
                        onChange={e => this.handleSeasonChange("winter")} />
                    <label className="form-check-label ">Зима</label>
                </div>*/}
                <select onChange={e=>this.handleSeasonChange(e.target.value as Season)}>
                    <option value="none" selected={season==="none"}>Сбросить</option>
                    <option value="summer" selected={season==="summer"}>Лето</option>
                    <option value="winter" selected={season==="winter"}>Зима</option>
                </select>
                <select onChange={e=>this.handleThemeChange(e.target.value as Theme)}>
                    <option value="none">Выбрать все</option>
                    <option value="modern-world">Современный мир</option>
                    <option value="history">История</option>
                    <option value="islands">Острова и парки</option>
                    <option value="films">Фильмы</option>
                    <option value="literature">Литературный дворик</option>
                    <option value="activities">Физические активности</option>
                    <option value="gastronomy">Гастрономия</option>
                    <option value="abiturients">Абитуриентам</option>
                </select>
                <div className="duration-input-wrapper">
                    <div className="form-group">
                        <input type="number" id="time-input" min={1} max={24}
                            style={{width: "20%"}}
                            onChange={e=>this.handleTimeChange(e)} />
                        <label> Длительность маршрута</label>
                    </div>
                </div>
                <button onClick={e=>this.handleSubmit(e)} className="btn btn-success">
                    OK
                </button>
            </div>

            <div id="routes">
                <Link to="/constructor" className="btn btn-outline-success" style={{width: "100%"}}>
                    Создать новый маршрут</Link>
                {isFromRef 
                    ? loading || !refRoute
                        ? <p>Загрузка...</p>
                        : error
                            ? <p className="text-danger">{error}</p>
                            : <RouteInfo info={refRoute} onRouteRendering={this.handleRouteRendering} />
                    : clicked
                        ? <p>Нажмите на кнопку "ОК", чтобы отобразить маршруты</p>
                        : isLoading
                            ? <p>Загрузка...</p>
                            : error
                                ? <p className="text-danger">{error}</p>
                                : result.map(route => <div key={route.id}><RouteInfo info={route} 
                                onRouteRendering={this.handleRouteRendering} /></div>)
                }
            </div>
        </div>
         <div id="main-container" style={{height:'100%', width: '100%'}}>
            {!enabled 
            && <button className="btn btn-success" onClick={e=>this.handleShowMap()}>Показать карту</button>}
                <div id="MAP-ID" style={{height:'100%', width: '100%'}}></div>
            </div>
        </div>
    }

    handleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        const { criteries } = this.state;
        const { theme, season } = criteries;
        /*if(theme === "none" || season === "none") {
            alert('Вы не выбрали все опции')
            return;
        }*/
        
        const filters = JSON.stringify({
            start: 0,
            end: 10000,
            criteries: [
                "theme",
                "season"
            ],
            values: [
                theme,
                season
            ]
        });
        console.log(filters);
        console.log(process.env.REACT_APP_API_URL);
        this.setState({routes: {...this.state.routes, isLoading: true}});
        await fetch(`${process.env.REACT_APP_API_URL}/get_routes_by_filters?filters=${filters}`).then(async res=>{
            const ids = JSON.parse(await res.text()).ids;
            console.log(ids);
            const routeInformations: RouteInformation[] = []
            for(const id of ids.map((i:any)=>i.id)) {
                await getRouteById(id).then(response => {
                    response.dots = JSON.parse(response.dots);
                    if(!response.dots[0].PositionX) response.dots = JSON.parse(response.dots);
                    response.lines = JSON.parse(response.lines);
                    routeInformations.push(response);
                }).catch(err=>{
                    console.log(err)
                });
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
            alert('Произошла ошибка. Попробуйте позже.');
        })
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
        if(!route.dots[0]?.PositionX) route.dots = JSON.parse(route.dots as unknown as string);
        if(!route.lines[0]?.latlngs) route.lines = JSON.parse(route.lines as unknown as string);
        for (const dot of route.dots) {
            console.log(dot);
            let newMarker = L.marker([dot.PositionX, dot.PositionY]);
            const content = `<h5>${dot.name}</h5><p>${dot.desc || "Нет описания"}</p>`;
            newMarker.bindPopup(L.popup().setContent(content));
            newMarker.addTo(map!);
            markers.push(newMarker);
        }
        map!.setView([route.dots[0].PositionX, route.dots[0].PositionY], zoom > 13 ? zoom : 13);
        console.log(route.lines);
        if(!route.lines[0]?.id) route.lines = JSON.parse(route.lines as unknown as string);
        for (const line of route.lines) {
            let realLatLngs: {lat: number, lng: number}[] = [];
            for(let latlng of line.latlngs) {
                const unwrapped = latlng as number[];
                realLatLngs.push({lat: unwrapped[0], lng: unwrapped[1]});
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

    handleShowMap = (center?: number[] | L.LatLng, zoom?: number) => {
        const height = window.innerHeight - document.getElementsByTagName('header')[0]!.offsetHeight;

        const cont = document.getElementById("cont")!;
        const div = cont.children[0] as HTMLElement;
        div.style.width = `${cont.offsetWidth}px`;
        const container = document.getElementById('main-container')!;
        container.style.height = `${height}px`;
        container.style.width = `${cont.offsetWidth}px`;

        const map = createMap("MAP-ID", "Санкт-Петербург")! 
        this.setState({mapInfo: {...this.state.mapInfo, map, enabled: true}});

        center && map.setView(center as L.LatLngExpression, zoom || 13);
    }
}