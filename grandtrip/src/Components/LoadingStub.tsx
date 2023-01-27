import React, { Component } from 'react'

export default class LoadingStub extends Component {
    render() {
        const height = window.innerHeight;
        const width = window.innerWidth;
    
        const marginTop = '5%';
        const marginLeft = '5%';
        return <div style={{height, width}}>
            <div style={{marginTop, marginLeft}}>
                <h1 className="logo header__logo" >GRANDTRIP</h1>
                <h2>Загрузка...</h2>
            </div>
        </div>
    }
}