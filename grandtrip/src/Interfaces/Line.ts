import { LatLngExpression } from 'leaflet'

export default interface Line {
    id: number,
    latlngs: LatLngExpression[]
}