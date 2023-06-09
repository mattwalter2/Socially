import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { collection, doc, getDoc, onSnapshot } from 'firebase/firestore'
import { db, auth } from '../../firebase'
import { color } from 'react-native-elements/dist/helpers'

export default function TopOfProfileView( {navigation, profileInformation}) {

  return (
    <View style={{flexDirection: 'row', padding: 30, justifyContent: 'space-between'}}>
      <ProfilePicture profilePicture={profileInformation.profile_picture} />
      <View style={{marginRight: 30, justifyContent: 'center'}}>
        <ProfileName profileName={profileInformation.username} />
        <EditButton navigation={navigation} />
      </View>
    </View>
  )
}

export const ProfilePicture = (props) => (
    <Image
        source={{
            uri: props.profilePicture
        }} 
        style={{width:75, height:75, borderRadius:37.5}}
    />
)

export const ProfileName = (props) => (
    <Text style={{fontSize: 20, fontWeight: '700', textAlign: 'center'}}>{props.profileName}</Text>
)

export const EditButton = ({navigation}) => (
    <TouchableOpacity 
      style={{flexDirection: 'row', justifyContent: 'space-evenly', borderWidth: 1.5 ,width: 140, height: 30,  marginTop: 15, borderRadius: 10}}
      onPress={() => navigation.push('UserProfileEdit')}
    >
        <Text style={{textAlign: 'center', fontWeight: '500', fontSize: 15, marginTop: 4}}>Edit</Text>
        <FontAwesome5 style={{marginTop: 3}} name='edit' size={20} color={'black'} />
    </TouchableOpacity>
)