import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { auth, db } from '../../firebase'

export default function CurrentUsersEvents({setShowEventInformationEditModal, setSelectedEventCreatedByUser}) {
    const [currentUsersEvents, setCurrentUsersEvents] = useState([])

    useEffect(
        () => 
            onSnapshot(collection(db, 'users/' + auth.currentUser.uid + '/posts'), (snapshot) => {
                setCurrentUsersEvents(snapshot.docs)
            }
        ), 
        [db]
    )
    
  return (
    <View>
      <Text style={styles.myEventsHeading}>My Events</Text>
        <>
            {currentUsersEvents.map((event) => (
                <TouchableOpacity onPress={() => { setShowEventInformationEditModal(true), setSelectedEventCreatedByUser(event.id)}} key={event.id} style={{backgroundColor:'#FEACC6', height:145, borderRadius:25, marginBottom:15}}>
                    <View>
                        <EventTitle title={event.data().eventtitle} />
                        <EventInformation time={event.data().timeofevent} people={event.data().peoplesignedup} />
                    </View>
                    
                </TouchableOpacity>
            ))}
        </>
    </View>
  )
}

const EventTitle = (props) => (
    <Text style={{color:'white', fontSize:26, fontWeight:'700', marginLeft:15, marginBottom: 10, margin:25}}>{props.title}</Text>
)

const EventInformation = (props) => (
    <View style={{flexDirection:'row', marginLeft:15, marginRight:25, justifyContent:'space-between', alignItems:'center'}}>
        <Text style={{color:'white', fontWeight:'700', marginLeft:0}}>{props.time}</Text>
    </View>
    
)



const styles = StyleSheet.create({
    usersEventsContainer: {
        
    },
    myEventsHeading: {
        fontSize: 23,
        
        marginBottom: 25,
        fontWeight: '500'
    }
})