import React, { Component } from 'react'
import { AuthContextConsumer } from '../AuthContext'
import Account from '../Components/Account'
import SignIn from '../Components/SignIn'
export default class AccountPage extends Component {
    render() {
        return <AuthContextConsumer>
            {({isAuthenticated}) => 
                isAuthenticated 
                    ? <Account />
                    : <SignIn />
            }
        </AuthContextConsumer>
    }
}