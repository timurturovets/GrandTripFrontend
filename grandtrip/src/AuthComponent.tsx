import React, { ReactNode, Component } from 'react'
import { AuthContextConsumer } from './AuthContext'

interface AuthComponentProps {
    role?: string | string[]
    children: ReactNode | ReactNode[]
}
export default class AuthComponent extends Component<AuthComponentProps, any> {
    render() {
        return <AuthContextConsumer>
            {({isAuthenticated, info}) =>
                isAuthenticated 
                && (
                    !this.props.role 
                    || this.props.role === info?.role
                    || this.props.role.indexOf(info?.role || "")!==-1
                    )
                    ? this.props.children
                    : function(r){
                        if(r) {
                            alert('У вас нет доступа к этой странице.');
                            window.location.href="/";
                            return null;
                        } else {
                            window.location.href="/account";
                            return null;
                        }
                    }(this.props.role)
            }
        </AuthContextConsumer>
    }
}