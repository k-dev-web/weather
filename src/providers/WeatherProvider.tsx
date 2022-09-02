import {useCallback} from 'react'
import {useHttp} from "../hooks/http.hook";
import store from "../store";


export const WeatherProvider = () => {
    const {request} = useHttp();
    const getWeather = useCallback(async (lat: number, lng: number) => {
        try {
            const weather = await request(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${process.env.REACT_APP_WEATHER_API_KEY}`, 'GET')
            return weather
        } catch (e) {
            return {error: e}
        }
    }, [request])

    const getLocations = async (page?: number,) => {
        try {
            page = page ? page : store.getState().weatherList.currPage;
            let locations: any[] = [];
            let items: any = localStorage.getItem('city');
            let weather: any[] = [];
            if (items) {
                items = JSON.parse(items);
                let capacity = Object.entries(store.getState().weatherList.self).length ? 4 : 5;
                for (let i = (page ? page : 1) * capacity - capacity; i < (page ? page : 1) * capacity; i++) {
                    if (items[i]) {
                        weather.push(getWeather(items[i]?.latLng?.lat, items[i]?.latLng?.lng));
                        locations.push(items[i]);
                    } else continue;
                }
                /*
                let index = store.getState().weatherList.list.length
                && store.getState().weatherList.list[store.getState().weatherList.list.length - 1].index ?
                    store.getState().weatherList.list[store.getState().weatherList.list.length - 1].index + 1 : 0

                for (let i = index; i < index + 5; i++) {
                    if (items[i]) {
                        items[i].weather = await getWeather(items[i]?.latLng?.lat, items[i]?.latLng?.lng);
                        locations.push(items[i]);
                    } else continue;
                }*/
                Promise.all(weather).then(res=>{
                    for (let i in res){
                       locations[i].weather=res[i] ;
                    }
                    store.dispatch({type: "LOAD LIST", data: {locations: locations, page: page}});

                })
            }


        } catch (e) {
            console.log(e)
        }
    }


    return {getWeather, getLocations}
}

