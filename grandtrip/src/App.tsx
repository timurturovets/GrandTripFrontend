import { BrowserRouter, Routes, Route } from 'react-router-dom'
import React, { Component } from 'react'
import Layout from './Layout'
import HomePage from './Pages/HomePage'
import OldHomePage from './Pages/OldHomePage'
import RoutesPage from './Pages/RoutesPage'
import AdminPage from './Pages/AdminPage'
import BetaRoutesPage from './Pages/BetaRoutesPage'
import NewRoutesPage from './Pages/NewRoutesPage'
import SupportPage from './Pages/SupportPage'
import ConstructorPage from './Pages/ConstructorPage'
import AccountPage from './Pages/AccountPage'
import SignInPage from './Pages/SignInPage'
import BrowseRoutesPage from './Pages/BrowseRoutesPage'
import LogPage from './Pages/LogPage'

export default class App extends Component {
    render() {
        return <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/a" element={<AdminPage />} />
                    <Route path="/oldhome" element={<OldHomePage />} />
                    <Route path="/newroutes" element={<RoutesPage />} />
                    <Route path="/betaroutes" element={<BetaRoutesPage />} />
                    <Route path="/routes" element={<NewRoutesPage />} />
                    <Route path="/browseroutes" element={<BrowseRoutesPage />} />
                    <Route path="/support" element={<SupportPage />} />
                    <Route path="/constructor" element={<ConstructorPage />} />
                    <Route path="/account" element={<AccountPage />} />
                    <Route path="/sign-in" element={<SignInPage />} />
                    <Route path="/share" element={<RoutesPage />} />
                    <Route path="/log" element={<LogPage />} />
                </Routes>
            </Layout>
        </BrowserRouter>
        }
}