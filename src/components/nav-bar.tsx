import React from 'react'
import './nav-bar.css';
import {ShowModal} from "./Modal";
import logo from '../logo.png'


export const NavBar = (data: any) => {
    return (
        <nav className="nav" role="navigation">
            <div className="nav-wrapper  white">

                <img
                    alt=''
                    className="left" src={logo}
                />
                <h4>WEATHER</h4>
                <ShowModal {...{type: 'button'}}></ShowModal>

            </div>
        </nav>
    )

}



