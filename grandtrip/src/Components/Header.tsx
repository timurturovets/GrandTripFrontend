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
      let { isAuthenticated, info } = this.props;

      return <header className="header">
        <div className="container">
          <NavLink className="logo header__logo" to="/">GRANDTRIP</NavLink>
          <div className="header__list">
              <NavLink to="/routes">Маршруты</NavLink>
              <NavLink to="/">Поддержка</NavLink>
              {isAuthenticated && 
                <NavLink to="/account">Личный кабинет({info!.username})</NavLink>}
              {!isAuthenticated && 
                <NavLink className="button header__button button--small" to="/sign-in">войти</NavLink>}
          </div>
        </div>
      </header>
    }
}