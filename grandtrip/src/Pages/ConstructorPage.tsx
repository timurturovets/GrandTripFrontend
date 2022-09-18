import React, { Component } from 'react'
import L from 'leaflet'
import ConstructorToolbar from '../Components/ConstructorToolbar'
import getPointBySearch from '../Functions/getPointBySearch'

interface ConstructorPageState{
    map?: L.Map
}

export default class ConstructorPage extends Component<any, ConstructorPageState> {

    render() {
        const { map } = this.state;
        return <div id="main-container" style={{height: "100%", width: "100%;"}}>
        <div id="mapInfoDiv">
            {map && <ConstructorToolbar map={map} />}
        </div>
        <div id="mapDiv">
            <button onClick={this.handleShowMap} className="btn btn-outline-success">Показать карту</button>
        </div>
    </div>
    }

    handleShowMap = async () => {
        const map = L.map("mapDiv").setView([51.0, 0], 13);
        this.setState({
            map
        });

        getPointBySearch("Санкт-Петербург").then(response=>{
            response.features.forEach((center: any, i: number, arr: any) => {
                var latlng = [center.center[1], center.center[0]] as L.LatLngExpression;
                if (i > 0) return;

                map.setView(latlng, 13)
            });
        });
    }

}