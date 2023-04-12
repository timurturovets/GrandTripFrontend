import React, { Component } from 'react'
import L from 'leaflet'
import Dot from '../Interfaces/Dot'
import Line from '../Interfaces/Line'
import DotsList from './DotsList' 
import LinesList from './LinesList'
import { RouteMode } from '../Interfaces/RouteMode'
import { orsAccessToken } from '../Constants'
import { post } from '../Functions/requests'
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
const themes = {
    'Без тематики': 'none',
    'Современный мир': 'modern-world',
    'История': 'history',
    'Острова и парки': 'islands',
    'Фильмы': 'films',
    'Литературный дворик': 'literature',
    'Физические активности': 'activities',
    'Гастрономия': 'gastronomy',
    'Абитуриентам': 'abiturients'
}
type ThemesKey = keyof typeof themes;

type Season = 'none' | 'summer' | 'winter' | 'spring' | 'autumn'
const seasons = {
    'Все сезоны': 'none',
    'Лето': 'summer',
    'Весна' : 'spring',
    'Зима': 'winter',
    'Осень': 'autumn'
}
type SeasonsKey = keyof typeof seasons;


type City = 'kzn' | 'spb'
const cities = {
    'Казань': 'kzn',
    'Санкт-Петербург': 'spb'
}
type CitiesKey = keyof typeof cities;

interface ConstructorToolbarState {
    isEditMode: boolean,
    editId: number,
    browsingLines: boolean,
    name: Nullable<string>,
    description: Nullable<string>,
    theme: Theme,
    season: Season,
    city: City,
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
            theme: "none",
            season: "none",
            city: 'kzn',
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
                    lastLineId++;
                }
                this.setState({
                    buildingLineInfo: buildingLineInfo, 
                    mapLines: mapLines, 
                    lastLineId: lastLineId});
            } else {
                for(const obj of this.state.dots){
                    if(obj.positionX === latlng.lat && obj.positionY === latlng.lng) return;
                }

                const marker = L.marker(latlng);
                markers.push(marker);
                marker.addTo(map);
                dots.push({id: lastId, name: "", description: "", link: "", positionX: latlng.lat, positionY: latlng.lng});
                
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
            let routeDots = route.dots;
            console.log(routeDots);
            for(const dot of routeDots) {
                if(dots.find(d=>d.id === parseInt(dot.id))) continue;
                const marker = L
                .marker([dot.positionX, dot.positionY])
                .bindPopup(L
                    .popup()
                    .setContent(`<h5 class="display-5">${dot.name}</h5><p>${dot.description || "Без описания"}</p>`))
                .addTo(map);
                markers.push(marker);
                const stateDot = {...dot, id: parseInt(dot.id)};
                dots.push(stateDot);
                
                lastId++;
            }
            map.setView([routeDots[0].positionX, routeDots[0].positionY], map.getZoom());
        }
        let routeLines = route.lines;
        console.log(routeLines);
        for(const line of routeLines) {
            const polyline = L.polyline(line.latLngs, {color: "blue", weight: 5}).addTo(map);
            const stateLine = {...line};
            lines.push(stateLine);
            mapLines.push({id: lastLineId, line: polyline});
            lastLineId++;
        }
        const { name, description } = route;
        let { theme, season, city } = route;

        theme = themes[theme as ThemesKey] ? themes[theme as ThemesKey] : "none";
        season = seasons[season as SeasonsKey] ? seasons[season as SeasonsKey] : "none";
        city = cities[city as CitiesKey] ? cities[city as CitiesKey] : "spb";

        this.setState({name, description, dots, theme, season, city, markers, lines, mapLines, lastId, lastLineId});
    }

    render() {
        const { name, description, tracingInfo, buildingLineInfo, 
            searchingInfo, isEditMode, theme, season, city } = this.state;
        return <div className="sidebar__content">
                <div className="sidebar__title">Создание нового маршрута</div>
                <hr className="bg-dark mt-3 mb-3" />
                <input className="form-control" type="text" name="searchquery" placeholder="Текст поиска"
                    onChange={e => {
                        searchingInfo.searchQuery = e.target.value;
                        this.setState({searchingInfo});
                    }} value={searchingInfo.searchQuery}/>
                <button onClick={e => this.handleSearch(e)} className="button button--small sidebar__element">Найти точку</button>
                <hr className="bg-dark mt-3 mb-3" />
                {buildingLineInfo.buildingNow 
                ? <div>
                    <h2>
                        Нажмите на карту, чтобы {buildingLineInfo.latlngs.length < 1
                            ? "поставить первую точку линии"
                            : "продолжить проводить линию"}
                    </h2>
                    <button onClick={e=>this.endDrawingLine(e)} className="button button--small sidebar__element">Закончить проводить линию</button>
                </div>
                : tracingInfo.tracingNow
                    ? <div>
                        <button onClick={e=>{
                            e.preventDefault();
                            tracingInfo.tracingNow = false;
                            tracingInfo.startDotId = NaN;
                            tracingInfo.endDotId = NaN;
                            this.setState({tracingInfo: tracingInfo});
                        }} className="button button--small sidebar__element">Отмена</button>
                        <div className="form-check form-switch form-check-inline">
                            <input className="form-check-input" type="radio" name="mode" 
                                onClick={()=>{
                                    tracingInfo.mode = "foot-walking";
                                    this.setState({tracingInfo: tracingInfo});
                                }} defaultChecked/>
                            <label className="form-check-label" htmlFor="mode">Пешком</label>
                        </div>
                        <div className="form-check form-switch form-check-inline">
                            <input className="form-check-input" type="radio" name="mode" 
                                onClick={()=>{
                                    tracingInfo.mode = "driving-car";
                                    this.setState({tracingInfo: tracingInfo});
                                }} />
                            <label className="form-check-label" htmlFor="mode">На машине</label>
                        </div>
                        <div className="form-group mx-sm-3">
                            <input className="form-control" 
                            type="number" placeholder="Номер первой точки" 
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
                        <button onClick={e => this.handleTracing(e)} className="button button--small sidebar__element">
                            Соединить точки</button>
                        <hr className="bg-dark mt-3 mb-3" />
                    </div>
                    : <div>
                        {this.state.dots.length > 1
                            && <button className="button button--small sidebar__element" onClick={e => {
                                e.preventDefault();
                                this.setState({tracingInfo: {...this.state.tracingInfo, tracingNow: true}});
                                }}>Проложить маршрут между двумя точками</button>
                            }
                        {/*<button className="button button--small sidebar__element" onClick={e=>{
                            e.preventDefault();
                            buildingLineInfo.buildingNow = true;
                            this.setState({ buildingLineInfo });
                        }}>Провести линию</button>*/}
                        </div>
                }
                {this.state.browsingLines
                    ? <div>
                        <button className="button button--small sidebar__element" onClick={e=>{
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
                        <button className="button button--small sidebar__element" onClick={e => {e.preventDefault();
                        this.setState({browsingLines: true});}}>
                            Просмотреть проведённые линии
                            </button>
                        <DotsList 
                        dots={this.state.dots}
                        onDotDeleted={this.handleDotDelete}
                        onDotUpdated={this.handleDotUpdate} />
                        </div>
                }
                <hr className="bg-dark mt-3 mb-3" />
                {!tracingInfo.tracingNow && <div>
                        <div className="form-group">
                        <h2>Информация о маршруте</h2>
                        <input type="text" name="routeName"  className="form-control" value={name || ""}
                            placeholder="Название маршрута" onChange={e=>this.handleInfoChange(e, "routeName")} />
                        <textarea name="routeDesc" className="form-control" value={description || ""} 
                            placeholder="Описание маршрута" onChange={e=>this.handleInfoChange(e, "routeDesc")} />
                        </div>
                        <div className="form-group">
                        <h3>Добавить тематику</h3>
                        <select className="field field--small sidebar__element"
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
                            <h3>Выбрать сезон</h3>
                            <select className="field field--small sidebar__element" value={season ?? "none"}
                                onChange={e=>this.handleSeasonChange(e.target.value as Season)}>
                                <option value="none">Все сезоны</option>
                                <option value="summer">Лето</option>
                                <option value="autumn">Осень</option>
                                <option value="winter">Зима</option>
                                <option value="spring">Весна</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <h3>Выбрать город</h3>
                            <select className="field field--small sidebar__element" value={city ?? "spb"}
                                onChange={e=>this.handleCityChange(e.target.value as City)}>
                                    <option value="spb">Санкт-Петербург</option>
                                    <option value="kzn">Казань</option>
                                </select>
                        </div>
                        <div className="form-group">
                            <button className="button button--small sidebar__element" onClick={e=>this.onSubmit(e)}>
                                Отправить маршрут на обработку</button>
                            {isEditMode && <button className="btn btn-outline-danger" style={{width: '100%'}}
                                onClick={e=>this.onDelete(e)}>Удалить маршрут</button>}
                        </div>
                    </div>}
                </div>
    }

    handleThemeChange = (theme: Theme) => this.setState({ theme });

    handleSeasonChange = (season: Season) => this.setState({ season });

    handleCityChange = (city: City) => this.setState({ city });

    handleInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, type: string) => {
        e.preventDefault();

        const { value } = e.target;
        if(type === "routeName") {
            this.setState({ name: value });
        } else if(type === "routeDesc") {
            this.setState({ description: value });
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
                    if(latlng.lat === obj.positionX && latlng.lng === obj.positionY){
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
                if(field === "name") obj.name = value;
                else if(field === "desc") obj.description = value;
                else if(field === "link") obj.link = value;
                else return;            
                break;
            }
        }
        
        this.setState({ dots });
    }

    onSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        const { name, description, theme, season, city, dots, lines, isEditMode, editId } = this.state;
        console.log(dots);

        alert('Загрузка...');
        
        const realDots = [...[...dots.map(d=>{
            return { Id: d.id, Name: d.name, Description: d.description,
                PositionX: d.positionX 
                || (d as Dot & {PositionX: number}).PositionX, PositionY: d.positionY 
                || (d as Dot & {PositionY: number}).PositionY }
        })].map(d=>JSON.stringify(d))];

        const realLines = [...[...lines.map(l=>{
            return { Id: l.id, LatLngs: l.latLngs };
        })].map(l=>JSON.stringify(l))];

        const fd = new FormData();

        if(isEditMode) {
            fd.append('Id', `${editId}`);   
            fd.append('Name', name!);
            fd.append('Description', description!);
            fd.append('Theme', theme!);
            fd.append('Season', season!);
            fd.append('City', city!);

            console.log(realDots);
            console.log(realLines);

            for (const dot of realDots) fd.append(`Dots`, dot);
            for (const line of realLines) fd.append(`Lines`, line);

            await post(`${process.env.REACT_APP_NEW_API_URL}/api/route/update`, fd)
                .then(response => {
                    alert(`Маршрут успешно обновлён. ${response.status}`);
                });
        } else {
            fd.append('RouteName', name!);
            fd.append('Description', description!);
            fd.append('Theme', theme!);
            fd.append('Season', season!);
            fd.append('City', city!);
            console.log(realDots);
            console.log(realLines);

            for (const dot of realDots) fd.append(`Dots`, dot);
            for (const line of realLines) fd.append(`Lines`, line);
            
            await post(`${process.env.REACT_APP_NEW_API_URL}/api/route/add`, fd)
            .then(async response => {
                if(response.ok) alert('Маршрут сохранён');
                const id = await response.json();
                this.setState({isEditMode: true, editId: id});
            });
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

        dots.push({id: lastId, description: "", name: searchQuery, link: "", positionX: latlng[0], positionY: latlng[1]});
        lastId++;
        searchingInfo.searchQuery = undefined;
        this.setState({searchingInfo, lastId, dots, markers});
    }

    handleTracing = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        const { tracingInfo, dots } = this.state;
        const { startDotId, endDotId } = tracingInfo;

        console.log(dots);
        if(startDotId === endDotId || startDotId === null|| endDotId === null){
            console.log(`${startDotId} ${endDotId} err`);
            return;
        }

        const mode = tracingInfo.mode;
        
        const startDot = dots.find(d => d.id === startDotId);
        const endDot = dots.find(d => d.id === endDotId);
        if(!startDot) {
            alert('Неверный номер первой точки');
            return;
        }

        if(!endDot) {
            alert('Неверный номер второй точки');
            return;
        }
        /*for(const obj of this.state.dots){
            if(obj.id === startDotId) startDot = obj;
            if(obj.id === endDotId) endDot = obj;
        }*/
        let url = 'https://api.openrouteservice.org/v2/directions/';
        url += `${mode}?`
        url += `api_key=${orsAccessToken}`;
        //Конвертация в забугорный формат
        url += `&start=${startDot!.positionY},${startDot!.positionX}`; 
        url += `&end=${endDot!.positionY},${endDot!.positionX}`;
        const result = await fetch(url).then(response=>response.json());
        const coordinates = result.features[0].geometry.coordinates;

        for(let point of coordinates){ //Конвертация в отечественный формат
            let temp = point[0];
            point[0] = point[1];
            point[1] = temp;
        }


        let lastLineId = this.state.lastLineId;
        const { lines } = this.state;
        lines.push({id: lastLineId, latLngs: coordinates as L.LatLngExpression[]});

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
            lines.push({id: lastLineId, latLngs: latlngs});
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

        const fd = new FormData();
        fd.append('id', `${editId}`);
        await post(`${process.env.REACT_APP_NEW_API_URL}/api/route/delete`, fd)
            .then(response => {
                alert('Маршрут удалён.');
                window.location.href = "/routes";
            }).catch(err => {
                alert('Произошла ошибка при попытке удалить маршрут. Попробуйте позже')
            });
    }
}