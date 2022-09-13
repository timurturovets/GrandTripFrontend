import React, { Component } from 'react'
import L from 'leaflet'
import RouteInfo from '../Components/RouteInfo'
import RouteInformation from '../Interfaces/RouteInformation'
import Dot from '../Interfaces/Dot'
import Line from '../Interfaces/Line'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import getPointBySearch from '../Functions/getPointBySearch'

type Theme = 'none' | 'modern-world' | 'history' | 'islands' | 'films' | 'literature'
type Season = 'none' | 'summer' | 'winter'
type Time = 'none' | number

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
    lines: Line[]
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
                lines: []
            },
            criteries: {
                theme: "none",
                season: "none",
                time: "none"    
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
        console.log(criteries);
        const { enabled, center, dots, lines } = mapInfo;
        const { season} = criteries;
        const { clicked, isLoading, result, error } = routes
        return <div style={{textAlign: "left", display: "flex"}}>
        <div id="MySideNav" className="text-center" style={{zIndex: 100}}>
            <div className="bg-dark text-light p-3 rounded-bottom">
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
                            onChange={e=>this.handleTimeChange(e)} />
                        <label>Длительность маршрута (в минутах)</label>
                    </div>
                </div>
                <button onClick={e=>this.handleSubmit(e)}className="btn btn-success">
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
                            : result.map(route => <RouteInfo 
                                info={route} onRouteRendering={this.handleRouteRendering} />)
                }
            </div>
        </div>
         <div id="main-container" style={{height:'100%', width: '100%'}}>
            {!enabled && <button onClick={this.handleShowMap}>Показать карту</button>}
                <div id="MAP-ID" style={{height:'100%', width: '100%'}}></div>
            </div>
        </div>
    }

    handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        const { criteries } = this.state;
        const { theme, season, time } = criteries;
        if(theme === "none" || season === "none") {
            alert('Вы не выбрали все опции')
            return;
        }
        
    }

    handleRouteRendering = (routeId: string) => {
        
    }

    /*render_route = async (routeJson: string) => {
        const { map } = this.state;
        if(!map) return;

        const route = JSON.parse(routeJson);
        for (const dot of route.dots) {
            let dotLatLng: LatLngExpression = [dot.PositionX, dot.PositionY];
            let newMarker = L.marker(dotLatLng);
            let content =
                `id=${dot.id} Точка ${dot.name}. Описание - ${dot.desc}. <div id="dot${dot.id}"></div>`;
            let popup = L.popup()
                .setLatLng(dotLatLng)
                .setContent(content);
            newMarker.bindPopup(popup);
            newMarker.openPopup();
            newMarker.addTo(map);
            newMarker.on('click', e => {
                let elems = document.getElementsByClassName('leaflet-popup-content')
                let elem = elems[1];
                if (!elem) elem = elems[0];
                let iframe = document.createElement("iframe");
                iframe.setAttribute("src", `/desc_page${dot.link}`);
                elem.appendChild(iframe);
            });
        }
        for (const line of route.lines) {
            L.polyline(line.latlngs, { color: 'rgba(255, 157, 18, 1)', weight: 5 })
                .addTo(map);
        }
}*/
    handleThemeChange = (theme: Theme) : void => {
        const { criteries } = this.state;
        this.setState({
            criteries: {
                ...criteries,
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

    handleShowMap = () => {
        const height = window.innerHeight - document.getElementById('header')!.offsetHeight;
        const width = window.innerWidth - document.getElementById('MySideNav')!.offsetWidth;

        const container = document.getElementById('main-container')!;   
        container.style.height = `${height}px`;
        container.style.width = `${width}px`;

        const map = L.map('MAP-ID').setView([51.0, 0], 13);
        this.setState({mapInfo: {...this.state.mapInfo, enabled: true}});
        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: 'pk.eyJ1IjoiYnl0ZWljIiwiYSI6ImNrdHh6bTRzNTFnbmUyb21ycnRyNjlwbHYifQ.6nc0vKKePD5XLytqJBcjAA'
        }).addTo(map);

        getPointBySearch("Санкт-Петербург").then(response=>{
            response.features.forEach((center: any, i: number, arr: any) => {
                var latlng = [center.center[1], center.center[0]] as L.LatLngExpression;
                if (i > 0) return;

                map.setView(latlng, 13)
            });
        });
    }
}