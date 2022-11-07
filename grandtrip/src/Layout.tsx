import React, { ReactNode, Component } from 'react'
import { AuthContextConsumer } from './AuthContext'
import Footer from './Components/Footer';
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
                <Header isAuthenticated={isAuthenticated} info={info} />
                <div id="layout-content">
                    {children}    
                </div>
                {/*<Footer />*/}
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