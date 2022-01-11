import React, {useEffect, useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import {Alert, StyleSheet, Text, View} from 'react-native';
import * as Location from 'expo-location'
import Loading from "./components/Loading";
import {Accuracy} from "expo-location";
import {empty} from "./utils/utils";

export default function App() {

    const [loading, setLoading] = useState(false)
    const [location, setLocation] = useState(undefined as empty|object);
    const [errMsg, setErrMsg] = useState(undefined as empty|string);

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
    },[])

    console.log(location)
    console.log(errMsg)

    return <>
        {
            loading &&
            <Loading />
        }


    </>
}

