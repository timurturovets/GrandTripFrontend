import React, { Component, ReactNode } from 'react'

type Role = "Default" | "Editor" | "Admin"

const { Provider, Consumer }  = React.createContext({
    isAuthenticated: false,
    role: "Default"
});

interface AuthContextProviderProps {
    children?: ReactNode | ReactNode[]
}

interface AuthContextProviderState {
    isAuthenticated: boolean,
    role: Role
}

class AuthContextProvider extends Component<AuthContextProviderProps, AuthContextProviderState> {
    constructor(props: AuthContextProviderProps) {
        super(props);

        this.state = {
            isAuthenticated: false,
            role: "Default"
        };
    }

    render() {
        const { isAuthenticated, role } = this.state;
        return <Provider value={{isAuthenticated, role}}>
                {this.props.children}
            </Provider>
    }
}

export { Consumer as AuthContextConsumer, AuthContextProvider }