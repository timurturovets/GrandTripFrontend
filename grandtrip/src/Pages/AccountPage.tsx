import React, { Component } from 'react'
import { AuthContextConsumer } from '../AuthContext'
import Account from '../Components/Account'
import { Navigate } from 'react-router-dom'
export default class AccountPage extends Component {
    render() {
        return <AuthContextConsumer>
            {({isAuthenticated}) => 
                isAuthenticated 
                    ? <Account />
                    : <Navigate to="/sign-in" />
            }
        </AuthContextConsumer>
    }
}