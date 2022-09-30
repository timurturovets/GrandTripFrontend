import React, { Component } from 'react'
import L from 'leaflet'
import RouteInfo from '../Components/RouteInfo'
import RouteInformation from '../Interfaces/RouteInformation'
import Dot from '../Interfaces/Dot'
import Line from '../Interfaces/Line'
import getPointBySearch from '../Functions/getPointBySearch'
import { getRouteById } from '../Functions/getRouteById'

type Theme = 'none' | 'modern-world' | 'history' | 'islands' | 'films' | 'literature'
type Season = 'none' | 'summer' | 'winter'
type Time = "none" | number

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

interface StateRoutes {
    clicked: Boolean,
    isLoading: Boolean,
    result: RouteInformation[],
    error?: string
}

interface RoutesPageState {
    mapInfo: MapInfo,
    criteries: RouteCriteries
    routes: StateRoutes
}

export default class RoutesPage extends Component<any, RoutesPageState> {
    static mapDivId: string = "map-div"

    constructor(props: any) {
        super(props);
        
        this.state = {
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
        const { mapInfo, criteries, routes } = this.state;
        const { enabled } = mapInfo;
        const { season} = criteries;
        const { clicked, isLoading, result, error } = routes
        return <div style={{textAlign: "left", display: "flex"}}>
        <div id="MySideNav" className="text-center" style={{zIndex: 100}}>
            <div className="bg-dark text-light p-3">
                <div className="form-check-inline form-switch m-2">
                    <input id="season-radio1" className="form-check-input" 
                    type="radio" name="SEASON" value="summer" checked={season === "summer"}
                        onChange={e => this.handleSeasonChange(e, "summer")} />
                    <label className="form-check-label">Лето</label>
                </div>
                <div className="form-check-inline form-switch m-2">
                    <input id="season-radio2" className=" form-check-input" 
                    type="radio" name="SEASON" value="winter" checked={season === "winter"}
                        onChange={e => this.handleSeasonChange(e, "winter")} />
                    <label className="form-check-label ">Зима</label>
                </div>
                <select onChange={e=>this.handleThemeChange(e.target.value as Theme)}>
                    <option value="none">Сбросить</option>
                    <option value="modern-world">Современный мир</option>
                    <option value="history">История</option>
                    <option value="islands">Острова</option>
                    <option value="films">Фильмы</option>
                    <option value="literature">Литературный дворик</option>
                </select>
                <div className="duration-input-wrapper">
                    <div className="form-group">
                        <input type="number" id="time-input" min={5} value="5"
                            style={{width: "35%"}}
                            onChange={e=>this.handleTimeChange(e)} />
                        <label>Длительность маршрута (в минутах)</label>
                    </div>
                </div>
                <button onClick={e=>this.handleSubmit(e)} className="btn btn-success">
                    OK
                </button>
            </div>

            <div id="routes">
                {clicked
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
        if(theme === "none" || season === "none") {
            alert('Вы не выбрали все опции')
            return;
        }
        
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

        await fetch(`http://localhost:8081/get_routes_by_filter?filters=${filters}`).then(async res=>{
            const ids = JSON.parse(await res.text()).ids;
            console.log(ids);
            const routeInformations: RouteInformation[] = []
            for(const id of ids) {
                await getRouteById(id).then(response => {
                    routeInformations.push(response);
                }).catch(err=>{
                    console.log(err)
                });
            }
            this.setState({
                routes: {
                    ...this.state.routes,
                    result: routeInformations
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
        for (const dot of route.dots) {
            console.log(dot);
            let newMarker = L.marker([dot.PositionX, dot.PositionY]);
            newMarker.bindPopup(L.popup().setContent(`<p>${dot.name}</p>`));
            newMarker.addTo(map!);
            markers.push(newMarker);
        }
        map!.setView([route.dots[0].PositionX, route.dots[0].PositionY], zoom > 13 ? zoom : 13)
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

    handleSeasonChange = (e: React.ChangeEvent<HTMLInputElement>, season: Season) : void => {
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
        const height = window.innerHeight - document.getElementById('header')!.offsetHeight;
        const width = window.innerWidth - document.getElementById('MySideNav')!.offsetWidth;

        const container = document.getElementById('main-container')!;   
        container.style.height = `${height}px`;
        container.style.width = `${width}px`;

        const map = L.map('MAP-ID').setView([51.0, 0], 13);
        this.setState({mapInfo: {...this.state.mapInfo, map, enabled: true}});
        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: 'pk.eyJ1IjoiYnl0ZWljIiwiYSI6ImNrdHh6bTRzNTFnbmUyb21ycnRyNjlwbHYifQ.6nc0vKKePD5XLytqJBcjAA'
        }).addTo(map);

        !center 
            ? getPointBySearch("Санкт-Петербург").then(response=>{
                response.features.forEach((center: any, i: number, arr: any) => {
                    var latlng = [center.center[1], center.center[0]] as L.LatLngExpression;
                    if (i > 0) return;

                    map.setView(latlng, zoom || 13)
                });
            })
            : map.setView(center as L.LatLngExpression, zoom || 13);
    }
}