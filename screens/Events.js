import { View, Text, StyleSheet, SafeAreaView } from 'react-native'
import React, { useState } from 'react'
import UpcomingEvents from '../components/Events/UpcomingEvents'
import AntDesign from 'react-native-vector-icons/AntDesign'
import ReactNativeModal from 'react-native-modal'
import EventUpcomingEventInformationModal from '../components/Events/EventUpcomingEventInformationModal'

export default function Events( {navigation}) {
    const [showSelectedEventToShowInformationFor, setShowSelectedEventToShowInformationFor] = useState(false)
    const [selectedEventToShowInformationFor, setSelectedEventToShowInformationFor] = useState(null)
  return (
    <SafeAreaView style={{flex: 1}}>
        <ReactNativeModal
          transparent={true}
          isVisible={showSelectedEventToShowInformationFor} 
          animationType='slide'
          backdropOpacity={0.6}
          style={{margin: 0}}
        >
          <View style={{flex: 1, backgroundColor: 'white', marginTop:'40%'}}>
            <EventUpcomingEventInformationModal navigation={navigation} selectedEventToShowInformationFor={selectedEventToShowInformationFor} setSelectedEventToShowInformationFor={setSelectedEventToShowInformationFor} setShowSelectedEventToShowInformationFor={setShowSelectedEventToShowInformationFor} />
          </View>
      </ReactNativeModal>
        <View style={styles.topview}>
            <Text style={styles.mainheader}>Events</Text>
            <AntDesign style={{padding: 30}} name='close' size={24} onPress={() => navigation.navigate('Home')} />
        </View>
        <Text style={styles.upcomingeventsheader}>Upcoming Events</Text>
        <UpcomingEvents selectedEventToShowInformationFor={selectedEventToShowInformationFor} setSelectedEventToShowInformationFor={setSelectedEventToShowInformationFor} setShowSelectedEventToShowInformationFor={setShowSelectedEventToShowInformationFor} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    topview: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    mainheader: {
        fontSize: 35,
        fontWeight: '600',
        padding: 20,
        marginTop: 10
    },
    upcomingeventsheader: {
        fontSize: 18,
        paddingHorizontal: 20,
        marginBottom: 25,
        fontWeight: '500'
    }
})
