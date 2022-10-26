import React, { Component } from 'react'
//import AuthComponent from '../AuthComponent'
import L from 'leaflet'
import ConstructorToolbar from '../Components/ConstructorToolbar'
import createMap from '../Functions/createMap'

interface ConstructorPageState{
    map?: L.Map
}

export default class ConstructorPage extends Component<any, ConstructorPageState> {
    constructor(props: any) {
        super(props);

        this.state = {
            map: undefined
        };
    }
    
    render() {
        const map = this.state.map;

        /*return <AuthComponent role={isEditMode ? "Editor" : undefined}>*/
        return <div>           
                <div id="main-container" style={{height: "100%", width: "100%"}}>
                <div id="mapInfoDiv" className="bg-dark">
                    {map && <ConstructorToolbar map={map} />}
                </div>
                <div id="mapDiv" style={{height: "100%", width: "100%"}}>
                    {!map && 
                    <button onClick={this.handleShowMap} className="btn btn-outline-success">
                        Показать карту</button>}
                </div>
            </div>
            </div>
       // </AuthComponent>
    }

    handleShowMap = async () => {

        const height = window.innerHeight - document.getElementsByTagName('header')[0]!.offsetHeight;

        const cont = document.getElementById("cont")!;
        const div = cont.children[0] as HTMLElement;
        div.style.width = `${cont.offsetWidth}px`;
        const container = document.getElementById('main-container')!;
        container.style.height = `${height}px`;
        container.style.width = `${cont.offsetWidth}px`;

        let sideNav = document.getElementById('mapInfoDiv')!;
        sideNav.style.height = container.style.height;

        
        const map = createMap("mapDiv", "Санкт-Петербург");
        this.setState({map});

    }
}