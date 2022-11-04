import React, { Component, ReactNode } from 'react'
import UserInformation from './Interfaces/UserInformation'
import { statusSetter, userInfoSetter } from './Interfaces/authStatusSetter'
import { getUserInfo } from './Functions/getUserInfo';

const { Provider, Consumer }  = React.createContext<{
    isLoading: boolean,
    isAuthenticated: boolean,
    setStatus: typeof statusSetter,
    setInfo: typeof userInfoSetter,
    info?: UserInformation
}>({
    isLoading: true,
    isAuthenticated: false,
    setStatus: (isAuthenticated: boolean, token: string) => {},
    setInfo: (info: UserInformation) => {}
});

interface AuthContextProviderProps {
    children?: ReactNode | ReactNode[]
}

interface AuthContextProviderState {
    isLoading: boolean,
    isAuthenticated: boolean,
    info?: UserInformation,
    setStatus: typeof statusSetter,
    setInfo: typeof userInfoSetter
}

class AuthContextProvider extends Component<AuthContextProviderProps, AuthContextProviderState> {
    constructor(props: AuthContextProviderProps) {
        super(props);
        
        this.state = {
            isLoading: true,
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

    async componentDidMount() {
        const info = await getUserInfo();
        if(info?.id) this.setState({isLoading: false, isAuthenticated: true, info});
        console.log(info);
    }

    render() {
        const { isLoading, isAuthenticated, info, setStatus, setInfo } = this.state;
        return <Provider value={{isLoading, isAuthenticated, info, setStatus, setInfo}}>
                {this.props.children}
            </Provider>
    }
}

export { Consumer as AuthContextConsumer, AuthContextProvider }