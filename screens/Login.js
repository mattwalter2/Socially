import { View, Text, Image } from 'react-native'
import React from 'react'
import LoginForm from '../components/Login/LoginForm'
import { LinearGradient } from 'expo-linear-gradient';

export default function Login({navigation}) {
  return (
    <View style={{flex: 1, backgroundColor: 'pink'}}>
      <LinearGradient
      
        colors={['#ff78bb', '#dbbc97']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{flex:1}}
      >
        <View>
          <Image
            source={{uri: '/Users/matthewwalter/Desktop/socially/socially/assets/Socially Logo All White.png'}}
            style={{width: 340, height: 340, resizeMode: 'contain', alignSelf: 'center'}}
          />
        </View>
        <LoginForm navigation={navigation} />
      </LinearGradient>
    </View>
  )
}
