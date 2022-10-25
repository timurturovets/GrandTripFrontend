import React, { Component } from 'react'
import RouteInformation from '../Interfaces/RouteInformation';
import RouteCard from '../Components/RouteCard'
import DisplayRoute from '../Components/DisplayRoute'

type Nullable<T> = T | null;

interface BrowseRoutesPageState {
    routes: RouteInformation[],
    clickedRender: boolean,
    routeToRender: Nullable<RouteInformation>
}

export default class BrowseRoutesPage extends Component<any, BrowseRoutesPageState> {
    constructor(props: any) {
        super(props);
        let result;
        try{
            result = JSON.parse(localStorage.getItem('info') ?? "") as RouteInformation[];
            localStorage.removeItem('info');
        } catch {
            window.location.href = "/newroutes";
            return;
        }

        this.state = {
            routes: result,
            clickedRender: false,
            routeToRender: null
        };
    }

    render() {
        const { routes, clickedRender, routeToRender } = this.state;

        if(clickedRender) return <DisplayRoute info={routeToRender!} />

        else {
        const subArray = [];
        for(let i = 0; i < routes.length; i += 3) {
            subArray.push(routes.slice(i, i + 3));
        }
            return <div>
                <hr />
                <div className="d-flex flex-column">
                {subArray.map(arr=>
                    <div className="d-flex flex-row">
                    {arr.map(route => <RouteCard key={route.id} info={route} onRender={this.onRouteRender} />)}
                    </div>
                )}
                </div>
            </div>
        }
    }

    onRouteRender = (routeId: number) => {
        const { routes } = this.state;
        const route = routes.find(i => i.id === routeId);

        if(!route) {
            window.location.href = "/newroutes";
            return;
        }
        
        this.setState({clickedRender: true, routeToRender: route});
    }
}