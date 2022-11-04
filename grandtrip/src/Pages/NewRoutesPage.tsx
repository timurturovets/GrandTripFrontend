import React, { Component } from 'react'
import { getRouteById } from '../Functions/getRouteById'
import RouteInformation from '../Interfaces/RouteInformation'

type Theme = 'none' | 'modern-world' | 'history' | 'islands' | 'films' | 'literature' | 'activities'
type Season = 'none' | 'summer' | 'winter'

interface RoutesPageState {
    theme: Theme,
    choosedTheme: boolean,
    season: Season,
    choosedSeason: boolean,
    isLoading: boolean
}
export default class NewRoutesPage extends Component<any, RoutesPageState> {
    constructor(props: any) {
        super(props);

        this.state = {
            theme: 'none',
            choosedTheme: false,
            season: 'none',
            choosedSeason: false,
            isLoading: false
        };
    }
    render() {
        const info = {
            "none": {
                h:"Выбрать все маршруты ", 
                d: "Вы сможете ознакомиться со всеми существующими маршрутами.",
                p: "bg-spb2.jpg"}, 
            "modern-world": {
                h:"Современный мир", 
                d: "Ознакомьтесь с местами, связанными с современным миром, к примеру - местами для фотосессий.",
                p: "lakhta.jpg"},
            "history": {
                h:"История", 
                d: "Пройдясь по историческим маршрутам, вы сможете максимально глубокo познакомиться с историей Петербурга",
                p: "petya.jpg"
            },
            "islands":{
                h:"Острова и парки", 
                d: "Пройдитесь по живописным островам города Санкт-Петербурга",
                p: "ostrov.jpg"},
            "films": {
                h:"Фильмы", 
                d: "В Петербурге, помимо \"Брата\", снималось ещё множество фильмов, по местам съёмок которых вы сможете пройти, пользуясь этими маршрутами.",
                p: "brat.jpg"},
            "literature": {
                h:"Литературный дворик", 
                d: "Пройдитесь по местам, где жили и творили величайшие писатели России",
                p: "pushkin.jpg"},
            "activities": {
                h:"Физические активности", 
                d: "Проходя по маршрутам из этого списка, вы сможете как полюбоваться красотой Петербурга, так и немного подразмяться",
                p: "sport.jpg" }};

        const seasonInfo = {
            "none": {
                h: "Все времена года",
                d: "Выберите все маршруты, вне зависимости от времени года. Петербург красив всегда!",
                p: "bg-spb3.jpg"
            },
            "summer": {
                h: "Лето",
                d: "Летом Санкт-Петербург обретает зелёные оттенки, запускаются фонтаны, и город становится необычайно красивым.",
                p: "spb-summer.jpg"
            }, 
            "winter": {
                h: "Зима",
                d: "Зима - лучшая пора для спокойных прогулок по Петербургу. Любуйтесь заснеженными улицами и площадями.",
                p: "spb-winter.jpg"
            }
        }
        const { theme, choosedTheme, season, isLoading } = this.state;
        return <div style={{width: '100%'}}>
            <div className="bg-light text-dark">
                {/*<h1 className="display-1 text-center">Подобрать маршрут</h1>
                <hr />*/}
                <div className="d-flex flex-row pt-2">
                <div style={{flex: 1, backgroundColor: "rgb(161, 194, 209)", borderRight: "1px black solid"}} 
                className="d-flex flex-column">
                    {!choosedTheme
                        ? <div style={{flex: 1}}>
                                <h4 className="display-4">Тематика</h4>
                                <h5>Выберите тематику маршрута, 
                                которая больше всего вам подходит</h5>
                        </div>
                        : <div style={{flex: 1}}>
                            <h6 className="display-6">{info[theme].h}</h6>
                            <h5>{info[theme].d}</h5>
                        </div>
                    }
                    </div>
                    <div style={{flex: 1}} className="d-flex flex-column" id="theme-btns-div">
                        <button className={`choose-theme-btn ${theme==="none" && "theme-btn-checked"}`}
                        onClick={e=>this.setState({theme: "none", choosedTheme: true})}>
                            Выбрать все маршруты</button>
                        <button className={`choose-theme-btn ${theme==="films" && "theme-btn-checked"}`}
                        onClick={e=>this.setState({theme: "films", choosedTheme: true})}>
                            Фильмы</button>
                        <button className={`choose-theme-btn ${theme==="modern-world" && "theme-btn-checked"}`}
                        onClick={e=>this.setState({theme: "modern-world", choosedTheme: true})}>
                            Современный мир</button>
                        <button className={`choose-theme-btn ${theme==="history" && "theme-btn-checked"}`}
                        onClick={e=>this.setState({theme: "history", choosedTheme: true})}>
                        История</button>
                        <button className={`choose-theme-btn ${theme==="islands" && "theme-btn-checked"}`}
                        onClick={e=>this.setState({theme: "islands", choosedTheme: true})}>
                            Острова</button>
                        <button className={`choose-theme-btn ${theme==="literature" && "theme-btn-checked"}`}
                        onClick={e=>this.setState({theme: "literature", choosedTheme: true})}>
                            Литературный дворик</button>
                        <button className={`choose-theme-btn ${theme==="activities" && "theme-btn-checked"}`}
                        onClick={e=>this.setState({theme: "activities", choosedTheme: true})}>
                        Физические активности</button>
                    </div>
                    <div style={{flex: 2}}>
                        <div style={{height: '100%', 
                        backgroundImage:`url(wwwroot/${info[theme].p})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '100% 100%'}}>
                        </div>
                    </div>
                </div>
                <hr style={{margin: '4px 0'}} />
                <div style={{backgroundColor: 'rgb(161, 194, 209)'}}>
                    <div className="text-center">
                        <button className={`btn btn${season !== "none" ? "-outline" : ""}-secondary m-2`}
                        onClick={e=>this.setState({season: "none"})}>Все маршруты</button>
                        <button className={`btn btn${season !== "summer" ? "-outline" : ""}-success m-2`}
                        onClick={e=>this.setState({season: "summer"})}>Лето</button>
                        <button className={`btn btn${season !== "winter" ? "-outline" : ""}-primary m-2`}
                        onClick={e=>this.setState({season: "winter"})}>Зима</button>
                    </div>
                    <h5>{seasonInfo[season].d}</h5>
                    <img src={`wwwroot/${seasonInfo[season].p}`} alt="" style={{width: '60%'}} />
                    <div className="d-flex flex-row" style={{height: '100%'}}>
                    </div>
                </div>
                <hr style={{margin: '4px 0'}} />
                <button className="text-center" id="find-btn" onClick={e=>this.handleSubmit(e)}
                style={{width: '100%', height: '200px'}}>
                    {isLoading?"Загрузка..." : "Найти маршруты"}
                </button>
            </div>
        </div>
    }

    handleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        this.setState({isLoading: true})
        const { theme, season } = this.state;
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
        await fetch(`${process.env.REACT_APP_API_URL}/get_routes_by_filters?filters=${filters}`).then(async res=>{
            const ids = JSON.parse(await res.text()).ids;
            console.log(ids);
            const routeInformations: RouteInformation[] = []
            for(const id of ids.map((i:any)=>i.id)) {
                await getRouteById(id).then(response => {
                    response.dots = JSON.parse(response.dots);
                    while(!(response.dots instanceof Array)) {
                        response.dots = JSON.parse(response.dots);
                    }
                    while(!(response.lines instanceof Array)){
                        response.lines = JSON.parse(response.lines);
                    }
                    routeInformations.push(response);
                }).catch(err=>{
                    console.log(err)
                });
            }
            console.log(routeInformations);
            localStorage.setItem('info', JSON.stringify(routeInformations));
            window.location.href = "/browseroutes";
        }).catch(err=>{
            alert('Произошла ошибка. Попробуйте позже.');
        })
    }
}