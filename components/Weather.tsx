import React, {useEffect, useLayoutEffect, useState} from 'react'
import {
    Alert,
    StyleSheet,
    Text,
    View,
    StatusBar // отвечает за верхнюю часть экрана, где системные значки, можно добавить в любое место дерева вьюшек
} from 'react-native';

import { NumFormat } from "../utils/NumFormat";
import { Ionicons,Feather,Fontisto,MaterialCommunityIcons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient';


const f = new NumFormat()
f.setFormat({
    round: {scale: 0, mode: "half-up"},
    suffix: "°"
})


const icSize = 90
const textColors = {
    "Thunderstorm": 'white',
    "Drizzle": 'white',
    "Rain": 'white',
    "Snow": 'white',
    "Mist": 'white',
    "Smoke": 'white',
    "Haze": 'white',
    "Dust": 'white',
    "Fog": 'white',
    "Sand": 'white',
    "Ash": 'white',
    "Squall": 'white',
    "Tornado": 'white',
    "Clear": 'white',
    "Clouds": 'white',
}
const weatherOptions = {
    "Thunderstorm": {
        icon: <Ionicons name="thunderstorm-outline" size={icSize} color={textColors["Thunderstorm"]} />,
        gradientColors: ['#141Е30', '#243b55'],
        title: "",
        subtitle: "",
    },
    "Drizzle": {
        icon: <Feather name="cloud-drizzle" size={icSize} color={textColors["Drizzle"]} />,
        gradientColors: ['#3a7bd5','#3a6073'],
    },
    "Rain": {
        icon: <Ionicons name="rainy-outline" size={icSize} color={textColors["Rain"]} />,
        gradientColors: ['#000046','#1cb5e0'],
    },
    "Snow": {
        icon: <Ionicons name="snow-outline" size={icSize} color={textColors["Snow"]} />,
        gradientColors: ['#83a4d4','#b6fbff'],
        title: "На улице снежок!",
        subtitle: "Одевайтесь потеплее лепите снеговиков",
    },
    "Mist": {
        icon: <Fontisto name="fog" size={icSize} color={textColors["Mist"]} />,
        gradientColors: ['#606c88','#3f4c6b'],
    },
    "Smoke": {
        icon: <Fontisto name="fog" size={icSize} color={textColors["Smoke"]} />,
        gradientColors: ['transparent','rgba(0,0,0,0.3)'],
    },
    "Haze": {
        icon: <Fontisto name="day-haze" size={icSize} color={textColors["Haze"]} />,
        gradientColors: ['#3e5151','#decba4'],
    },
    "Dust": {
        icon: <Fontisto name="fog" size={icSize} color={textColors["Dust"]} />,
        gradientColors: ['#b79891','#94716b'],
    },
    "Fog": {
        icon: <MaterialCommunityIcons name="weather-fog" size={icSize} color={textColors["Fog"]} />,
        gradientColors: ['transparent','rgba(0,0,0,0.3)'],
    },
    "Sand": {
        icon: <Fontisto name="fog" size={icSize} color={textColors["Sand"]} />,
        gradientColors: ['transparent','rgba(0,0,0,0.3)'],
    },
    "Ash": {
        icon: <Fontisto name="fog" size={icSize} color={textColors["Ash"]} />,
        gradientColors: ['transparent','rgba(0,0,0,0.3)'],
    },
    "Squall": {
        icon: <Fontisto name="wind" size={icSize} color={textColors["Squall"]} />,
        gradientColors: ['transparent','rgba(0,0,0,0.3)'],
    },
    "Tornado": {
        icon: <MaterialCommunityIcons name="weather-tornado" size={icSize} color={textColors["Tornado"]} />,
        gradientColors: ['transparent','rgba(0,0,0,0.3)'],
    },
    "Clear": {
        icon: <Fontisto name="day-sunny" size={icSize} color={textColors["Clear"]} />,
        gradientColors: ['#56ccf2','#2f80ed'],
    },
    "Clouds": {
        icon: <Ionicons name="partly-sunny-outline" size={icSize} color={textColors["Clouds"]} />,
        gradientColors: ['#757f9a','#d7dde8'],
    },
}
/*const icons = new Map([
    ["Thunderstorm",<Ionicons name="thunderstorm-outline" size={icSize} color={icColor} />],
    ["Drizzle",<Feather name="cloud-drizzle" size={icSize} color={icColor} />],
    ["Rain",<Ionicons name="rainy-outline" size={icSize} color={icColor} />],
    ["Snow",<Ionicons name="snow-outline" size={icSize} color={icColor} />],
    ["Mist",<Fontisto name="fog" size={icSize} color={icColor} />],
    ["Smoke",<Fontisto name="fog" size={icSize} color={icColor} />],
    ["Haze",<Fontisto name="day-haze" size={icSize} color={icColor} />],
    ["Dust",<Fontisto name="fog" size={icSize} color={icColor} />],
    ["Fog",<MaterialCommunityIcons name="weather-fog" size={icSize} color={icColor} />],
    ["Sand",<Fontisto name="fog" size={icSize} color={icColor} />],
    ["Ash",<Fontisto name="fog" size={icSize} color={icColor} />],
    ["Squall",<Fontisto name="wind" size={icSize} color={icColor} />],
    ["Tornado",<MaterialCommunityIcons name="weather-tornado" size={icSize} color={icColor} />],
    ["Clear",<Fontisto name="day-sunny" size={icSize} color={icColor} />],
    ["Clouds",<Ionicons name="partly-sunny-outline" size={icSize} color={icColor} />],
])*/


type WeatherType = {
    temp: number
    condition: "Thunderstorm"|"Drizzle"|"Rain"|"Snow"|"Mist"|"Smoke"|"Haze"|"Dust"|"Fog"|"Sand"|"Ash"|"Squall"|"Tornado"|"Clear"|"Clouds"
}

export default function Weather({temp,condition}: WeatherType){
    let t = f.setValue(temp).format()

    //condition = "Snow"

    const [s2,setS2] = useState(StyleSheet.create({
        tempText: { },
        conditionText: { },
        conditionSecondaryText: { },
    }))
    useLayoutEffect(()=>{
        setS2(StyleSheet.create({
            tempText: { color: textColors[condition] },
            conditionText: { color: textColors[condition] },
            conditionSecondaryText: { color: textColors[condition] },
        }))
    },[condition])


    return <>
        <StatusBar barStyle="light-content" />
        <View style={s.box}>
            <LinearGradient
                // Background Linear Gradient
                //colors={['transparent','rgba(0,0,0,0.3)']}
                colors={weatherOptions[condition].gradientColors}
                style={s.background}
            />
            <View style={s.weatherBox}>
                { weatherOptions[condition].icon }
                <Text style={{...s.tempText, ...s2.tempText}}>{t}</Text>
            </View>
            <View style={s.weatherDescriptionBox}>
                <Text style={[s.conditionText, s2.conditionText]}>{
                    // @ts-ignore
                    weatherOptions[condition].title??condition
                }</Text>
                <View style={{flexDirection: "row"}}>
                    <Text style={[s.conditionSecondaryText, s2.conditionSecondaryText]}>{
                        // @ts-ignore
                        weatherOptions[condition].subtitle??condition
                    }</Text>
                </View>

            </View>
        </View>
    </>
}



const s0 = StyleSheet.create({
    text: {
        fontSize: 30,
        color: 'white',
        paddingHorizontal: 30
    }
})

const s = StyleSheet.create({
    box: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        //backgroundColor: 'red'
    },

    weatherBox: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    tempText: {
        ...s0.text
    },

    weatherDescriptionBox: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    conditionText: {
        ...s0.text,
        alignItems: 'flex-start'
    },
    conditionSecondaryText: {
        ...s0.text,
        //backgroundColor: 'red',
        marginTop: 10,
        fontSize: 20,
        fontWeight: "100",
        flex: 1,
        textAlign: 'left'
    },

    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
        //height: 300,
    }

})
