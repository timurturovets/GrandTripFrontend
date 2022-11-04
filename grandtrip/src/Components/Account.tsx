import React, { Component } from 'react'
import { AuthContextConsumer } from '../AuthContext'

export default class Account extends Component {
    render() {
        return <AuthContextConsumer>{({info})=><div>
            <h1 className="text-center">Личный кабинет</h1>
            <h5>Вы вошли как {info?.username}</h5>
            <button className="btn btn-danger" onClick={this.handleLogOff}>Выйти из аккаунта</button>
        </div>}</AuthContextConsumer>
    }

    handleLogOff = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        localStorage.clear();
        window.location.reload();
    }
}