import {combineReducers, createStore} from 'redux'
import weatherList from './WeatherList/reducer';
import toast from "./Toast/reducer";


const reducer = combineReducers({
    weatherList,
    toast,
});
const store = createStore(reducer);

export default store;
