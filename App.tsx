import React, {useEffect, useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import {Alert, StyleSheet, Text, View} from 'react-native';
import * as Location from 'expo-location'
import Loading from "./components/Loading";
import {Accuracy} from "expo-location";
import {empty} from "./utils/utils";
import {apiWGetWeather} from "./api/api-weathermap";
import Weather from "./components/Weather";


// Определяю местоположение...
// Загружаю информацию о погоде...

/*
    todo
     разрешение на геолокацию
     проверить включена ли геолокация (мне в принципе приблизительной хватит)
     получение данных а текущей локации
     получение данных о погоде (можно ещё проверить доступность инета)
 */

export default function App() {

    const [loadLocationPermission, setLoadLocationPermission] = useState(false)
    const [loadLocation, setLoadLocation] = useState(false)
    const [loadWeather, setLoadWeather] = useState(false)

    const [errLocationPermission, setErrLocationPermission] = useState(undefined as empty|string)
    const [errLocation, setErrLocation] = useState(undefined as empty|string)
    const [errWeather, setErrWeather] = useState(undefined as empty|string)

    const [locationPermission, setLocationPermission] = useState(false)
    const [location, setLocation] = useState(undefined as empty|Location.LocationObject)
    const [weather, setWeather] = useState(undefined as empty|{[prop: string]:any})




    //const [loading, setLoading] = useState(false)
    //const [location, setLocation] = useState(undefined as empty|object);
    //const [errMsg, setErrMsg] = useState(undefined as empty|string);

    /*const getLocation = async () => {
        try {
            const permissions = await Location.getForegroundPermissionsAsync()
            console.log(permissions)
        } catch (err) {
            console.log(err)
        }


        //const locationOptions = {accuracy: Accuracy.BestForNavigation}
        //const location = await Location.getCurrentPositionAsync(locationOptions)
        //console.log(location)
    }*/


    useEffect(()=>{
        setLoadLocationPermission(true)
        setErrLocationPermission(undefined)
        Location.requestForegroundPermissionsAsync()
            .then(({status})=>{
                if (status==='granted'){
                    setLocationPermission(true)
                } else {
                    throw new Error()
                }
            })
            .catch(err=>{
                setLocationPermission(false)
                setErrLocationPermission("Ошибка получения разрешения на геолокацию")
            })
            .finally(()=>{
                setLoadLocationPermission(false)
            })
    },[])


    useEffect(()=>{
        if (locationPermission){
            setLoadLocation(true)
            setErrLocation(undefined)
            const locationOptions = {accuracy: Accuracy.Low}
            Location.getCurrentPositionAsync(locationOptions)
                .then(location=>{
                    setLocation(location)
                })
                .catch(err=>{
                    console.log("error:")
                    console.log(err)
                    setLocation(undefined)
                    setErrLocation("Ошибка получения геолокации")
                })
                .finally(()=>{
                    console.log("location finally")
                    setLoadLocation(false)
                })
        } else {
            setLocation(undefined)
        }
    },[locationPermission])


    useEffect(()=>{
        if (location){
            setLoadWeather(true)
            setErrWeather(undefined)
            apiWGetWeather(location.coords.latitude, location.coords.longitude)
                .then(response=>{
                    setWeather(response.data)
                })
                .catch(err=>{
                    setErrWeather("Ошибка загрузки погоды")
                }).finally(()=>{
                setLoadWeather(false)
                })
        } else {
            setWeather(undefined)
        }
    },[location])


    /*useEffect(()=>{
        (async ()=>{
            setLoading(true)
            let {status} = await Location.requestBackgroundPermissionsAsync()
            if (status !== 'granted'){
                setErrMsg('Location permission denied')
                //return
            }
            const locationOptions = {accuracy: Accuracy.BestForNavigation}
            const location = await Location.getCurrentPositionAsync(locationOptions)
            const {coords: {latitude, longitude}} = location

            // todo сделать запрос к апи
            setLocation(location)
        })()
            .catch(err=>Alert.alert(
            "Не могу определить местоположение", "Возможно не выданы разрешения"
            ))
            .finally(()=>setLoading(false))
    },[])*/



    //console.log(locationPermission)
    if (location) console.log(location)
    if (weather) console.log(weather)


    if (loadLocationPermission) {
        return <Loading msg={"Получаю разрешение на геолокацию..."}/>
    }
    if (loadLocation) {
        return <Loading msg={"Определяю местоположение..."}/>
    }
    if (loadWeather){
        return <Loading msg={"Загружаю погоду..."}/>
    }
    if (weather) {
        return <Weather temp={weather.main.temp} condition={weather.weather[0].main}/>
    }

    return <></>
}


