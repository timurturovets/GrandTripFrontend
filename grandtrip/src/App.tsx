import { BrowserRouter, Routes, Route } from 'react-router-dom'
import React, { Component } from 'react'
import Layout from './Layout'
import HomePage from './Pages/HomePage'
import RoutesPage from './Pages/RoutesPage'
import AdminPage from './Pages/AdminPage'
import NewRoutesPage from './Pages/NewRoutesPage'
import SupportPage from './Pages/SupportPage'
import ConstructorPage from './Pages/ConstructorPage'
import AccountPage from './Pages/AccountPage'
import SignInPage from './Pages/SignInPage'

export default class App extends Component {
    render() {
        return <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/a" element={<AdminPage />} />
                    <Route path="/newroutes" element={<RoutesPage />} />
                    <Route path="/routes" element={<NewRoutesPage />} />
                    <Route path="/support" element={<SupportPage />} />
                    <Route path="/constructor" element={<ConstructorPage />} />
                    <Route path="/account" element={<AccountPage />} />
                    <Route path="/sign-in" element={<SignInPage />} />
                    <Route path="/share" element={<RoutesPage />} />
                </Routes>
            </Layout>
        </BrowserRouter>
        }
}