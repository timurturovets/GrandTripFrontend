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

interface RoutesPageState {
    shareInfo: ShareInfo,
    mapInfo: MapInfo,
    criteries: RouteCriteries
    routes: StateRoutes
}

export default class RoutesPage extends Component<any, RoutesPageState> {
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

    componentDidMount() {
        this.showMap();
    }
    render() {
        const { shareInfo, routes, criteries } = this.state;
        const { isFromRef, refRoute, loading } = shareInfo;
        const { clicked, isLoading, result, error } = routes;

        return <AuthContextConsumer>{({isAuthenticated, info})=>
        <div style={{textAlign: "left", display: "flex"}}>
        <div id="MySideNav" className="text-center">
            <div className="bg-dark text-light p-3">
                <label>?????????? ????????: </label>
                <select className="form-select" onChange={e=>this.handleSeasonChange(e.target.value as Season)}>
                    <option value="none">??????????</option>
                    <option value="summer">????????</option>
                    <option value="autumn">??????????</option>
                    <option value="winter">????????</option>
                    <option value="spring">??????????</option>
                </select>
                <label>????????????????: </label>
                <select className="form-select" onChange={e=>this.handleThemeChange(e.target.value as Theme)}>
                    <option value="none">?????????????? ??????</option>
                    <option value="modern-world">?????????????????????? ??????</option>
                    <option value="history">??????????????</option>
                    <option value="islands">?????????????? ?? ??????????</option>
                    <option value="films">????????????</option>
                    <option value="literature">???????????????????????? ????????????</option>
                    <option value="activities">???????????????????? ????????????????????</option>
                    <option value="gastronomy">??????????????????????</option>
                    <option value="abiturients">????????????????????????</option>
                </select>
                <label> ????????????????????????: </label>
                <div className="duration-input-wrapper">
                    <div className="form-group">
                        <select className="form-select"
                        onChange={e=>this.setState({criteries:
                         {...criteries, time: parseInt(e.target.value)}})}>
                            <option value={1}>1 ??????</option>
                            <option value={2}>2 ????????</option>
                            <option value={3}>3 ????????</option>
                            <option value={24}>1 ????????</option>
                         </select>
                    </div>
                </div>
                <button onClick={e=>this.handleSubmit(e)} className="btn btn-success">
                    OK
                </button>
            </div>

            <div id="routes">
                {isAuthenticated && 
                <Link to="/constructor" className="btn btn-outline-success" style={{width: "100%"}}>
                    ?????????????? ?????????? ??????????????</Link>}
                    
                {isFromRef 
                    ? loading || !refRoute
                        ? <p>????????????????...</p>
                        : error
                            ? <p className="text-danger">{error}</p>
                            : <RouteInfo info={refRoute} 
                            onRouteRendering={this.handleRouteRendering} 
                            onAddingToFavourites={this.handleAddToFavourites} />
                    : clicked
                        ? <p>?????????????? ???? ???????????? "????", ?????????? ???????????????????? ????????????????</p>
                        : isLoading
                            ? <p>????????????????...</p>
                            : error
                                ? <p className="text-danger">{error}</p>
                                : result.map(route => <div key={route.id}><RouteInfo info={route} 
                                onRouteRendering={this.handleRouteRendering} 
                                onAddingToFavourites={this.handleAddToFavourites} /></div>)
                }
            </div>
        </div>
         <div id="main-container" style={{height:'100%', width: '100%'}}>
                <div id="MAP-ID" style={{height:'100%', width: '100%'}}></div>
            </div>
        </div>}
        </AuthContextConsumer>
    }

    handleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        const { criteries } = this.state;
        const { theme, season } = criteries;
        
        const filters = JSON.stringify({
            theme, season
        });
        console.log(filters);
        console.log(process.env.REACT_APP_API_URL);
        this.setState({routes: {...this.state.routes, isLoading: true}});

        await get(`${process.env.REACT_APP_API_URL}/routes/getroutes`, { filters }).then(async res=>{
            const routes = (await res.json()).routes;
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
            alert('?????????????????? ????????????. ???????????????????? ??????????.');
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
        while(!(route.dots instanceof Array)) route.dots = JSON.parse(route.dots as unknown as string);
        while(!(route.lines instanceof Array)) route.lines = JSON.parse(route.lines as unknown as string);
        for (const dot of route.dots) {
            console.log(dot);
            let newMarker = L.marker([dot.positionX, dot.positionY]);
            const content = `<h5 class="display-5">${dot.name}</h5><p>${dot.description || "?????? ????????????????"}</p>`;
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
            console.log(realLatLngs);
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
            alert('?????????????????? ????????????. ???????????????????? ??????????.')
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

        const map = createMap("MAP-ID", "??????????-??????????????????")! 
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

            const height = window.innerHeight - document.getElementsByTagName('header')[0]!.offsetHeight;
            const container = document.getElementById('main-container')!;
            container.style.height = `${height}px`;

            const map = createMap("MAP-ID", "?????????????? ??????????-??????????????????")!
            this.setState({mapInfo: {...this.state.mapInfo, map, enabled: true}});
        };
        window.requestAnimationFrame(callback);
    }
}