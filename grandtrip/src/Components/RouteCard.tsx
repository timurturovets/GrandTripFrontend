import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import RouteInformation from '../Interfaces/RouteInformation'

interface RouteCardProps {
    info: RouteInformation,
    onRender: (id: number) => void
}

export default class RouteCard extends Component<RouteCardProps> {
    render() {
        const { info, onRender } = this.props;
        return <div style={{border: '2px solid black', borderRadius: '5px'}}>
            <h3>{info.name}</h3>
            <hr />
            <h6>{info.description}</h6>
            <div className="d-flex flex-row">
                <button className="btn btn-success" onClick={e=>onRender(info.id)}>
                    Перейти к маршруту
                </button>
                <Link to={`/constructor?edit=${info.id}`} className="btn btn-primary">
                    Редактировать маршрут
                </Link>
            </div>
        </div>
    }
}