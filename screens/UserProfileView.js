import { View, Text, SafeAreaView, TouchableOpacity, Button, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Divider } from 'react-native-elements/dist/divider/Divider';
import Biography from '../components/ProfileEdit/Biography';
import TopofProfileView from '../components/ProfileEdit/TopOfProfileView'
import CurrentUsersEvents from '../components/ProfileEdit/CurrentUsersEvents';
import Feather from 'react-native-vector-icons/Feather'
import Ionicons from 'react-native-vector-icons/Ionicons'
import ReactNativeModal from 'react-native-modal'
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase';
import EventInformationEditModal from '../components/UserProfile/EventInformationEditModal';

export default function UserProfileView( { navigation } ) {
  const [showEventInformationEditModal, setShowEventInformationEditModal] = useState(false)
  const [selectedEventCreatedByUser, setSelectedEventCreatedByUser] = useState(null)

  const docRef = doc(db, 'users/' + auth.currentUser.uid + '/profile/profile')
  const [profileInformation, setProfileInformation] = useState(getDoc(docRef))


  useEffect(
    () => 
        onSnapshot(docRef, (doc) => {
            setProfileInformation(doc.data())
        }
    ), 
    [db]
  )

  return (
    <SafeAreaView style={{flex: 1, margin: 20}}>
      <ReactNativeModal
          transparent={true}
          isVisible={showEventInformationEditModal} 
          animationType='slide'
          backdropOpacity={0.6}
          style={{margin: 0}}
        >
          <View style={{flex: 1, backgroundColor: 'white', marginTop:'40%'}}>

            <EventInformationEditModal navigation={navigation} setSelectedEventCreatedByUser={setSelectedEventCreatedByUser} setShowEventInformationEditModal={setShowEventInformationEditModal} selectedEventCreatedByUser={selectedEventCreatedByUser} />
            
          </View>
      </ReactNativeModal>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Ionicons name='exit' color='black' size={30} onPress={() => auth.signOut()}/>
          <Feather name='x' size={30} onPress={() => navigation.navigate('Home')}/>
          
        </View>
        <TopofProfileView profileInformation={profileInformation} navigation={navigation} />
        <Divider width={1} />
        <ScrollView>
          <Biography biography={profileInformation.biography} />
          <CurrentUsersEvents selectedEventCreatedByUser={selectedEventCreatedByUser} setSelectedEventCreatedByUser={setSelectedEventCreatedByUser} setShowEventInformationEditModal={setShowEventInformationEditModal}/>
        </ScrollView>
        

    </SafeAreaView>
  )
}