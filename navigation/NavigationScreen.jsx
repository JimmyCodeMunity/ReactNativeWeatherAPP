import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomeScreen from '../screens/HomeScreen'


const Stack = createNativeStackNavigator();

const NavigationScreen = () => {
  return (
    <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen name="home" component={HomeScreen} options={{ headerShown:false }}/>
        </Stack.Navigator>
    </NavigationContainer>
  )
}

export default NavigationScreen

const styles = StyleSheet.create({})