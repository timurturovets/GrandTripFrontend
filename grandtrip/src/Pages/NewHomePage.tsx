import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class NewHomePage extends Component {
    render() {
        return <div>
            <div className="m-auto">
                <h1>Добро пожаловать</h1>
                <h1 className="ml-3">в GRANDTRIP</h1>
            </div>
            <hr />
        </div>
    }
}