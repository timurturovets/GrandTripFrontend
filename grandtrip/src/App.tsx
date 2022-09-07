import { BrowserRouter, Routes, Route } from 'react-router-dom'
import React, { Component } from 'react'

export default class App extends Component {
    render() {
        return <BrowserRouter>
            <Routes>
                <Route path="/" element={null} />
            </Routes>
        </BrowserRouter>
    }
}