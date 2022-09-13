import L, { LatLngExpression } from 'leaflet'
import getPointBySearch from './getPointBySearch';

export default function initializeMap(divId: string) : null {
    const map = L.map(divId);
    
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoiYnl0ZWljIiwiYSI6ImNrdHh6bTRzNTFnbmUyb21ycnRyNjlwbHYifQ.6nc0vKKePD5XLytqJBcjAA'
    }).addTo(map);
    
    getPointBySearch("Санкт-Петербург").then(result => {
        result.features.forEach((center: any, i: number, arr: any[]) => {
            var latlng: LatLngExpression = [center.center[1], center.center[0]];
            if (i > 0) return;
    
            map.setView(latlng);
        });
    });

    const render_route = async (routeJson: string) => {
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
            newMarker.on('click', /*async*/ e => {
                let elems = document.getElementsByClassName('leaflet-popup-content')
                let elem = elems[1];
                if (!elem) elem = elems[0];
                let iframe = document.createElement("iframe");
                iframe.setAttribute("src", `/desc_page${dot.link}`);
                elem.appendChild(iframe);
                /*let html;
                await fetch(dot.link).then(res => res.text()).then(data => html = data);
                let div = document.createElement("div");
                div.setAttribute('id', `dot${dot.id}`);
                div.innerHTML = html;
                elem.appendChild(div);*/


            });
            //document.getElementById(`dot${dot.id}`).innerHTML = "<iframe src=/desc_page\"" + dot.link + "\"/>";
        }
        for (const line of route.lines) {
            L.polyline(line.latlngs, { color: 'rgba(255, 157, 18, 1)', weight: 5 })
                .addTo(map);
        }
    }
    return null;
}