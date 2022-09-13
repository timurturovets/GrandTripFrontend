import React, { Component } from 'react'
import RouteInformation from '../Interfaces/RouteInformation'

interface RouteInfoProps {
    info: RouteInformation,
    onRouteRendering: (id: string) => void;
}
export default class RouteInfo extends Component<RouteInfoProps, any> {
    render() {
        const { info } = this.props;
        return <div>
            <h1>Маршрут {info.name}</h1>
            <h3>Описание {info.desc}</h3>
            <button onClick={e => this.props.onRouteRendering(info.id)}>Отрисовать маршрут</button>
        </div>
    }
}