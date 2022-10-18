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
                    <div id="header">
                    <header>
                        <nav className="navibar">
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
                        </nav>
                    </header>
                </div>
                    <div id="cont" style={{display: 'flex'}}>
                        {children}    
                    </div>
        </div>
    }
}