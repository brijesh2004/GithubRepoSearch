import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Main from './Main';
import Details from '../screen/Details';
import Favorite from './Favorite';

type RootStackParamList = {
  Home: undefined;   
  Details: { id: number };
  Fav:undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const Navig = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={Main}
          options={{
            title: 'Main',
          }}
        />
        <Stack.Screen
          name="Details"
          component={Details}
          options={{
            title: 'Details',
          }}
        />
        <Stack.Screen
        name="Fav"
        component={Favorite}
        options={{title:'Favorite'}}/>
      </Stack.Navigator>

    </NavigationContainer>
  );
};

export default Navig;
