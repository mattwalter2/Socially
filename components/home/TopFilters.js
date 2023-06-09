import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native'
import React from 'react'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

export default function TopFilters() {
  return (
    <SafeAreaView>
        <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-between',
            marginLeft: 30,
            marginRight: 30,
            marginTop: 15
        }}>
            <MapButton />
            <FilterButton />
        </View>
    </SafeAreaView>
  )
}

export const MapButton = (props) => (
    <TouchableOpacity>
        <FontAwesome5 name='map-marked' size={32} />
    </TouchableOpacity>
);

export const FilterButton = (props) => (
    <TouchableOpacity>
        <FontAwesome name='filter' size={32} />
    </TouchableOpacity>
);