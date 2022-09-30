import React, { Component } from 'react'
import AuthComponent from '../AuthComponent'
import L from 'leaflet'
import ConstructorToolbar from '../Components/ConstructorToolbar'
import getPointBySearch from '../Functions/getPointBySearch'

interface ConstructorPageState{
    map?: L.Map
}

export default class ConstructorPage extends Component<any, ConstructorPageState> {
    constructor(props: any) {
        super(props);

        this.state = {
            map: undefined
        };
    }
    
    render() {
        const map = this.state.map;
        return <AuthComponent role="Editor">            
                <div id="main-container" style={{height: "100%", width: "100%"}}>
                <div id="mapInfoDiv">
                    {map && <ConstructorToolbar map={map} />}
                </div>
                <div id="mapDiv" style={{height: "100%", width: "100%"}}>
                    {!map && 
                    <button onClick={this.handleShowMap} className="btn btn-outline-success">Показать карту</button>}
                </div>
            </div>
        </AuthComponent>
    }

    handleShowMap = async () => {
        const height = window.innerHeight - document.getElementById('header')!.offsetHeight;

        const container = document.getElementById('main-container')!;   
        container.style.height = `${height}px`;
        container.style.width = `100%`;

        let sideNav = document.getElementById('mapInfoDiv')!;
        sideNav.style.height = container.style.height;
        const map = L.map("mapDiv").setView([51.0, 0], 13);
        this.setState({map});
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