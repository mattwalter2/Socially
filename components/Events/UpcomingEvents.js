import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, doc, getDoc, onSnapshot } from 'firebase/firestore'
import { auth, db } from '../../firebase'

export default function UpcomingEvents({selectedEventToShowInformationFor, setSelectedEventToShowInformationFor, setShowSelectedEventToShowInformationFor}) {
    const [upcomingEvents, setUpcomingEvents] = useState([])

    useEffect(
        () => 
            onSnapshot(collection(db, 'users/' + auth.currentUser.uid + '/joinedEvents'), (snapshot) => {
                setUpcomingEvents(snapshot.docs)
            }
        ), 
        [db]
    )
  return (
    <ScrollView showsVerticalScrollIndicator={false} >
        {upcomingEvents.map((event) => (
            <TouchableOpacity onPress={() => {setShowSelectedEventToShowInformationFor(true), setSelectedEventToShowInformationFor(event.id)}} key={event.id} style={{backgroundColor: '#FEACC6', marginLeft:15,marginRight:15, height:145, borderRadius:25, marginBottom:15}}>
                <View>
                    <EventTitle title={event.data().eventtitle} />
                    <EventInformation time={event.data().timeofevent} people={event.data().peoplesignedup} />
                </View>
                
            </TouchableOpacity>
        ))}
    </ScrollView>
  )
}

export const EventTitle = (props) => (
    <Text style={{color:'white', fontSize:26, fontWeight:'700', marginLeft:15, marginBottom: 10, margin:25}}>{props.title}</Text>
)

export const EventInformation = (props) => (
    <View style={{flexDirection:'row', marginLeft:15, marginRight:25, justifyContent:'space-between', alignItems:'center'}}>
        <Text style={{color:'white', fontWeight:'700', marginLeft:0}}>{props.time}</Text>
        <View style={{marginTop: 7}}>
            <AvatarList uids={props.peoplejoined} />
        </View>
    </View>
    
)

export const AvatarList = ({uids}) => {
    const [profileImages, setProfileImages] = useState([])
    const getPersonSignedUpProfilePicture = async(uid) => {
    const individualProfileRef = doc(db, "users/" + uid + "/profile/profile")
    const individualProfile = await getDoc(individualProfileRef)
    const profilePicture = individualProfile.data().profile_picture
    return profilePicture
    }
    useEffect(() => {
        const requests = []
        for (const uid of [uids]) {
            requests.push(getPersonSignedUpProfilePicture(uid))
        }
        // uids.forEach((uid) => {
        //     requests.push(getPersonSignedUpProfilePicture(uid))
        // })
        Promise.all(requests).then((values)=> {
            
            setProfileImages(values)
        })
    }, [uids])
    const images = profileImages.slice(0, 5)
    const remaining = profileImages.length - images.length
    return (

        <View
            style={{flexDirection: 'row', alignItems: 'center'}}
        >
            {
                images.map(profileImage => {
                    return <Image 
                        key={profileImage}
                        source={{
                            uri: profileImage
                        }} 
                        style={{width:35, height: 35, borderRadius: 17.5, marginRight: -15}}
                    />

                    
                    
                })
            }
            {remaining > 0 &&<Text style={{marginLeft: 30}}>+{remaining}</Text>}
        </View>
    )
}