import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Test() {
    return <View style={styles.container}>

        <StatusBar style="auto" />

        {/*<Text style={styles.text}>Привет! Open up App.tsx to start working on your app!</Text>
        <Text style={styles.text}>Привет! Open up App.tsx to start working on your app!</Text>*/}

        <View style={styles.yellowView}><Text>Yellow View</Text></View>
        <View style={styles.blueView}><Text>Blue View</Text></View>

        {/*<View style={styles.container2}>
        </View>*/}

    </View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#dff5ff',
        //alignItems: 'center',
        //justifyContent: 'center',
        //flexDirection: 'row' // по умолчанию direction is column
    },
    text: {
        color: 'black',
        fontSize: 24
    },
    container2: {

    },
    yellowView: {
        flex: 1,
        backgroundColor: 'yellow'
    },
    blueView: {
        flex: 2,
        backgroundColor: 'blue'
    }
});

/*
    flex: number означает взять number единиц из всего доступного пространства
    (всё доступное - это сумма у всех флексов у детей одного родителя)

 */
