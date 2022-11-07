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
    render() {
        return <div></div>
    }
}