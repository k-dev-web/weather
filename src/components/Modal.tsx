import React from 'react';
import "./Modal.css"
import {GoogleMap, useJsApiLoader} from '@react-google-maps/api';
import {usePlacesWidget} from "react-google-autocomplete";
import store from '../store'
import {WeatherProvider} from "../providers/WeatherProvider";

export class ShowModal extends React.Component {
    data: any;
    typeInput: any;

    constructor(props: any) {
        super(props);
        this.data = props;

        this.setInput();
    }

    state = {show: false}

    showModal = () => {
        this.setState({show: true});
    }
    hideModal = () => {
        this.setState({show: false});
    }
    setInput = () => {
        if (this.data.type && this.data.type !== 'link') {
            this.typeInput = <button className="modal-button right" style={this.data.style} onClick={this.showModal}>add
                city</button>
        }
    }

    render() {
        return (<>
                {this.typeInput}
                <Modal show={this.state.show} handleClose={this.hideModal}>

                </Modal>
            </>
        )
    }
}

const Modal = (data: any) => {
    const containerStyle = {
        width: '100%',
        height: '90vh'
    };
    const styleInput = {
        width: '100%',
        margin: '15px'
    }
    const showHideClassName = data.show ? 'modal display-block' : 'modal display-none';
    const {isLoaded} = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY ? process.env.REACT_APP_GOOGLE_API_KEY : ''
    })
    const geocoder = new google.maps.Geocoder();
    const [map, setMap] = React.useState<any>(null);
    const [center, setCenter] = React.useState<any>({
        lat: 0,
        lng: 0
    });
    const [zoom, setZoom] = React.useState<any>(2);
    const [latLng, setLatLng] = React.useState<any>(null)

    const [autocompleteInput, setAutocompleteInput] = React.useState<any>('')
    const [marker] = React.useState<any>(new google.maps.Marker());
    const {getLocations} = WeatherProvider();

    const selectedCity = async (place: any) => {
        setCenter(place.geometry.location);
        setZoom(10);
        setLatLng(place.geometry.location);
        marker.setPosition(place.geometry.location);
        let searchString = await createAutocompleteString(place)
        searchString = searchString.slice(1);
        setAutocompleteInput(searchString);
    }
    const {ref} = usePlacesWidget({
        apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
        onPlaceSelected: selectedCity,
    })
    const onLoad = (map: any) => {
        setMap(map)
        if (marker)
            marker.setMap(map);
    }

    const onUnmount = (map: any) => {
        setMap(null)
    }
    const onClickMap = async (event: any) => {
        marker.setPosition(event.latLng);
        let geo = await geocoder.geocode({location: event.latLng});
        setLatLng(event.latLng);
        if (geo.results) {
            let searchString = await createAutocompleteString(geo.results[0])
            searchString = searchString.slice(1);
            setAutocompleteInput(searchString);
        }
    }
    const saveData = async () => {
        if (latLng) {
            let savingData: any = {latLng: {lat: latLng.lat(), lng: latLng.lng()}, name: autocompleteInput};
            let storage: any = localStorage.getItem('city');
            storage ? savingData.index = JSON.parse(storage).length : savingData.index = 0;
            storage = JSON.parse(storage);
            if (storage && storage.find((item: any) => item.name === savingData.name)) {
                store.dispatch({
                    type: 'NEW TOAST',
                    data: {description: 'error name already exist', type: 'red', title: 'add new location'}
                })
                data.handleClose();
                return;
            }
            savingData = storage ? [...storage, savingData] : [savingData];
            savingData.sort((item1: any, item2: any) => {
                if (item1.index < item2.index) {
                    return -1;
                }
                if (item1.index > item2.index) {
                    return 1;
                }
                return 0;
            })
            localStorage.setItem('city', JSON.stringify(savingData));
            if (store.getState().weatherList.list.length < 5)
                await getLocations(store.getState().weatherList.page)
            else {
                store.dispatch({type: "LOAD PROD"});
            }
            data.handleClose();
        }
    }


    return (
        <div className={showHideClassName}>
            <div className={'modal-main'}>
                <div className={'modal-autocomplete'}>


                    <input
                        // @ts-ignore
                        ref={ref}
                        style={styleInput}
                        value={autocompleteInput}
                        onChange={event => setAutocompleteInput(event.target.value)}
                    />
                    <button className="modal-button right" onClick={saveData}>
                        add city
                    </button>
                </div>
                {isLoaded ? (
                    <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={center}
                        zoom={zoom}
                        onLoad={onLoad}
                        onClick={onClickMap}
                        onUnmount={onUnmount}
                    >
                        <></>
                    </GoogleMap>
                ) : <></>}
            </div>
        </div>
    );
};

async function createAutocompleteString(data: any) {
    let searchString: any = '';
    data.address_components.forEach(((item: any) => {
        for (let i in item.types) {
            if (item.types[i] === "political" ||
                item.types[i] === "country") {
                searchString = ',' + item.long_name + searchString;
                continue;
            }
        }
    }))
    if (!searchString) {
        searchString = data.formatted_address;
    }
    return searchString;
}
