import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import AuthNavigation from './AuthNavigation';
import RootNavigation, { SignedInStack, SignedOutStack } from './navigation';
import {decode, encode} from 'base-64'
import CreateEvent from './screens/CreateEvent';
import Home from './screens/Home';
import Login from './screens/Login';
import Events from './screens/Events';
import Messages from './screens/Messages';
import ViewUserProfile from './screens/ViewUserProfile';

if (!global.btoa) { global.btota = encode }
if (!global.atob) { global.atob = decode }

export default function App() {
  return (
    <AuthNavigation />
  )
}


