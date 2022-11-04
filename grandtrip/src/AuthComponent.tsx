import React, { ReactNode, Component } from 'react'
import { AuthContextConsumer } from './AuthContext'

interface AuthComponentProps {
    role?: string | string[]
    children: ReactNode | ReactNode[]
}

export default class AuthComponent extends Component<AuthComponentProps, any> {
    render() {
        return <AuthContextConsumer>
            {({isLoading, isAuthenticated, info}) =>{
                return isLoading ? null : isAuthenticated 
                ? (
                    !this.props.role // Наличие определённой роли необязательно в этом компоненте
                    || this.props.role === info?.role // Роль соответствует единственной указанной роли
                    || this.props.role.indexOf(info?.role || "")!==-1 // Роль присутствует в массиве возможных ролей
                    )
                    ? this.props.children
                    : function(r){
                        if(r) {
                            alert('У вас нет доступа к этой странице.');
                            window.location.href="/";
                        } else window.location.href="/account";
                        return null;
                    }(this.props.role)
                : function(){window.location.href="/account";return null}()
            }}
        </AuthContextConsumer>
    }
}