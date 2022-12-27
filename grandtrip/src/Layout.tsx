import React, { ReactNode, Component } from 'react'
import { AuthContextConsumer } from './AuthContext'
import Header from './Components/Header'

interface LayoutProps {
    children: ReactNode | ReactNode[]
}
export default class Layout extends Component<LayoutProps, any> {
    componentDidMount() {
        this.configureContentMargin();
    }

    render() {
        const { children } = this.props;
        return <AuthContextConsumer>{({isAuthenticated, info})=>
            <div style={{height: '100%'}}>
                <Header isAuthenticated={isAuthenticated} info={info} />
                <div id="layout-content">
                    {children}    
                </div>
            </div>
        }</AuthContextConsumer>
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