import React, {useEffect, useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import {Alert, StyleSheet, Text, View} from 'react-native';
import * as Location from 'expo-location'
import Loading from "./components/Loading";
import {Accuracy} from "expo-location";
import {empty} from "./utils/utils";
import {apiWGetWeather} from "./api/api-weathermap";


// Определяю местоположение...
// Загружаю информацию о погоде...

export default function App() {

    const [loadLocationPermission, setLoadLocationPermission] = useState(false)
    const [loadLocation, setLoadLocation] = useState(false)
    const [loadWeather, setLoadWeather] = useState(false)

    const [errLocationPermission, setErrLocationPermission] = useState(undefined as empty|string)
    const [errLocation, setErrLocation] = useState(undefined as empty|string)
    const [errWeather, setErrWeather] = useState(undefined as empty|string)

    const [locationPermission, setLocationPermission] = useState(false)
    const [location, setLocation] = useState(undefined as empty|Location.LocationObject)
    const [weather, setWeather] = useState(undefined as empty|{})





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
        Location.requestBackgroundPermissionsAsync()
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
            const locationOptions = {accuracy: Accuracy.BestForNavigation}
            Location.getCurrentPositionAsync(locationOptions)
                .then(location=>{
                    setLocation(location)
                })
                .catch(err=>{
                    setLocation(undefined)
                    setErrLocation("Ошибка получения геолокации")
                })
                .finally(()=>{
                    setLoadLocation(false)
                })
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

    console.log(locationPermission)
    console.log(location)
    console.log(weather)


    return <>
        {
            loadLocationPermission &&
            <Loading msg={"Получаю разрешение на геолокацию..."}/>
        }
        {
            loadLocation &&
            <Loading msg={"Определяю местоположение..."}/>
        }
        {
            loadWeather &&
            <Loading msg={"Загружаю погоду..."}/>
        }

        {
            !(loadLocationPermission || loadLocation || loadWeather) &&
            <View style={{flex:1, justifyContent: 'flex-end'}}>
                <Text>READY</Text>
            </View>

        }


    </>
}





/*

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
 */

