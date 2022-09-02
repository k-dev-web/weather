import React from 'react';
import {UseRoutes} from "./routes";
import './App.css';
import {NavBar} from "./components/nav-bar";



function App() {
    const routes = UseRoutes();
    //localStorage.clear();
    return (
        <>
            <NavBar/>

            <div className="container" >
                {routes}
            </div>
        </>

    );
}

export default App;
