import React, {useState} from 'react';
import {UseRoutes} from "./routes";
import './App.css';
import {NavBar} from "./components/nav-bar";
import store from "./store";
import {Toast} from "./components/toast";


function App() {
    const [list, setList] = useState<any[]>([]);
    const routes = UseRoutes();
    store.subscribe(() => {
        if (store.getState().toast.length !== list.length) {
            setList(store.getState().toast)
        }
    })
    const deleteToast = (id: any) => {
        const listItemIndex = list.findIndex(e => e.id === id);
        const toastListItem = list.findIndex((e: any) => e.id === id);
        list.splice(listItemIndex, 1);
        list.splice(toastListItem, 1);
        setList([...list]);
        store.dispatch({type: 'DELETE TOAST', data: [...list]})
    }

    //localStorage.clear();
    return (
        <>
            <NavBar/>
            <Toast toastList={list} deleteToast={deleteToast}></Toast>
            <div className="container">
                {routes}
            </div>
        </>

    );
}

export default App;
