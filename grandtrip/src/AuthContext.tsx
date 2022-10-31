import React, { Component, ReactNode } from 'react'
import UserInformation from './Interfaces/UserInformation'
import { statusSetter, userInfoSetter } from './Interfaces/authStatusSetter'
import { getUserInfo } from './Functions/getUserInfo';

const { Provider, Consumer }  = React.createContext<{
    isAuthenticated: boolean,
    setStatus: typeof statusSetter,
    setInfo: typeof userInfoSetter,
    info?: UserInformation
}>({
    isAuthenticated: false,
    setStatus: (isAuthenticated: boolean, token: string) => {},
    setInfo: (info: UserInformation) => {}
});

interface AuthContextProviderProps {
    children?: ReactNode | ReactNode[]
}

interface AuthContextProviderState {
    isAuthenticated: boolean,
    info?: UserInformation,
    setStatus: typeof statusSetter,
    setInfo: typeof userInfoSetter
}

class AuthContextProvider extends Component<AuthContextProviderProps, AuthContextProviderState> {
    constructor(props: AuthContextProviderProps) {
        super(props);

        const info = getUserInfo();
        this.state = {
            isAuthenticated: false,
            setStatus: (isAuthenticated, token) => {
                this.setState({isAuthenticated});

                if(isAuthenticated && token) localStorage.setItem('token', token);
                else localStorage.removeItem('token');
            },
            setInfo: (info) => {
                this.setState({info})
            }
        };
    }

    render() {
        const { isAuthenticated, info, setStatus, setInfo } = this.state;
        return <Provider value={{isAuthenticated, info, setStatus, setInfo}}>
                {this.props.children}
            </Provider>
    }
}

export { Consumer as AuthContextConsumer, AuthContextProvider }