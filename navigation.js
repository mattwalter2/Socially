import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native'
import Home from './screens/Home';
import CreateEvent from './screens/CreateEvent';
import Login from './screens/Login';
import SignUp from './screens/SignUp';
import Events from './screens/Events';
import UserProfileView from './screens/UserProfileView';
import UserProfileEdit from './screens/UserProfileEdit';
import Messages from './screens/Messages';
import Chat from './screens/Chat';
import ViewUserProfile from './screens/ViewUserProfile';
import EditEvent from './screens/EditEvent';

const Stack = createStackNavigator()

const screenOptions = {
  headerShown: false,
}

export const SignedInStack = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName='Home' screenOptions={screenOptions}>
      <Stack.Screen name='Home' component={Home} />
      <Stack.Screen name='Messages' component={Messages} />
      <Stack.Screen name='CreateEvent' component={CreateEvent} />
      <Stack.Screen name='Events' component={Events} />
      <Stack.Screen name='UserProfileView' component={UserProfileView} />
      <Stack.Screen name='UserProfileEdit' component={UserProfileEdit} />
      <Stack.Screen name='Chat' component={Chat} />
      <Stack.Screen name='ViewUserProfile' component={ViewUserProfile} />
      <Stack.Screen name='EditEvent' component={EditEvent} />
    </Stack.Navigator>
  </NavigationContainer>
)

export const SignedOutStack = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName='Login' screenOptions={screenOptions}>
      <Stack.Screen name='Login' component={Login} />
      <Stack.Screen name='SignUp' component={SignUp} />
    </Stack.Navigator>
  </NavigationContainer>

)