import './WeatherCard.css'
import store from "../store";
import React from "react";
import moment from "moment";

export const WeatherCard = (props: any) => {
    const {data} = props;

    return (
        <div className=" card  ">


            <div className="card-content ">
                <h5>{data.data.name}</h5>
                <div className="weather">
                    <div>
                        {
                            data.data.weather.weather[0].icon ?
                                <img
                                    alt=''
                                    className="left"
                                    src={` http://openweathermap.org/img/wn/${data.data.weather.weather[0].icon}@2x.png`}
                                /> : <></>
                        }</div>
                    <div className="weather-item">
                        <label> weather </label>
                        <label> main {data.data.weather.weather[0].main}</label>
                        <label> description {data.data.weather.weather[0].description}</label>
                    </div>
                    <div className="weather-item">
                        <label>sunrise&sunset</label>
                        <label> sunrise {moment(data.data.weather.sys.sunrise).format('HH:mm')}</label>
                        <label> sunset {moment(data.data.weather.sys.sunset).format('HH:mm')}</label>
                    </div>
                    <div className="weather-item">
                        <label> wind</label>
                        <label> deg {data.data.weather.wind.deg}</label>
                        <label> gust {data.data.weather.wind.gust}</label>
                        <label> speed {data.data.weather.wind.speed}</label>

                    </div>
                    <div className="weather-item">
                        <label> temp</label>
                        <label> temp {Math.ceil(data.data.weather.main.temp - 273.15)}°C</label>
                        <label> temp max {Math.ceil(data.data.weather.main.temp_max - 273.15)}°C</label>
                        <label> temp min {Math.ceil(data.data.weather.main.temp_min - 273.15)}°C</label>

                    </div>
                </div>
            </div>
            <div className="button-group-card">
                <button className={`button-card-nav `} disabled={!data.data.index} onClick={() => {
                    data.changeData('up', data.data.index)
                }}>up
                </button>
                <button className={`button-card-nav `} disabled={!data.data.index && data.data.index !== 0}
                        onClick={() => {
                            data.changeData('delete', data.data.index)
                        }}>delete
                </button>
                <button className={`button-card-nav `}
                        disabled={data.isLastPage && store.getState().weatherList.list[store.getState().weatherList.list.length - 1].index === data.data.index}
                        onClick={() => {
                            data.changeData('down', data.data.index)
                        }}>down
                </button>
            </div>
        </div>
    )
}
