import React, { Component } from 'react'
import RouteInformation from '../Interfaces/RouteInformation';

interface BrowseRoutesPageState {
    routes: RouteInformation[]
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
            routes: result
        };
    }

    render() {
        const { routes } = this.state;
        return <div>
            <hr />
            <div className="d-flex flex-row">
            {routes.map(r=><div key={r.id}>
                
            </div>)}
            </div>
        </div>
    }
}