import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import TopOfProfileView from '../components/ProfileEdit/TopOfProfileView'
import { Divider } from 'react-native-elements/dist/divider/Divider'
import Biography from '../components/ProfileEdit/Biography'
import Feather from 'react-native-vector-icons/Feather'
import Foundation from 'react-native-vector-icons/Foundation'
import { auth, db } from '../firebase'
import { collection, collectionGroup, doc, getDoc, getDocs } from 'firebase/firestore'

export default function ViewUserProfile({navigation, route}) {
    const [UserBeingViewedProfileInformation, setUserBeingViewedProfileInformation] = useState({username: null, email: null, profile_picture: null, biography: null})
    const [receiverId, setReceiverId] = useState(null)
    const [chatID, setChatID] = useState(null)
    
    useEffect(
        () => {
            const getUserBeingViewedProfileInformation = async () => {
                const eventsQuery = collectionGroup(db, "posts")
                const events = await getDocs(eventsQuery)
        
                const eventRef = events.docs.find(doc => doc.id === route.params.selectedEvent)
                const eventHosterUID = eventRef.data().owner_uid
                const eventHosterProfileInformationRef = doc(db, 'users/' + eventHosterUID +  "/profile/profile")
                const eventHosterProfileInformation = await getDoc(eventHosterProfileInformationRef)
                
                
                setUserBeingViewedProfileInformation({username: eventHosterProfileInformation.data().username, email: eventHosterProfileInformation.data().email , profile_picture: eventHosterProfileInformation.data().profile_picture, biography: eventHosterProfileInformation.data().biography})
                
                const eventHosterReceiverIdRef = doc(db, 'users/' + eventHosterUID)
                const eventHosterReceiverId = await getDoc(eventHosterReceiverIdRef)
                setReceiverId(eventHosterReceiverId.data().owner_uid)

                let chatCollectionRef = collection(db, "users/" + auth.currentUser.uid +  "/chats")
                const chatDocs = await getDocs(chatCollectionRef)
                if (chatDocs.size > 0) {
                    console.log("testing")
                    chatDocs.forEach((doc) => {
                        if (doc.data().receiver_id === receiverId) {
                            setChatID(doc.id)
                        }
                    })}
            }
            getUserBeingViewedProfileInformation()
            
            
        },[db, receiverId]
    )
    
    
  return (
    <SafeAreaView>
        <UserBeingViewedTopOfProfile navigation={navigation} receiverId={receiverId} UserBeingViewedProfileInformation={UserBeingViewedProfileInformation} chatID={chatID}/>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Feather name='x' size={24}/>
        </TouchableOpacity>
        <Divider width={1} />
        <ScrollView>
          <UserBeingViewedBio biography={UserBeingViewedProfileInformation.biography} />
          <UserBeingViewedEvents />
        </ScrollView>
    </SafeAreaView>
  )
}

const UserBeingViewedBio = ({biography}) => (
    <View style={{padding: 20}}>
        <Text style={{fontSize: 23, fontWeight: '500'}}>Biography</Text>

        <Text style={{marginTop: 20, fontSize: 19}}>{biography}</Text>
    </View>
    
    
)

const UserBeingViewedEvents = (props) => (
    <Text>test</Text>
)

const UserBeingViewedTopOfProfile = ({navigation, UserBeingViewedProfileInformation, receiverId, chatID}) => (
    <View style={{flexDirection: 'row', padding: 30, justifyContent: 'space-between'}}>
      <UserBeingViewedProfilePicture profilePicture={UserBeingViewedProfileInformation.profile_picture} />
      <View style={{marginRight: 30, justifyContent: 'center'}}>
        <UserBeingViewedProfileName username={UserBeingViewedProfileInformation.username}/>
        <MessageButton navigation={navigation} chatID={chatID} receiverEmail={UserBeingViewedProfileInformation.email} receiverId={receiverId} userBeingViewedProfileInformation={UserBeingViewedProfileInformation} username={UserBeingViewedProfileInformation.username} chatName={UserBeingViewedProfileInformation.username} chatProfilePicture={UserBeingViewedProfileInformation.profile_picture} />
      </View>
    </View>
)

const UserBeingViewedProfilePicture = ({profilePicture}) => (
    <Image
        source={{
            uri: profilePicture
        }} 
        style={{width:75, height:75, borderRadius:37.5}}
    />
)

const UserBeingViewedProfileName = ({username}) => (
    <Text style={{fontSize: 20, fontWeight: '700', textAlign: 'center'}}>{username}</Text>
)

const MessageButton = ({navigation, receiverId, username, chatID, userBeingViewedProfileInformation, receiverEmail, chatProfilePicture, chatName}) => (
    <TouchableOpacity 
      style={{flexDirection: 'row', justifyContent: 'space-evenly', borderWidth: 1.5 ,width: 140, height: 30,  marginTop: 15, borderRadius: 10}}
      onPress={() => navigation.navigate('Chat', {
        receiverEmail,
        id: chatID,
        chatProfilePictures: chatProfilePicture,
        chatName: chatName,
        receiverId: receiverId,
        userBeingViewedProfileInformation: userBeingViewedProfileInformation
      })
      }
    >
        <Text style={{textAlign: 'center', fontWeight: '500', fontSize: 15, marginTop: 4}}>Message</Text>
        <Foundation style={{marginTop: 4}}name='comment' size={20} />
    </TouchableOpacity>
)