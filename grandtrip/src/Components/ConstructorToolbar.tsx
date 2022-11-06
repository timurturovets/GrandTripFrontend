import React, { Component } from 'react'
import L from 'leaflet'
import Dot from '../Interfaces/Dot'
import Line from '../Interfaces/Line'
import DotsList from './DotsList' 
import LinesList from './LinesList'
import { RouteMode } from '../Interfaces/RouteMode'
import { orsAccessToken } from '../Constants'
import { get, post } from '../Functions/requests'
import getPointBySearch from '../Functions/getPointBySearch'
import { getRouteById } from '../Functions/getRouteById'

interface ConstructorToolbarProps {
    map: L.Map
}

interface MapLine {
    id: number,
    line: L.Polyline
}

type Nullable<T> = T | null
type Theme = 'none' | 'modern-world' | 'history' | 'islands' | 'films' | 'literature' 
| 'activities' | 'gastronomy' | 'abiturients'
type Season = 'none' | 'summer' | 'winter' | 'spring' | 'autumn'

interface ConstructorToolbarState {
    isEditMode: boolean,
    editId: number,
    browsingLines: boolean,
    name: Nullable<string>,
    description: Nullable<string>,
    theme: Nullable<Theme>,
    season: Nullable<Season>,
    dots: Dot[],
    lines: Line[],
    mapLines: MapLine[],
    markers: L.Marker[],
    lastId: number,
    lastLineId: number,
    tracingInfo: {
        tracingNow: boolean,
        startDotId: number,
        endDotId: number,
        mode: RouteMode,
    },
    buildingLineInfo: {
        buildingNow: boolean,
        line?: L.Polyline,
        latlngs: L.LatLngExpression[],
        markers: L.Marker[]
    },
    searchingInfo: {
        searchQuery?: string
    }
}

export default class ConstructorToolbar extends Component<ConstructorToolbarProps, ConstructorToolbarState> {
    constructor(props: ConstructorToolbarProps) {
        super(props);

        this.state = {
            isEditMode: false,
            editId: NaN,
            browsingLines: false,
            name: null, 
            description: null, 
            theme: null,
            season:null,
            dots: [],
            lines: [],
            mapLines: [],
            markers: [],
            lastId: 1,
            lastLineId: 1,
            tracingInfo: { tracingNow: false, startDotId: NaN, endDotId: NaN, mode: "foot-walking" },
            buildingLineInfo: { buildingNow: false, line: undefined, latlngs: [], markers: [] },
            searchingInfo: { searchQuery: undefined }
        };
        const { map } = props;
        map.on("click", e=> {
            const latlng = e.latlng; 
            let {buildingLineInfo, mapLines, lastId, lastLineId, markers, dots} = this.state;

            if (buildingLineInfo.buildingNow) {
                buildingLineInfo.latlngs.push(latlng);

                const marker = L.marker(latlng);
                marker.addTo(map);
                buildingLineInfo.markers.push(marker);
                
                if(buildingLineInfo.latlngs.length > 1){
                    const line = buildingLineInfo.line!;
                    line.addLatLng(latlng);
                    line.remove();
                    line.addTo(map);
                } else {
                    const line = L.polyline(buildingLineInfo.latlngs, {color:'blue', weight: 5});
                    buildingLineInfo.line = line;
                    mapLines.push({id: lastLineId, line: line});
                    console.log('----------------');
                    console.log(line);
                    console.log('----------------');
                    lastLineId++;
                }
                this.setState({
                    buildingLineInfo: buildingLineInfo, 
                    mapLines: mapLines, 
                    lastLineId: lastLineId});
            } else {
                for(const obj of this.state.dots){
                    if(obj.PositionX === latlng.lat && obj.PositionY === latlng.lng) return;
                }

                const marker = L.marker(latlng);
                markers.push(marker);
                marker.addTo(map);
                dots.push({id: lastId, name: "", desc: "", link: "", PositionX: latlng.lat, PositionY: latlng.lng});
                
                lastId++;                

                this.setState({ lastId, dots, markers });
            }
        });
    }
    
    async componentDidMount() {
        const query = new URLSearchParams(window.location.search);
        if(!query.has("edit")) return;
        const id = parseInt(query.get("edit")!);
        
        this.setState({isEditMode: true, editId: id});

        const route = await getRouteById(id);
        console.log(route);

        const { map } = this.props;
        const { dots, markers, lines, mapLines } = this.state;
        let { lastId, lastLineId } = this.state;    
        if(!route.dots || route.dots.length < 1) {
            alert('У этого маршрута нет точек')
        } else {
            let routeDots = JSON.parse(route.dots);
            while(!routeDots[0].PositionX) {
                routeDots = JSON.parse(routeDots);
            }
            console.log(routeDots);
            for(const dot of routeDots) {
                const marker = L
                .marker([dot.PositionX, dot.PositionY])
                .bindPopup(L
                    .popup()
                    .setContent(`<h1>${dot.name}</h1><p>${dot.desc || "Без описания"}</p>`))
                .addTo(map);
                markers.push(marker);
                const stateDot = {...dot};
                dots.push(stateDot);
                
                lastId++;
            }
            map.setView([routeDots[0].PositionX, routeDots[0].PositionY], map.getZoom());
        }
        let routeLines = JSON.parse(route.lines);
        while(!(routeLines instanceof Array)) {
            routeLines = JSON.parse(routeLines);
        } 
        console.log(routeLines);
        for(const line of routeLines) {
            const polyline = L.polyline(line.latlngs, {color: "blue", weight: 5}).addTo(map);
            const stateLine = {...line};
            lines.push(stateLine);
            mapLines.push({id: lastLineId, line: polyline});
            lastLineId++;
        }
        const { name, description, theme, season } = route;
        this.setState({name, description, dots, theme, season, markers, lines, mapLines, lastId, lastLineId});
    }

    render() {
        const { name, description, tracingInfo, buildingLineInfo, 
            searchingInfo, isEditMode, theme, season } = this.state;
            console.log(theme);
        return <div className="bg-dark text-light">
                <input className="form-control" type="text" name="searchquery" placeholder="Текст поиска"
                    onChange={e => {
                        searchingInfo.searchQuery = e.target.value;
                        this.setState({searchingInfo});
                    }} value={searchingInfo.searchQuery}/>
                <button onClick={e => this.handleSearch(e)} className="constructor-button">Найти точку</button>
                {buildingLineInfo.buildingNow 
                ? <div>
                    <h2 className="text-light">
                        Нажмите на карту, чтобы {buildingLineInfo.latlngs.length < 1
                            ? "поставить первую точку линии"
                            : "продолжить проводить линию"}
                    </h2>
                    <button onClick={e=>this.endDrawingLine(e)} className="constructor-button">Закончить проводить линию</button>
                </div>
                : tracingInfo.tracingNow
                    ? <div>
                        <button onClick={e=>{
                            e.preventDefault();
                            tracingInfo.tracingNow = false;
                            tracingInfo.startDotId = NaN;
                            tracingInfo.endDotId = NaN;
                            this.setState({tracingInfo: tracingInfo});
                        }} className="constructor-button">Отмена</button>
                        <div className="form-check form-switch form-check-inline">
                            <input className="form-check-input" type="radio" name="mode" 
                                onClick={()=>{
                                    tracingInfo.mode = "foot-walking";
                                    this.setState({tracingInfo: tracingInfo});
                                }} defaultChecked/>
                            <label className="form-check-label text-light" htmlFor="mode">Пешком</label>
                        </div>
                        <div className="form-check form-switch form-check-inline">
                            <input className="form-check-input" type="radio" name="mode" 
                                onClick={()=>{
                                    tracingInfo.mode = "driving-car";
                                    this.setState({tracingInfo: tracingInfo});
                                }} />
                            <label className="form-check-label text-light" htmlFor="mode">На машине</label>
                        </div>
                        <div className="form-group mx-sm-3">
                            <input className="form-control" 
                            type="number" min="1" placeholder="Номер первой точки" 
                                onChange={e=>{
                                    e.preventDefault();
                                    tracingInfo.startDotId = parseInt(e.target.value);
                                    this.setState({tracingInfo: tracingInfo});
                                }}/>
                        </div>
                        <div className="form-group mx-sm-3">
                            <input className="form-control"
                            type="number" min="2" placeholder="Номер второй точки" 
                                onChange={e => {
                                    e.preventDefault();
                                    tracingInfo.endDotId = parseInt(e.target.value);
                                    this.setState({tracingInfo: tracingInfo});
                                }}/>
                        </div>
                        <button onClick={e => this.handleTracing(e)} className="constructor-button">
                            Соединить точки</button>
                    </div>
                    : <div>
                        {this.state.dots.length > 1
                            && <button className="constructor-button" onClick={e => {
                                e.preventDefault();
                                this.setState({tracingInfo: {...this.state.tracingInfo, tracingNow: true}});
                                }}>Проложить маршрут между двумя точками</button>
                            }
                        <button className="constructor-button" onClick={e=>{
                            e.preventDefault();
                            buildingLineInfo.buildingNow = true;
                            this.setState({buildingLineInfo: buildingLineInfo});
                        }}>Провести линию</button>
                        </div>
                }
                {this.state.browsingLines
                    ? <div>
                        <button className="constructor-button" onClick={e=>{
                            e.preventDefault();
                            this.setState({browsingLines: false})
                        }}>
                            Просмотреть поставленные точки
                        </button>
                        <LinesList 
                        lines={this.state.lines}
                        onLineHighlighted={this.handleLineHighlight}
                        onLineDeleted={this.handleLineDelete}
                         />
                        </div>
                    : <div>
                        <button className="constructor-button" onClick={e => {e.preventDefault();
                        this.setState({browsingLines: true});}}>
                            Просмотреть поставленные линии
                            </button>
                        <DotsList 
                        dots={this.state.dots}
                        onDotDeleted={this.handleDotDelete}
                        onDotUpdated={this.handleDotUpdate} />
                        </div>
                }
                {!tracingInfo.tracingNow && <div>
                        <div className="form-group">
                        <h2 className="text-light">Информация о маршруте</h2>
                        <input type="text" name="routeName"  className="form-control" value={name || ""}
                            placeholder="Название маршрута" onChange={e=>this.handleInfoChange(e, "routeName")} />
                        <input type="text" name="routeDesc" className="form-control" value={description || ""} 
                            placeholder="Описание маршрута" onChange={e=>this.handleInfoChange(e, "routeDesc")} />
                        </div>
                        <div className="form-group">
                        <h3 className="text-light">Добавить тематику</h3>
                        <select className="form-select"
                        onChange={e=>this.handleThemeChange(e.target.value as Theme)}>
                            <option value="none" selected={theme==="none"}>Сбросить</option>
                            <option value="modern-world" selected={theme==="modern-world"}>
                                Современный мир</option>
                            <option value="history" selected={theme==="history"}>История</option>
                            <option value="islands" selected={theme==="islands"}>Острова и парки</option>
                            <option value="films" selected={theme==="films"}>Фильмы</option>
                            <option value="literature" selected={theme==="literature"}>
                                Литературный дворик</option>
                            <option value="activities" selected={theme==="activities"}>
                            Физические активности</option>
                            <option value="gastronomy" selected={theme==="gastronomy"}>
                            Гастрономия</option>
                            <option value="abiturients" selected={theme==="abiturients"}>
                            Абитуриентам</option>
                        </select>
                        </div>
                        <div className="form-group">
                            <h3 className="text-light">Выбрать сезон</h3>
                        <select className="form-select"
                            onChange={e=>this.handleSeasonChange(e.target.value as Season)}>
                            <option value="none" selected={season==="none"}>Все сезоны</option>
                            <option value="summer" selected={season==="summer"}>Лето</option>
                            <option value="autumn" selected={season==="autumn"}>Осень</option>
                            <option value="winter" selected={season==="winter"}>Зима</option>
                            <option value="spring" selected={season==="spring"}>Весна</option>
                        </select>
                        </div>
                        <div className="form-group">
                            <button className="constructor-button" onClick={e=>this.onSubmit(e)}>
                                Отправить маршрут на обработку</button>
                            {isEditMode && <button className="btn btn-outline-danger" style={{width: '100%'}}
                                onClick={e=>this.onDelete(e)}>Удалить маршрут</button>}
                        </div>
                    </div>}
            </div>
    }

    handleThemeChange = (theme: Theme) => {
        this.setState({theme});
    }

    handleSeasonChange = (season: Season) => {
        this.setState({season});
    }

    handleInfoChange = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
        e.preventDefault();

        const { value } = e.target;
        if(type === "routeName"){
            this.setState({name: value});
        } else if(type === "routeDesc") {
            this.setState({description: value});
        } else console.log('err');
    }

    handleLineHighlight = (id: number) => {
        console.log(`highlighting id is ${id}`);
        const mapLines = this.state.mapLines;
        const lineObject = mapLines.find(l => l.id === id)!;
        const latlngs = lineObject.line.getLatLngs() as L.LatLngExpression[];
        lineObject.line.remove();
    
        const newLine = L.polyline(latlngs, {color: 'green', weight: 7}).addTo(this.props.map);
        setTimeout(()=>{
            newLine.remove();
            const sourceLine = L.polyline(latlngs, {color: 'blue', weight:5});
            mapLines.find(l => l.id === id)!.line = sourceLine;
            sourceLine.addTo(this.props.map);
            this.setState({mapLines});
        }, 1000);
    }

    handleLineDelete = (id: number) => {
        console.log(`deleting id is ${id}`);

        const { lines, mapLines} = this.state;
        const line = lines.find(l => l.id === id)!;
        const mapLine = mapLines.find(l => l.id === id)!;
        console.log(mapLine);
        const what = mapLine.line.remove();
        console.log(what);
        lines.splice(lines.indexOf(line), 1);
        mapLines.splice(mapLines.indexOf(mapLine), 1);
        alert('Сохраните маршрут и перезагрузите страницу, чтобы линия пропала с карты');
        this.setState({lines, mapLines});    
    }

    handleDotDelete = (id: number) => {
        let { lastId } = this.state;
        const { dots, markers, tracingInfo } = this.state;
        for(const obj of dots){
            if(obj.id === id){
                dots.splice(dots.indexOf(obj), 1);
                for(const m of markers){
                    const latlng = m.getLatLng();
                    if(latlng.lat === obj.PositionX && latlng.lng === obj.PositionY){
                        m.remove();
                        markers.splice(markers.indexOf(m), 1);
                        break;
                    }
                }
                for(const d of dots){
                    if(d.id < id) continue;
                    d.id--;
                }
                break;
            }
        }        
        if(dots.length < 2) {
            tracingInfo.tracingNow = false;
            tracingInfo.startDotId = NaN;
            tracingInfo.endDotId = NaN;
        }

        lastId--;

        this.setState({lastId, dots, markers, tracingInfo});
    }

    handleDotUpdate = (id: number, field: string, value: string) => {
        const dots = this.state.dots;
        for(const obj of dots){
            if(obj.id === id){
                console.log(`changing ${field} to ${value}`);
                if(field === "name") obj.name = value;
                else if(field === "desc") obj.desc = value;
                else if(field === "link") obj.link = value;
                else return;            
                break;
            }
        }
        
        this.setState({dots: dots});
    }
    //TODO fix
    onSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        const { name, description, theme, season, dots, lines, isEditMode, editId } = this.state;
        const object = {
            name,
            description,
            dots,
            lines,
            theme,
            season
        };
        console.log(dots);
        const json = JSON.stringify(object);
        console.log(json);
        if(isEditMode) {
            /*const request = get(`${process.env.REACT_APP_API_URL}/edit_route`, {route: json, id: editId})
            .then(async response => await response.json())
            .then(response => {
                alert('Маршрут успешно сохранён!');
            }).catch(err => {
                alert('Произошла ошибка при попытке сохранить маршрут. Попробуйте позже.');
            });
            await request;*/
            const request = post(`${process.env.REACT_APP_API_URL}/edit_route_post`, {route: object, id: editId})
            .then(response =>{
                alert('Маршрут успешно сохранён');
            }).catch(err => {
                alert('Произошла ошибка при попытке сохранить маршрут. Попробуйте позже.');
            });
            await request;
        } else {
            /*const request = get(`${process.env.REACT_APP_API_URL}/add_route`, {route: json})
            .then(response => {
                // eslint-disable-next-line no-restricted-globals
                let answer = confirm("Маршрут успешно сохранён! Перейти на страницу со всеми маршрутами?");
                if (answer) window.location.href = "/routes";
                else {
                    this.setState({isEditMode: true, editId: response});
                }
            }).catch(err => {
                alert('Произошла ошибка при попытке сохранить маршрут. Попробуйте позже. При перезагрузке страницы изменения пропадут.');
            });

            await request;*/
            const request = post(`${process.env.REACT_APP_API_URL}/add_route_post`, 
            {route: object, id: editId}).then(async response => await response.json())
            .then(async response => {
                //eslint-disable-next-line no-restricted-globals
                let answer = confirm("Маршрут успешно сохранён! Перейти на страницу со всеми маршрутами?");
                if (answer) window.location.href = "/routes";
                else {
                    this.setState({isEditMode: true, editId: response});
                }
            }).catch(err => {
                alert(`Произошла ошибка при попытке сохранить маршрут. Попробуйте позже. При перезагрузке страницы изменения пропадут.`);
            });

            await request;
        }
    }

    handleSearch = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        const { searchingInfo, dots, markers } = this.state;
        let { lastId } = this.state;
        const { searchQuery } = searchingInfo;
        if(!searchQuery) return;

        const result = await getPointBySearch(searchQuery);
        let latlng = [];
        const point = result.features[0].center;
        latlng[0] = point[1];
        latlng[1] = point[0];

        const marker = L.marker(latlng as L.LatLngExpression);
        marker.addTo(this.props.map);
        markers.push(marker);

        dots.push({id: lastId, desc: "", name: searchQuery, link: "", PositionX: latlng[0], PositionY: latlng[1]});
        lastId++;
        searchingInfo.searchQuery = undefined;
        this.setState({searchingInfo, lastId, dots, markers});
    }

    handleTracing = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        const tracingInfo = this.state.tracingInfo;
        const startDotId = tracingInfo.startDotId, endDotId = tracingInfo.endDotId;
        if(startDotId === endDotId || startDotId === null || endDotId === null) return;

        let startDot: Dot, endDot: Dot, mode = tracingInfo.mode;
        for(const obj of this.state.dots){
            if(obj.id === startDotId) startDot = obj;
            if(obj.id === endDotId) endDot = obj;
        }
        let url = 'https://api.openrouteservice.org/v2/directions/';
        url += `${mode}?`
        url += `api_key=${orsAccessToken}`;
        //Конвертация в забугорный формат
        url += `&start=${startDot!.PositionY},${startDot!.PositionX}`; 
        url += `&end=${endDot!.PositionY},${endDot!.PositionX}`;
        const result = await fetch(url).then(response=>response.json());
        const coordinates = result.features[0].geometry.coordinates;

        for(let point of coordinates){ //Конвертация в отечественный формат
            let temp = point[0];
            point[0] = point[1];
            point[1] = temp;
        }


        let lastLineId = this.state.lastLineId;
        const { lines } = this.state;
        lines.push({id: lastLineId, latlngs: coordinates as L.LatLngExpression[]});

        const mapLines = this.state.mapLines;
        const mapLine = L.polyline(coordinates, {color:'blue', weight:5});

        mapLines.push({id: lastLineId, line: mapLine});
        mapLine.addTo(this.props.map);

        lastLineId++;

        tracingInfo.tracingNow = false;
        tracingInfo.startDotId = NaN;
        tracingInfo.endDotId = NaN;
        tracingInfo.mode = "foot-walking";
        this.setState({lines: lines, mapLines: mapLines, lastLineId: lastLineId, tracingInfo: tracingInfo});
    }

    endDrawingLine = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        const { buildingLineInfo } = this.state;
        const {lines, mapLines} = this.state;

        const latlngs = buildingLineInfo.latlngs;
        let lastLineId = this.state.lastLineId;
        if(latlngs.length > 0){
            const mapLine = L.polyline(latlngs, {color: 'blue', weight: 5}).addTo(this.props.map);
            lines.push({id: lastLineId, latlngs});
            mapLines.push({id: lastLineId, line: mapLine});
            lastLineId++;
        }
        for(const marker of buildingLineInfo.markers){
            marker.remove();
        }
        buildingLineInfo.buildingNow = false;
        buildingLineInfo.latlngs = [];
        buildingLineInfo.markers = [];  

        this.setState({lastLineId, 
            mapLines,
            buildingLineInfo,
            lines});
    }

    onDelete = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        
        const { name, editId } = this.state;
        // eslint-disable-next-line no-restricted-globals
        if(!confirm(`Вы уверены, что хотите удалить маршрут "${name}"?`)) return;

        const request = get(`${process.env.REACT_APP_API_URL}/delete_route`, {id: editId})
            .then(response => {
                alert('Маршрут удалён.');
                window.location.href = "/routes";
            }).catch(err => {
                alert('Произошла ошибка при попытке удалить маршрут. Попробуйте позже')
            });
        await request;
    }
}