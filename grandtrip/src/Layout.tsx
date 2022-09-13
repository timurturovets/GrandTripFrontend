import React, { ReactNode, Component } from 'react'

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
                        <a href="/"><h1>GRANDTRIP</h1></a>
                            <div className="navibar-centered">
                                <a href="routes"><h1>МАРШРУТЫ</h1></a>
                            </div>
                            <div className="navibar-right">
                                <a href="support"><h1>ПОДДЕРЖКА</h1></a>
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