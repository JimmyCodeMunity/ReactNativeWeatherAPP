import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView, ScrollView, TextInput } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { theme } from '../theme'
import { MagnifyingGlassIcon, CalendarDaysIcon } from 'react-native-heroicons/outline';
import { MapPinIcon } from 'react-native-heroicons/solid';
import { debounce } from 'lodash';
import { fetchLocations, fetchWeatherForeCast } from '../api/weather';
import { weatherImages } from '../constants';
import * as Progress from 'react-native-progress';
import { getData, storeData } from '../utils/asyncStorage';


const HomeScreen = () => {
    const [showSearch, toggleSearch] = useState(false);
    const [locations, setLocations] = useState([1, 2, 3]);
    const [weather, setWeather] = useState({});
    const [loading, setLoading] = useState(true)



    const handleSearch = value => {
        //console.log('value',value)
        if (value.length > 2) {
            fetchLocations({ cityName: value }).then(data => {
                //console.log('fetched locations:',data)
                setLoading(false)
                setLocations(data);
            })

        }
        else {
            setLoading(true);
        }

    }
    const handleTextDebounce = useCallback(debounce(handleSearch, 1200), [])

    const handleLocation = (loc) => {
        console.log('location:', loc);
        toggleSearch(false);
        setLocations([]);
        setLoading(true);

        fetchWeatherForeCast({
            cityName: loc.name,
            days: '7'
        }).then(data => {
            setWeather(data);
            setLoading(false)
            storeData('city', loc.name)
            console.log('got data', data);
        })
    }


    const { current, location } = weather;


    useEffect(() => {
        fetchMyWeatherData()
    }, [])


    const fetchMyWeatherData = async () => {
        let myCity = await getData('city');
        let cityName = 'Nairobi';
        if (myCity) cityName = myCity;
        fetchWeatherForeCast({
            cityName,
            days: '7'
        }).then(data => {

            setWeather(data);
            setLoading(false);
        })
    }



    return (
        <View className="flex-1 relative">
            <StatusBar style="light" />

            <Image source={require('../assets/images/bg.png')} blurRadius={70} className="absolute h-full w-full" />


            {
                loading ? (
                    <View className="flex-1 flex-row justify-center items-center">
                        <Progress.CircleSnail thickness={10} size={140} color="#0bb32b" />

                    </View>

                ) : (

                    <SafeAreaView className="flex flex-1">
                        {/**search section */}
                        <View className="relative mx-4 z-50" style={{ height: '7%' }}>
                            <View className="flex-row justify-end items-center rounded-full" style={{ backgroundColor: showSearch ? theme.bgWhite(0.2) : 'transparent' }}>
                                {
                                    showSearch ? (
                                        <TextInput
                                            onChangeText={handleTextDebounce}
                                            placeholder="Search City"
                                            className="pl-6 flex-1 text-base text-white h-10"
                                            placeholderTextColor={'lightgrey'} />

                                    ) : null
                                }

                                <TouchableOpacity
                                    onPress={() => toggleSearch(!showSearch)}
                                    className="rounded-full p-3 m-1" style={{ backgroundColor: theme.bgWhite(0.3) }}>
                                    <MagnifyingGlassIcon size={25} color={'white'} />
                                </TouchableOpacity>
                            </View>


                            {/**locations */}
                            {
                                locations.length > 0 && showSearch ? (
                                    <View className="absolute w-full bg-gray-100 top-16 rounded-3xl">
                                        {
                                            locations.map((loc, index) => {
                                                let showBorder = index + 1 != locations.length;
                                                let borderClass = showBorder ? ' border-b-2 border-b-gray-300' : ''
                                                return (
                                                    <TouchableOpacity key={index}
                                                        onPress={() => handleLocation(loc)}
                                                        className={"flex-row border-0 items-center mb-1 p-3 px-4" + borderClass}
                                                    >
                                                        <MapPinIcon size={20} color={'gray'} />
                                                        <Text className="text-black text-lg ml-2">{loc?.name}, {loc?.country}</Text>
                                                    </TouchableOpacity>
                                                )
                                            })
                                        }
                                    </View>
                                ) : null
                            }
                        </View>

                        {/**Forecast section */}
                        <View className="flex mx-4 justify-around mb-2 flex-1">
                            <Text className="text-white text-center text-2xl font-bold">{location?.name},
                                <Text className="text-lg font-semibold text-gray-300">{" " + location?.country}</Text>
                            </Text>
                            {/**weather image */}
                            <View className="flex-row justify-center">
                                <Image source={weatherImages[current?.condition?.text]}
                                    className="h-52 w-52"
                                />
                            </View>
                            {/**degrees celcius */}
                            <View className="space-y-2">
                                <Text className="text-center font-bold text-white text-6xl ml-5">
                                    {current?.temp_c}&#176;
                                </Text>
                                <Text className="text-center font-bold text-white text-xl ml-5">
                                    {current?.condition?.text}
                                </Text>

                            </View>

                            {/**other stats */}
                            <View className="flex-row justify-between mx-4">
                                <View className="flex-row space-x-2 items-center">
                                    <Image source={require('../assets/icons/wind.png')}
                                        className="h-6 w-6"
                                    />
                                    <Text className="text-white font-semibold text-base">
                                        {current?.wind_kph}km
                                    </Text>
                                </View>

                                <View className="flex-row space-x-2 items-center">
                                    <Image source={require('../assets/icons/drop.png')}
                                        className="h-6 w-6"
                                    />
                                    <Text className="text-white font-semibold text-base">
                                        {current?.humidity}%
                                    </Text>
                                </View>

                                <View className="flex-row space-x-2 items-center">
                                    <Image source={require('../assets/icons/sun.png')}
                                        className="h-6 w-6"
                                    />
                                    <Text className="text-white font-semibold text-base">
                                        6:05 AM
                                    </Text>
                                </View>
                            </View>
                        </View>


                        {/**forecast for next days */}
                        <View className="space-y-3 mb-2">
                            <View className="flex-row items-center mx-5 space-x-2">
                                <CalendarDaysIcon size={20} color={'white'} />
                                <Text className="text-white text-base">Daily Forecast</Text>
                            </View>
                            <ScrollView
                                horizontal
                                contentContainerStyle={{ paddingHorizontal: 15 }}
                                showsHorizontalScrollIndicator={false}
                            >


                                {
                                    weather?.forecast?.forecastday?.map((item, index) => {
                                        let date = new Date(item.date);
                                        let options = { weekday: 'long' };
                                        let dayName = date.toLocaleDateString('en-US', options);
                                        dayname = dayName.split(',')[0]

                                        return (
                                            <View key={index} className="flex items-center w-24 justify-center rounded-3xl py-3 space-y-1 mr-4"
                                                style={{ backgroundColor: theme.bgWhite(0.15) }}
                                            >
                                                <Image source={weatherImages[item?.day?.condition?.text]} className="h-11 w-11" />
                                                <Text className="text-white">{dayName}</Text>
                                                <Text className="text-white text-xl font-semibold">
                                                    {item.day.avgtemp_c}&#176;
                                                </Text>
                                            </View>

                                        )
                                    })
                                }



                            </ScrollView>
                        </View>


                    </SafeAreaView>

                )
            }

        </View >
    )
}

export default HomeScreen

const styles = StyleSheet.create({})