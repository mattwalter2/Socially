import { View, Text, Image } from 'react-native'
import React from 'react'
import SignUpForm from '../components/SignUp/SignUpForm'
import { LinearGradient } from 'expo-linear-gradient';

export default function SignUp({navigation}) {
  return (

        <View style={{flex: 1}}>
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
            <SignUpForm navigation={navigation} />
            </LinearGradient>
        </View>
      
  )
}