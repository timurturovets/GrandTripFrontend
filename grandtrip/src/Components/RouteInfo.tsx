import React, { Component } from 'react'
import RouteInformation from '../Interfaces/RouteInformation'
import { Link } from 'react-router-dom'

interface RouteInfoProps {
    info: RouteInformation,
    onRouteRendering: (id: number) => void;
}

interface RouteInfoState {
    isShown: boolean
}

export default class RouteInfo extends Component<RouteInfoProps, RouteInfoState> {
    constructor(props: RouteInfoProps) {
        super(props);

        this.state = {
            isShown: false
        };
    }
    render() {
        const { info } = this.props;
        const { isShown } = this.state;
        return <div>
            <button className="route-btn" onClick={e=>this.setState({isShown: !isShown})}>
                {info.name || "Без названия"}
                </button>
                {isShown 
                && <div className="route-div">
                        <p className="m-0">{info.description}</p>
                        <div className="d-flex flex-row">
                        <button className="btn btn-sm btn-success"
                            onClick={e => this.props.onRouteRendering(info.id)}>Отрисовать маршрут</button>
                        <Link to={`/constructor?edit=${info.id}`} className="btn btn-sm btn-primary">
                            Редактировать маршрут</Link>
                        </div>
                    </div>}
        </div>
    }
}