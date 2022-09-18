import { BrowserRouter, Routes, Route } from 'react-router-dom'
import React, { Component } from 'react'
import Layout from './Layout'
import HomePage from './Pages/HomePage'
import RoutesPage from './Pages/RoutesPage'
import SupportPage from './Pages/SupportPage'
import ConstructorPage from './Pages/ConstructorPage'

export default class App extends Component {
    render() {
        return <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/routes" element={<RoutesPage />} />
                    <Route path="/support" element={<SupportPage />} />
                    <Route path="/constructor" element={<ConstructorPage />} />
                </Routes>
            </Layout>
        </BrowserRouter>
        }
}