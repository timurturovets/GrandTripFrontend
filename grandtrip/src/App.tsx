import { BrowserRouter, Routes, Route } from 'react-router-dom'
import React, { Component } from 'react'
import Layout from './Layout'
import HomePage from './Routes/HomePage'
import RoutesPage from './Routes/RoutesPage'
import SupportPage from './Routes/SupportPage'

export default class App extends Component {
    render() {
        return <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/routes" element={<RoutesPage />} />
                    <Route path="/support" element={<SupportPage />} />
                </Routes>
            </Layout>
        </BrowserRouter>
        }
}