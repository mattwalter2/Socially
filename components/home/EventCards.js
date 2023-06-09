import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collectionGroup, doc, getDoc, getDocs, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '../../firebase'

export default function EventCards( { setShowEventInformationModal, setSelectedEvent, shownEventsType}) {
    const [eventCards, setEventCards] = useState([])
    let q
    if (shownEventsType === 'For You') {
        q = query(collectionGroup(db, 'posts'))
    } else {
        q = query(collectionGroup(db, 'posts'), where('category', '==', shownEventsType))
    }
    useEffect(
        () => 
            
            onSnapshot(q, async(snapshot) => {
                console.log(snapshot.docs)
                
                setEventCards(snapshot.docs)
            }

        ), 
        [db, shownEventsType]
    )

  return (
    <>
        {eventCards.map((event, index) => (
            <View>

                <TouchableOpacity key={event.id} onPress={() => { setShowEventInformationModal(true), setSelectedEvent(event.id)}} style={{backgroundColor: '#FEACC6', marginLeft:15,marginRight:15, height:145, borderRadius:25, marginBottom:15}}>
                    <View>
                        <EventTitle title={event.data().eventtitle} />

                        
                        
                        <EventInformation time={event.data().timeofevent} peoplejoined={event.data().peoplejoined} />
                    </View>
                </TouchableOpacity>
                
            </View>
        ))}
    </>

  )
}

export const EventTitle = (props) => (
    <Text style={{color:'white', fontSize:21, fontWeight:'700', marginLeft:15, marginBottom: 10, margin:25}}>{props.title}</Text>
)

export const EventInformation = (props) => (
    <View style={{flexDirection:'column', marginLeft:15, marginRight:25, justifyContent:'space-between', alignItems:'left'}}>
        <Text style={{color:'white', fontWeight:'700', marginLeft:0, fontSize: 11}}>{props.time}</Text>
        <View style={{marginTop: 7}}>
            <AvatarList uids ={props.peoplejoined} />
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
        
        for (const uid of uids) {
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