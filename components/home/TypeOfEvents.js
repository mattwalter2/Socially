import { View, Text } from 'react-native'
import React from 'react'

export default function TypeOfEvents({shownEventsType}) {
  return (
    <View style={{marginTop: 10}}>
      <Text style={{fontSize: 25,fontWeight: '700', marginLeft:15, marginBottom:10}}>{shownEventsType === 'For You' ? 'For You' : shownEventsType + ' Events'}</Text>
    </View>
  )
}