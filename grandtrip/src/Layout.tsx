import React, { ReactNode, Component } from 'react'
import { NavLink } from 'react-router-dom'

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
        return <div>
                    <div> {/* id="header">*/}
                    <header>
                        {/*<nav className="navibar">
                        <NavLink to="/" style={({isActive}) => 
                        window.location.pathname ==="/" ? {color:'white'} : {color: 'black'}}>
                            <h1>GRANDTRIP</h1>
                        </NavLink>
                            <div className="navibar-centered">
                                <NavLink to="routes"><h1>МАРШРУТЫ</h1></NavLink>
                            </div>
                            <div className="navibar-right">
                                <NavLink to="support"><h1>ПОДДЕРЖКА</h1></NavLink>
                            </div>
                        </nav>*/}
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
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/support">Поддержка</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link custom-navlink" to="/account">Личный кабинет</NavLink>
                                </li>
                                </ul>
                            </div>
                        </nav>
                    </header>
                </div>
                    <div id="cont" /*style={{display: 'flex'}}*/>
                        {children}    
                    </div>
        </div>
    }
}