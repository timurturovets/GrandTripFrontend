import { BrowserRouter, Routes, Route } from 'react-router-dom'
import React, { Component } from 'react'
import Layout from './Layout'
import HomePage from './Pages/HomePage'
import NewHomePage from './Pages/NewHomePage'
import RoutesPage from './Pages/RoutesPage'
import NewRoutesPage from './Pages/NewRoutesPage'
import SupportPage from './Pages/SupportPage'
import ConstructorPage from './Pages/ConstructorPage'
import AccountPage from './Pages/AccountPage'
import BrowseRoutesPage from './Pages/BrowseRoutesPage'

export default class App extends Component {
    render() {
        navigator.geolocation.watchPosition((p)=>{
            alert(`${p.coords.latitude} ${p.coords.longitude}`);
        }, e=>console.log(e), {enableHighAccuracy: true});
        return <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/newhome" element={<NewHomePage />} />
                    <Route path="/routes" element={<RoutesPage />} />
                    <Route path="/newroutes" element={<NewRoutesPage />} />
                    <Route path="/browseroutes" element={<BrowseRoutesPage />} />
                    <Route path="/support" element={<SupportPage />} />
                    <Route path="/constructor" element={<ConstructorPage />} />
                    <Route path="/account" element={<AccountPage />} />
                </Routes>
            </Layout>
        </BrowserRouter>
        }
}