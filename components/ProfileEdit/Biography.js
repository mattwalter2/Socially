import { View, Text } from 'react-native'
import React from 'react'

export default function Biography( {biography}) {
  return (
    <View style={{}}>
      <BiographyTitle />
      <BiographyText biography={biography}/>
    </View>
  )
}

export const BiographyTitle = () => (
    <Text style={{fontSize: 23, fontWeight: '500'}}>Biography</Text>
)

export const BiographyText = (props) => (
    <Text style={{marginTop: 20, fontSize: 19}}>{props.biography}</Text>
)