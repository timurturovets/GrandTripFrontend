import React, { Component } from 'react'
import AuthComponent from '../AuthComponent'
import L from 'leaflet'
import ConstructorToolbar from '../Components/ConstructorToolbar'
import createMap from '../Functions/createMap'

interface ConstructorPageState {
    map?: L.Map
}

export default class ConstructorPage extends Component<any, ConstructorPageState> {
    constructor(props: any) {
        super(props);

        this.state = {
            map: undefined
        };
    }
    
    componentDidMount() {
        this.showMap();
    }

    render() {
        const map = this.state.map;
        console.log(map);
        return <AuthComponent>
         <div style={{height: "100%"}}>           
                <div id="main-container" style={{height: "100%", width: "100%"}}>
                <div id="mapInfoDiv" className="bg-dark">
                    {map && <ConstructorToolbar map={map} />}
                </div>
                <div id="mapDiv" style={{height: "100%", width: "100%"}}></div>
            </div>
            </div>
       </AuthComponent>
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

    showMap = () => {
        const callback = () : void => {
            console.log('anim frame');
            const mapDiv = document.getElementById("mapDiv");
            if(!mapDiv) {
                console.log("no div? :(");
                window.requestAnimationFrame(callback);
                return;
            };

            const height = window.innerHeight - document.getElementsByTagName('header')[0]!.offsetHeight;
            const container = document.getElementById('main-container')!;
            if(!container) {
                console.log("no container? :(");
                window.requestAnimationFrame(callback);
                return;
            }
            container.style.height = `${height}px`;

            const map = createMap("mapDiv", "Эрмитаж Санкт-Петербург")!
            this.setState({ map });
        };
        window.requestAnimationFrame(callback);
    }
}