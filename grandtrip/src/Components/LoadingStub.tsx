import React, { Component } from 'react'

export default class LoadingStub extends Component {
    render() {
        const height = window.innerHeight;
        const width = window.innerWidth;

        return <div style={{height, width}}>
            <div style={{marginTop: '5%', marginLeft: '5%'}}>
                <h1 className="logo header__logo" >GRANDTRIP</h1>
                <h2>Загрузка...</h2>
            </div>
        </div>
    }
}