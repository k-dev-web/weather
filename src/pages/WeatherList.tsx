import React, {useEffect, useReducer, useRef, useState} from 'react';
import {WeatherProvider} from "../providers/WeatherProvider";
import {WeatherCard} from "../components/WeatherCard";
import store from "../store";
import './WeatherList.css'

const dataFetchReducer = (state: any, action: any) => {
    switch (action.type) {
        case 'PROD LOAD':
            return action.data

        default:
            throw state;
    }
};

export const WeatherList = () => {
    const {getWeather, getLocations} = WeatherProvider();
    const [latLng, setLatLng] = useState<any>(null);
    const [state, dispatch] = useReducer(dataFetchReducer, []);
    const [currPage, setCurrPage] = useState(1);
    const [totalPages, setTotalPages] = useState([1]);


    const listInnerRef: any = useRef();
    const useEffectRun: any = useRef(false);

    store.subscribe(() => {
        if (store.getState().weatherList.load) {
            store.getState().weatherList.dispatch({type: "PROD LOAD", data: store.getState().weatherList.list});
            const city = localStorage.getItem('city');
            let tP = [];
            for (let i = 1; i <= Math.ceil(JSON.parse(city ? city : '').length / (latLng ? 4 : 5)); i++) {
                if ((store.getState().weatherList.currPage - 2 < i && i < store.getState().weatherList.currPage + 2) || i === Math.ceil(JSON.parse(city ? city : '').length / (latLng ? 4 : 5)) || i === 1)
                    tP.push(i)
            }
            setTotalPages(tP)
        }
        /*
        if (store.getState().toast.seen) {
            let toast = store.getState().toast;
            M.toast({
                html: toast.type + ' : ' + toast.message,
                classes: `${toast.type === 'Success' ? 'green' : 'red'}`
            })
            store.dispatch({type: 'SEEN TOAST'})
        }

         */
    })
    useEffect(() => {
        if (useEffectRun.current) {
            return;
        }
        useEffectRun.current = true;
        store.dispatch({type: "ADD LIST INIT-DATA", data: {dispatch: dispatch, setTotalPages: setTotalPages}});
        getLocations();

        try {
            navigator.geolocation.getCurrentPosition(async function (position) {
                setLatLng({lat: position.coords.latitude, lng: position.coords.longitude});

                getWeather(position.coords.latitude, position.coords.longitude)
                    .then((weather: any) => {
                        store.dispatch({type: "ADD LIST SELF", data: {name: 'you location', weather: weather}});
                    })
                    .catch(err => {
                        console.log(err)
                    });
            })
        } catch (e) {
            console.log(e)
        }
    }, [])
    /*
    const onScroll = async () => {
        if (listInnerRef.current) {
            const {scrollTop, scrollHeight, clientHeight} = listInnerRef.current;
            if (scrollTop + clientHeight === scrollHeight) {
                await getLocations()
            }
        }
    };
    */

    const changePage: any = async (newPage: any) => {
        setCurrPage(newPage);
        await getLocations(newPage);
    }
    const changeData: any = (type: any, index: any) => {
        let city = localStorage.getItem('city') ? localStorage.getItem('city') : '';
        let cityArr: any[];
        if (city)
            cityArr = JSON.parse(city);
        else return;
        console.log(type, index)
        switch (type) {
            case "up":
                for (let i = 0; i < cityArr.length - 1; i++) {
                    if (cityArr[i].index === index) {
                        cityArr[i].index = index - 1;
                        cityArr[i - 1].index = index;
                        break;
                    }
                }
                break;
            case "delete":
                break;
            case "down":
                break;
            default:
                break;
        }
        cityArr.sort((item1: any, item2: any) => {
            if (item1.index < item2.index) {
                return -1;
            }
            if (item1.index > item2.index) {
                return 1;
            }
            return 0;
        })
        localStorage.setItem('city', JSON.stringify(cityArr));
        getLocations();
    }
    return (
        <div
            //   onScroll={onScroll}
            ref={listInnerRef}
            className={'weather-list'}
        >
            {
                state.length ? (
                        state.map((data: any, index: number) => {

                            return <WeatherCard key={index} data={{data: data, changeData: changeData,isLastPage:totalPages[totalPages.length-1]===currPage}}></WeatherCard>
                        })

                    )
                    : <h4 className={'title-empty'}> Nothing to show </h4>
            }
            <div className={'pagination'}>
                <button
                    key={'prev'}
                    onClick={(event) => {
                        changePage(currPage - 1)
                    }}
                    className={` prev ${currPage === 1 ? "disabled" : ""}`}
                >
                    previous
                </button>
                {/* show paginated button group */}
                {totalPages.map((item, index) => {
                    if (item === currPage) {
                        return (
                            <button key={index} className={`paginationItem`}>
                                &#8230;
                            </button>
                        );
                    }
                    return (
                        <button
                            key={index}
                            onClick={(event) => {
                                changePage(item)
                            }}
                            className={`paginationItem ${
                                currPage === item ? "active" : null
                            }`}
                        >
                            <span>{item}</span>
                        </button>
                    );
                })}
                {/* next button */}
                <button
                    key={'next'}
                    onClick={(event) => {
                        changePage(currPage + 1)
                    }}
                    className={`next ${currPage === totalPages[totalPages.length - 1] ? "disabled" : ""}`}
                >
                    next
                </button>

            </div>
        </div>
    )
}

