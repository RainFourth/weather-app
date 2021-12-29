import React, {useEffect, useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import {Alert, StyleSheet, Text, View} from 'react-native';
import * as Location from 'expo-location'
import Loading from "./components/Loading";
import {Accuracy} from "expo-location";
import {empty} from "./utils/utils";
import {apiWGetWeather} from "./api/api-weather-map";


// Определяю местоположение...
// Загружаю информацию о погоде...


export default function App() {

    const [loadLocation, setLoadLocation] = useState(false)
    const [loadWeather, setLoadWeather] = useState(false)

    const [errLocation, setErrLocation] = useState(undefined as string|empty)
    const [errWeather, setErrWeather] = useState(undefined as string|empty)

    const [location, setLocation] = useState(undefined as empty|any)
    const [weather, setWeather] = useState(undefined as empty|any)


    useEffect(()=>{
        (async ()=>{
            setLoadLocation(true)
            setErrLocation(undefined)
            let {status} = await Location.getForegroundPermissionsAsync()
            //console.log("status:")
            //console.log(status)
            if (status !== 'granted'){
                setErrLocation('Location permission denied')
                return Promise.reject('Location permission denied')
            }
            const locationOptions = {accuracy: Accuracy.BestForNavigation}
            const location = await Location.getCurrentPositionAsync(locationOptions)
            const {coords: {latitude, longitude}} = location
            // todo сделать запрос к апи
            setLocation(location)
        })()
            .catch(err=>{
                setErrLocation("error")
                Alert.alert(
                    "Не могу определить местоположение", "Возможно не выданы разрешения"
                )
            })
            .finally(()=>setLoadLocation(false))
    },[])

    useEffect(()=>{
        if (location){
            setLoadWeather(true)
            setErrWeather(undefined)
            apiWGetWeather(location.coords.latitude, location.coords.longitude)
            .then(response=>{
                setWeather(response.data)
            }).catch(err=>{
                setErrWeather("error")
            }).finally(()=>{
                setLoadWeather(false)
            })
        }
    },[location])

    console.log("---------------------------------------")
    console.log(location)
    console.log(weather)
    console.log("===========")
    console.log(loadLocation)
    console.log(loadWeather)
    console.log(errLocation)
    console.log(errWeather)



    return <>
        {
            loadLocation &&
            <Loading />
        }


    </>
}

