import React, { Component } from 'react'
import UserInformation from '../Interfaces/UserInformation'
import { NavLink } from 'react-router-dom'
import '../styles/style.css'
interface HeaderProps {
    isAuthenticated: boolean,
    info?: UserInformation
}
export default class Header extends Component<HeaderProps, any> {
    render() {
        return <header className="header">
          <div className="container">
            <NavLink className="logo header__logo" to="/">GRANDTRIP</NavLink>
            <div className="header__list">
                <NavLink to="/routes">Маршруты</NavLink>
                <NavLink to="/support">Поддержка</NavLink>
                <NavLink to="/account">Личный кабинет</NavLink>
                <NavLink className="button header__button button--small" to="/sign-in">войти</NavLink>
            </div>
          </div>
        </header>
    }
}