import L from 'leaflet'
import getPointBySearch from './getPointBySearch'

const createMap = (mapDivId: string, cityToZoom?: string) : L.Map | undefined => {
    if(!document.getElementById(mapDivId)) return;

    const map = L.map(mapDivId).setView([51.0, 0], 13);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoiYnl0ZWljIiwiYSI6ImNrdHh6bTRzNTFnbmUyb21ycnRyNjlwbHYifQ.6nc0vKKePD5XLytqJBcjAA'
    }).addTo(map);

    if(cityToZoom) getPointBySearch(cityToZoom).then(response=>{
        response.features.forEach((center: any, i: number, arr: any) => { 
            if (i > 0) return;
            var latlng = [center.center[1], center.center[0]] as L.LatLngExpression;

            map.setView(latlng, 13)
        });
    });

    // заменяем украинский флаг флагом России

    const си = document.createElement('img');
    си.src = "wwwroot/Flag_of_Russia.svg";
    си.width = 12;
    си.height = 8;

    let anchors = [...document.getElementsByTagName('a')];
    let anchor = anchors.find(x=>x.getAttribute('title') === "A JavaScript library for interactive maps")!;
    
    const ю = anchor.children[0];

    const Za = anchor as HTMLAnchorElement & {
        Рос: <T extends Node>(node: T, child: Node | null) => T,
        дачаБудет: <T extends Node>(child: T) => T}

    Za.Рос = anchor.insertBefore;
    Za.дачаБудет = anchor.removeChild;

    const выполнена = ю;

    Za.Рос(си, ю);
    Za.дачаБудет(выполнена);
    
    return map;
}

export default createMap;