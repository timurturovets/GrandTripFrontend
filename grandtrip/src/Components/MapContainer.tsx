import React, { Component } from 'react'
import L from 'leaflet'

interface MapContainerProps {
    mapCallback: (map: L.Map) => void;
}
export default class MapContainer extends Component<MapContainerProps, any> {
    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor(props: MapContainerProps){ 
        super(props);
    }

    render () {
        const func = () => {
            let elem = document.getElementById('map-container-div') as HTMLElement;
            const map = L.map(elem).setView([51.0, 0], 13);
                L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
                    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                    maxZoom: 18,
                    id: 'mapbox/streets-v11',
                    tileSize: 512,
                    zoomOffset: -1,
                    accessToken: 'pk.eyJ1IjoiYnl0ZWljIiwiYSI6ImNrdHh6bTRzNTFnbmUyb21ycnRyNjlwbHYifQ.6nc0vKKePD5XLytqJBcjAA'
                }).addTo(map);
                this.props.mapCallback(map);
                return null
        }
        return <div id="map-container-div" style={{height: '100%', width: '100%'}}>
            {func()}
        </div>
    }
}