import React, { Component, ReactNode } from 'react'
import UserInformation from './Interfaces/UserInformation'
import { statusSetter, userInfoSetter } from './Interfaces/authStatusSetter'
import { getUserInfo } from './Functions/getUserInfo';

const { Provider, Consumer }  = React.createContext<{
    isAuthenticated: boolean,
    isLoading: boolean,
    setStatus: typeof statusSetter,
    setInfo: typeof userInfoSetter,
    info?: UserInformation
}>({
    isAuthenticated: false,
    isLoading: true,
    setStatus: (isAuthenticated: boolean, token: string) => {},
    setInfo: (info: UserInformation) => {}
});

interface AuthContextProviderProps {
    children?: ReactNode | ReactNode[]
}

interface AuthContextProviderState {
    isAuthenticated: boolean,
    isLoading: boolean,
    info?: UserInformation,
    setStatus: typeof statusSetter,
    setInfo: typeof userInfoSetter
}

class AuthContextProvider extends Component<AuthContextProviderProps, AuthContextProviderState> {
    constructor(props: AuthContextProviderProps) {
        super(props);
        
        this.state = {
            isAuthenticated: false,
            isLoading: true,
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
        await getUserInfo().then(info => {
            if(info?.id) this.setState({isLoading: false, isAuthenticated: true, info});
            else this.setState({isLoading: false, isAuthenticated: false});
            console.log(info);
        }).catch(err=>this.setState({isLoading: false, isAuthenticated: false}));
    }

    render() {
        const {isAuthenticated, isLoading, info, setStatus, setInfo } = this.state;
        return <Provider value={{isAuthenticated, isLoading, info, setStatus, setInfo}}>
                {isLoading ? <h1 style={{margin: "auto"}}>Загрузка..</h1> : this.props.children}
            </Provider>
    }
}

export { Consumer as AuthContextConsumer, AuthContextProvider }