
import 'react-native-gesture-handler';
import React from 'react';
import Home from './app/Home';
import NewCampaign from './app/NewCampaign';
import ContactsList from './app/ContactsList';
import { GlobalProvider } from './app/context/globalContext';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export default function App() {
  
  return (
    <GlobalProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={Home} options={{ title: 'Mis Campañas SMS' }}/>
          <Stack.Screen name="New-Campaign" component={NewCampaign} options={{ title: 'Nueva Campaña' }}/>
          <Stack.Screen name="Contacts-List" component={ContactsList} options={{ title: 'Contactos' }}/>
        </Stack.Navigator>
      </NavigationContainer>
    </GlobalProvider>
    ) 
}