import React, { Component } from 'react'
import RouteInformation from '../Interfaces/RouteInformation'

interface DisplayRouteProps {
    info: RouteInformation
}

interface DisplayRouteState {
    clickedShowMap: boolean
}

export default class DisplayRoute extends Component<DisplayRouteProps, DisplayRouteState> {
    constructor(props: DisplayRouteProps) {
        super(props);

        this.state = {
            clickedShowMap: false
        }
    }
    render() {
        const { clickedShowMap } = this.state;
        const { info } = this.props;
        return <div>
            <h1 className="display-1">{info.name}</h1>
            <p className="display-3">{info.description}</p>
            <hr style={{width: '100%'}} />
            {clickedShowMap 
                ? <button className="btn btn-outline-success" onClick={this.showMap}>Показать карту</button>
                : <div id="map-div"></div>
            }
        </div>
    }
    
    showMap = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
    }
}