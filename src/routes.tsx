import React from 'react';
import {Route, Routes, BrowserRouter as Router} from "react-router-dom";
import {WeatherList} from "./pages/WeatherList";


export const UseRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/*" caseSensitive={false} element={<WeatherList />} />
                <Route path="/" caseSensitive={false} element={<WeatherList />} />
            </Routes>
        </Router>

    )
}
