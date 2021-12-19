import React, {useEffect, useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import {Alert, StyleSheet, Text, View} from 'react-native';
import * as Location from 'expo-location'
import Loading from "./components/Loading";
import {Accuracy} from "expo-location";
import {empty} from "./utils/utils";
import useLoading from "./hooks/useLoading";
import useErr from "./hooks/useErr";
import {apiWGetWeather} from "./api/api-weather-map";


// Определяю местоположение...
// Загружаю информацию о погоде...

const loadLocation = "load geolocation"
const loadWeather = "load weather"

const errLocation = "err location"
const errWeather = "err weather"

export default function App() {

    const loads = useLoading()
    const errs = useErr()

    const [location, setLocation] = useState(undefined as empty|any)
    const [weather, setWeather] = useState(undefined as empty|any)


    useEffect(()=>{
        (async ()=>{
            loads.start(loadLocation)
            errs.clear(errLocation)
            let {status} = await Location.getForegroundPermissionsAsync()
            if (status !== 'granted'){
                errs.set(errLocation, 'Location permission denied')
                return Promise.reject('Location permission denied')
            }
            const locationOptions = {accuracy: Accuracy.BestForNavigation}
            const location = await Location.getCurrentPositionAsync(locationOptions)
            const {coords: {latitude, longitude}} = location
            // todo сделать запрос к апи
            setLocation(location)
        })()
            .catch(err=>{
                errs.set(errLocation)
                Alert.alert(
                    "Не могу определить местоположение", "Возможно не выданы разрешения"
                )
            })
            .finally(()=>loads.finish(loadLocation))
    },[])

    useEffect(()=>{
        if (location){
            loads.start(loadWeather)
            errs.clear(errWeather)
            apiWGetWeather(location.coords.latitude, location.coords.longitude)
            .then(response=>{
                setWeather(response.data)
            }).catch(err=>{
                errs.set(errWeather)
            }).finally(()=>{
                loads.finish(loadWeather)
            })
        }
    },[location])

    console.log("---------------------------------------")
    console.log(location)
    console.log(weather)
    console.log("===========")
    console.log(loads.get(loadLocation))
    console.log(loads.get(loadWeather))
    console.log(errs.get(errLocation))
    console.log(errs.get(errWeather))



    return <>
        {
            loads.get(loadLocation) &&
            <Loading />
        }


    </>
}

