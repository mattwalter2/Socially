import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import Categories from './Categories'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

export default function BottomTabs( { navigation, ...props }) {
  return (
    <View 
        style={{
            flexDirection:'row', 
            margin:10, 
            marginHorizontal:30, 
            justifyContent:'space-between',
        }}
    >
        <TouchableOpacity onPress= {() => navigation.navigate('Home')}>
            <Icon icon='home' text='Home' />
        </TouchableOpacity>
        <TouchableOpacity onPress= {() => navigation.navigate('Messages')}>
            <Icon icon='comment' text='Messages' />
        </TouchableOpacity>
        <TouchableOpacity onPress= {() => navigation.navigate('CreateEvent')}>
            <Icon icon='plus' text='Create' />
        </TouchableOpacity>
        <TouchableOpacity onPress= {() => navigation.navigate('Events')}>
            <Icon icon='calendar' text='Events' />
        </TouchableOpacity>
        <TouchableOpacity onPress= {() => navigation.navigate('UserProfileView')}>
            <Icon icon='user' text='Profile' />
        </TouchableOpacity>
        
      
    </View>
  )
}

export const Icon = (props) => (
    <View>
        <FontAwesome5
        name={props.icon}
        size={25}
        style={{
            marginBottom: 3,
            alignSelf: 'center'
        }}
        />
        <Text>{props.text}</Text>
    </View>

)