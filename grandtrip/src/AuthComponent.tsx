import React, { ReactNode, Component } from 'react'
import { Navigate } from 'react-router'
import { AuthContextConsumer } from './AuthContext'

interface AuthComponentProps {
    role?: string
    children: ReactNode | ReactNode[]
}
export default class AuthComponent extends Component<AuthComponentProps, any> {
    render() {
        return <AuthContextConsumer>
            {({isAuthenticated, role}) =>
                isAuthenticated && (!role || role === this.props.role)
                    ? this.props.children
                    : function(){
                        alert('У вас нет доступа к этой странице.');
                        return <Navigate to="/" />
                    }()
            }
        </AuthContextConsumer>
    }
}