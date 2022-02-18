import React from 'react'
import { StatusBar, StyleSheet, Text, View } from 'react-native';


export default function Loading({msg}: {msg:string}){
    return <>
        <StatusBar barStyle="dark-content"/>
        <View style={styles.linear}>
            <Text style={styles.text}>{msg}</Text>
        </View>
    </>
}


const styles = StyleSheet.create({
    linear: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 30,
        paddingVertical: 100,
        backgroundColor: "#FDF6AA"
    },
    text: {
        color: "#2c2c2c",
        fontSize: 30
    }
})
