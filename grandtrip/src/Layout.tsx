import React, { ReactNode, Component } from 'react'
import { NavLink } from 'react-router-dom'
import { AuthContextConsumer } from './AuthContext'
import Header from './Components/Header'

interface LayoutProps {
    children: ReactNode | ReactNode[]
}
export default class Layout extends Component<LayoutProps, any> {
    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor(props: LayoutProps){
        super(props);
    }

    componentDidMount() {
        this.configureContentMargin();
    }

    render() {
        const { children } = this.props;
        return <AuthContextConsumer>{({isAuthenticated, info})=>
            <div style={{height: '100%'}}>
                    {''===""?<Header isAuthenticated={isAuthenticated} info={info} />
                    :<header>
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
                                {<li className="nav-item">
                                    <NavLink className="nav-link" to="/support">Поддержка</NavLink>
                                </li>}
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
    </header>}
            <div id="layout-content">
                {children}    
            </div>
            </div>
    }
        </AuthContextConsumer>
    }

    configureContentMargin = () => {
        const callback = () => {
            const div = document.getElementById('layout-content');
            if (!div) {
                console.log('no content? :(');
                window.requestAnimationFrame(callback);
                return;
            }

            const header = document.getElementsByTagName('header')[0];
            if (!header) {
                console.log('no header? :(');
                window.requestAnimationFrame(callback);
                return;
            }

            div.style.paddingTop = `${header.offsetHeight}px`;
        }

        window.requestAnimationFrame(callback);
    }
}