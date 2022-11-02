import React, { ReactNode, Component } from 'react'
import { NavLink } from 'react-router-dom'
import { AuthContextConsumer } from './AuthContext'

interface LayoutProps {
    children: ReactNode | ReactNode[]
}
export default class Layout extends Component<LayoutProps, any> {
    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor(props: LayoutProps){
        super(props);
    }

    render() {
        const { children } = this.props;
        return <AuthContextConsumer>{({isAuthenticated, info})=>
            <div style={{height: '100%'}}>
                <div>
                    <header>
                        <nav className="navbar navbar-expand-lg navbar-light"
                        style={{backgroundColor: 'rgb(161, 194, 209)', paddingLeft: '1%'}}>
                            <NavLink className="navbar-brand text-light" to="/">GrandTrip</NavLink>
                            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                                <span className="navbar-toggler-icon"></span>
                            </button>

                            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                                <ul className="navbar-nav mr-auto">
                                <li className="nav-item active">
                                    <NavLink className="nav-link custom-navlink" to="/routes">Маршруты</NavLink>
                                </li>
                                {/*<li className="nav-item">
                                    <NavLink className="nav-link" to="/support">Поддержка</NavLink>
                                </li>*/}
                                <li className="nav-item">
                                    <NavLink className="nav-link custom-navlink" to="/log">Логи</NavLink>
                                </li>
                                {isAuthenticated && info?.username && <li className="nav-item">
                                    <p className="m-0 nav-link custom-navlink">Привет, {info.username}</p>
                                </li>}
                                <li className="nav-item">
                                    <NavLink className="nav-link custom-navlink" to="/account">Личный кабинет</NavLink>
                                </li>
                                {isAuthenticated && <li className="nav-item">
                                    <NavLink className="nav-link custom-navlink" to="/constructor">Конструктор</NavLink>    
                                </li>}
                                </ul>
                            </div>
                        </nav>
                    </header>
                </div>
                <div id="cont" style={{height: '100%'}}>
                        {children}    
                </div>
            </div>}
        </AuthContextConsumer>
    }
}