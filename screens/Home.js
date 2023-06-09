import { View, Text, SafeAreaView, ScrollView, Image } from 'react-native'
import React, { useState } from 'react'
import TopFilters from '../components/home/TopFilters'
import Categories from '../components/home/Categories';
import EventCards from '../components/home/EventCards';
import TypeOfEvents from '../components/home/TypeOfEvents';
import { Divider } from 'react-native-elements/dist/divider/Divider';
import BottomTabs from '../components/home/BottomTabs';
import ReactNativeModal from 'react-native-modal';
import AntDesign from 'react-native-vector-icons/AntDesign'
// import TopOfEventModal from '../components/EventModal/TopOfEventModal';
import EventModalEventInformation from '../components/EventModal/EventModalEventInformation';
// import EventModalJoinEventButton from '../components/EventModal/EventModalJoinEventButton';




export default function Home({ navigation }) {
  const [shownEventsType, setShownEventsType] = useState('For You')
  const [showEventInformationModal, setShowEventInformationModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  return (
    <SafeAreaView style={{flex:1, backgroundColor: 'white'}}>
        <ReactNativeModal
          transparent={true}
          isVisible={showEventInformationModal} 
          animationType='slide'
          backdropOpacity={0.6}
          style={{margin: 0}}
        >
          <View style={{flex: 1, backgroundColor: 'white', marginTop:'40%'}}>

            <EventModalEventInformation navigation={navigation} setSelectedEvent={setSelectedEvent} setShowEventInformationModal={setShowEventInformationModal} selectedEvent={selectedEvent} />
            
          </View>
        </ReactNativeModal>
        <View>
            <View style={{justifyContent: 'center', alignItems: 'center', marginTop: -20, marginBottom: -40}}>
              <Image
                source={{uri: '/Users/matthewwalter/Desktop/socially/socially/assets/Screen Shot 2023-01-06 at 2.43.29 PM.png'
    
                }}
                style={{height: 100, width: 160, resizeMode: 'contain'}}

              />
            </View>
            
            <Categories setShownEventsType={setShownEventsType} />
            <TypeOfEvents shownEventsType={shownEventsType} />
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
            <EventCards shownEventsType={shownEventsType} setShownEventsType={setShownEventsType} selectedEvent={selectedEvent} setSelectedEvent={setSelectedEvent} setShowEventInformationModal={setShowEventInformationModal}/>
        </ScrollView>
        <Divider width={1} />
        <View style={{backgroundColor: '#fafcff'}}>
          <BottomTabs navigation={navigation}/>
        </View>
        
    </SafeAreaView>
  );
}