import React from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import CityList from './CityList';
// import WeatherDetailScreen from './WeatherDetailScreen';
import Test from './WeatherDetail';

const AppNavigator = createStackNavigator(
  {
    CityList: CityList,
    // Detail: WeatherDetailScreen,
      Test: Test,
  },
  {
    initialRouteName: 'CityList',
  }
);

export default createAppContainer(AppNavigator);
