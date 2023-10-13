import { View, Text } from 'react-native'
import React from 'react'
import * as Location from 'react-location'


const openWeatherKey = '6a503e46e588f4f215c6b3be150b02fe'
let url = 'http://openWeathermap.org/data/2.5/onecall?&units=metric^exclude=minutely,hourly&appid=$'

const Weather = () => {
  return (
    <View>
      <Text>index</Text>
    </View>
  )
}

export default Weather