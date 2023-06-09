import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, TextInput, Button, Pressable, SafeAreaView } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { addDoc, collection, collectionGroup, doc, getDoc, getDocs, onSnapshot, orderBy, query, serverTimestamp, snapshotEqual, where, updateDoc, arrayUnion, setDoc } from 'firebase/firestore'
import { auth, db } from '../../firebase'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'

export default function EventModalEventInformation( {navigation, setShowEventInformationModal, setSelectedEvent, selectedEvent}) {
    const [EventHosterInformation, setEventHosterInformation] = useState({username: null, profilePicture: null})
    const [EventInformation, setEventInformation] = useState({eventtitle: null, description: null, peoplejoined: null, private: null, timeofevent: null, address: null, additionalNotes: null, profile_picture: null, username: null})
    const eventPath = useRef(null)
    const [activeTab, setActiveTab] = useState('About')
    const [comments, setComments] = useState([])
    const [comment, setComment] = useState('')
    const [eventJoinedByUser, setEventJoinedByUser] = useState('no')
    const [peopleJoined, setPeopleJoined] = useState([])
    const [peopleRequestedToJoin, setPeopleRequestedToJoin] = useState([])


    const addEventToUsersUpcomingEvents = async (document) => {
    
        const docRef = doc(db, 'users/' + auth.currentUser.uid + '/joinedEvents', selectedEvent)
        await setDoc(docRef, {
            eventtitle: document.data().eventtitle,
            description: document.data().description,
            private: document.data().private,
            peoplejoined: document.data().peoplejoined,
            timeofevent: document.data().timeofevent
        })
    }

    const addUserToEventChat = async () => {
        const postsQuery = collectionGroup(db, 'chats')
        const querySnapshot = await getDocs(postsQuery)
        const chatDoc = querySnapshot.docs.find(doc => doc.id === selectedEvent)
        await updateDoc(chatDoc.ref, {
            receiver_id: arrayUnion(auth.currentUser.uid)
        })
    }

    const updatePublicEvent = async (doc) => {
       
        await updateDoc(doc.ref, {
            peoplejoined: arrayUnion(auth.currentUser.uid)
        })
        setEventJoinedByUser('yes')

        // Adding event to users upcoming events list
        addEventToUsersUpcomingEvents(doc)

        // Add user to event group chat
        addUserToEventChat()


    }

    const updatePrivateEvent = async (doc) => {
        
        await updateDoc(doc.ref, {
            peopleRequestedToJoin: arrayUnion(auth.currentUser.uid)
        })
        setEventJoinedByUser('requested')
    }

    
    const handleJoinEvent = async () => {
        try { 
            
            const posts = collectionGroup(db, 'posts')
            const querySnapshot = await getDocs(posts)
            const selectedEventDocRef = querySnapshot.docs.find(doc => doc.id === selectedEvent)

            // Check to see if event is public or private
            if (EventInformation.private === true) {
                
                updatePrivateEvent(selectedEventDocRef)
            } else {
                
                updatePublicEvent(selectedEventDocRef)
                
            }
 
        } catch {
            console.log('event not added')
        }
    }

    const sendComment = async (e) => {
      const commentToSend = comment
      setComment('')
      const postsQuery = collectionGroup(db, 'posts')
      const posts = await getDocs(postsQuery)
      const selectedEventDocRef = posts.docs.find(doc => doc.id === selectedEvent)

      const profileRef = doc(db, 'users/' + auth.currentUser.uid + '/profile/profile')
      const profileData = await getDoc(profileRef)
    
      const commentDoc = await addDoc(collection(db, selectedEventDocRef.ref.path, '/comments'), {
        comment: commentToSend,
        Uid: auth.currentUser.uid,
        email: auth.currentUser.email,
        timeStamp: serverTimestamp()
      })
        const commenterProfileInfoRef = doc(db, 'users', auth.currentUser.uid, 'profile', 'profile')
        const commenterProfileInfo = await getDoc(commenterProfileInfoRef)
        setComments(oldState => [...oldState , {commentId: commentDoc.id, commenterProfilePicture: commenterProfileInfo.data().profile_picture, commenterUsername: commenterProfileInfo.data().username, comment: commentToSend}])

      

      

      
      
    }


    
    useEffect(
        () => {
            async function getEventInformationData() {
                const postsQuery = collectionGroup(db, 'posts');
                const posts = await getDocs(postsQuery);
                const selectedEventDocRef = posts.docs.find(doc => doc.id === selectedEvent)
                setEventInformation(() => ({
                    eventtitle: selectedEventDocRef.data().eventtitle,
                    description: selectedEventDocRef.data().description,
                    peoplejoined: selectedEventDocRef.data().peoplejoined,
                    private: selectedEventDocRef.data().private,
                    address: selectedEventDocRef.data().address,
                    additionalNotes: selectedEventDocRef.data().additionalNotes,
                    timeofevent: selectedEventDocRef.data().timeofevent,
                    profile_picture: selectedEventDocRef.data().profile_picture,
                    username: selectedEventDocRef.data().username
                }))

            }
            async function getProfileInformation() {
                const postsQuery = collectionGroup(db, 'posts');
                const posts = await getDocs(postsQuery);
                const selectedEventDocRef = posts.docs.find(doc => doc.id === selectedEvent)
                const eventHosterUID = selectedEventDocRef.data().owner_uid
                const usersQuery = collectionGroup(db, 'users')
                const users = await getDocs(usersQuery)
                const selectedUserDocRef = users.docs.find(doc => doc.data().owner_uid === eventHosterUID)
                const eventHosterProfileInformationDocRef = doc(db, selectedUserDocRef.ref.path + '/profile/profile')
                const eventHosterProfileInformation = await getDoc(eventHosterProfileInformationDocRef)
               
                setEventHosterInformation(() => ({
                    username: eventHosterProfileInformation.data().username,
                    profilePicture: eventHosterProfileInformation.data().profile_picture
                }))
            }

            getEventInformationData()
            getProfileInformation()
            
    }, [db])
    useEffect(
        () => {
            async function getCommentData() {
                const postsQuery = collectionGroup(db, 'posts')
                const posts = await getDocs(postsQuery)
                const selectedEventDocRef = posts.docs.find(doc => doc.id === selectedEvent)
                const commentCollectionRef = collection(db, selectedEventDocRef.ref.path + '/comments')
                
                const q = query(commentCollectionRef, orderBy("timeStamp", "asc"))
                
                const eventComments = await getDocs(q)
                for (const comment of eventComments.docs) {
                    console.log(comment.data())
                   const commentId = comment.id
                    const commentMessage = comment.data().comment
                    const commenterUid = comment.data().Uid
                    const commenterProfileInfoRef = doc(db, 'users', commenterUid, 'profile', 'profile')
                    const commenterProfileInfo = await getDoc(commenterProfileInfoRef)
                    setComments(oldState => [...oldState , {commentId: commentId, commenterProfilePicture: commenterProfileInfo.data().profile_picture, commenterUsername: commenterProfileInfo.data().username, comment: commentMessage}])
                }
               
            }
            getCommentData()
            
    }, [db])  

    useEffect(
        () => {
            async function getPeopleJoined() {
                const postsQuery = collectionGroup(db, 'posts')
                const posts = await getDocs(postsQuery)
                const selectedEventInformation = posts.docs.find(doc => doc.id === selectedEvent)
                
                // Sets peopled joinded emails
                // Get each person joined profile information
                async function getPeopleJoinedProfiles() {
                    for (const uid of selectedEventInformation.data().peoplejoined) {
                        const profileDocRef = doc(db, 'users/' + uid + '/profile/profile')
                        
                        onSnapshot(profileDocRef, (snapshot) => {
                            setPeopleJoined(oldState => [...oldState, {username: snapshot.data().username, profilePicture: snapshot.data().profile_picture, uid: snapshot.data().uid} ])
                        })
                        
                    }
                    for (const uid of selectedEventInformation.data().peopleRequestedToJoin) {
                        const profileDocRef = doc(db, 'users/' + uid + '/profile/profile')
                        
                        onSnapshot(profileDocRef, (snapshot) => {
                            setPeopleRequestedToJoin(oldState => [...oldState, {username: snapshot.data().username, profilePicture: snapshot.data().profile_picture, uid: snapshot.data().uid} ])
                        })
                        
                    }

                }
                getPeopleJoinedProfiles()
            }
            getPeopleJoined()


    }, [db])  

    useEffect(
        () => {
            async function checkIfCurrentUserSignedUpForEvent() {
                
                const currentUserSignedUp = peopleJoined.some((person) => person.uid === auth.currentUser.uid)
                if (currentUserSignedUp) {
                    setEventJoinedByUser('yes')
                }
            }
            async function checkIfCurrentUserRequestedForEvent() {
                const currentUserRequested = peopleRequestedToJoin.some((person) => person.uid === auth.currentUser.uid)
                if (currentUserRequested) {
                    setEventJoinedByUser('requested')
                }
            }
            checkIfCurrentUserSignedUpForEvent()
            checkIfCurrentUserRequestedForEvent()
        }, [peopleJoined, peopleRequestedToJoin]
    )

  return (
    <SafeAreaView style={{flex: 1, margin: 10}}> 
      <View style={styles.topview}>
        <View style={styles.topbuttons}>
          <HeaderButton text='Comments' btnColor='white' txtColor='black' activeTab={activeTab} setActiveTab={setActiveTab} />
          <HeaderButton text='About' btnColor='#FEACC6' txtColor='white' activeTab={activeTab} setActiveTab={setActiveTab} />
          <HeaderButton text='People' btnColor='white' txtColor='black' activeTab={activeTab} setActiveTab={setActiveTab} />
        </View>
        <AntDesign name='close' size={24} onPress={() => {setShowEventInformationModal(false), setSelectedEvent(null)}} />
      </View>
      {activeTab === 'Comments' && (
            <>
                <ScrollView showsVerticalScrollIndicator={false}>
                <>
                    {comments.length > 0 && (
                        <View>
                            {comments.map(({commentId, commenterProfilePicture, commenterUsername, comment}) => (
                                <View key={commentId} style={styles.commentview}>
                                    <Image
                                        source={{
                                            uri: commenterProfilePicture
                                        }} 
                                        style={{width:45, height:45, borderRadius: 22.5}}
                                    />
                                    <View style={{marginLeft: 15}}>
                                        <Text style={{color: 'gray', fontWeight: '600', fontSize: 13}}>{commenterUsername}</Text>
                                        <Text style={{fontSize: 14}}>{comment}</Text>
                                    </View>

                                </View>
                            ))}
                        </View>
                    )}
                </>
                
                </ScrollView>
                <View
                    style={{height: 50, flexDirection: 'row', alignItems: 'center'}}

                >
                <View style={{backgroundColor: 'lightgray', borderRadius: 25, height: 40, flex: 1, marginRight: 20, justifyContent: 'center'}}>
                    <TextInput
                    value={comment}
                    onChangeText={(text) => setComment(text)}
                    placeholder="send a message"
                    style={{justifyContent: 'center', marginLeft: 15}}
                    />
                </View>

                    <Pressable onPress={sendComment}>
                        <Ionicons name='send' size={25} />
                    </Pressable>
                </View>
            </>
        )}

        {activeTab === 'About' && (
            <ScrollView >
                <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
                    <Pressable onPress={() => {navigation.navigate("ViewUserProfile", {selectedEvent: selectedEvent}), setShowEventInformationModal(false)}}>
                        <ProfilePicture profilePicture={EventHosterInformation.profilePicture} />
                    </Pressable>
                    
                    <ProfileName username={EventHosterInformation.username} />
                </View>
                <View style={{alignItems: 'flex-start', justifyContent: 'flex-start', marginBottom: 15}}>
                  <EventTitle eventtitle={EventInformation.eventtitle}/>
                  <Text style={{color: 'gray', fontSize: 17, marginBottom: -10}}>{EventInformation.timeofevent}</Text>
                  {!EventInformation.private  && 
                    <Text style={{color: 'gray', fontSize: 17}}>
                        {EventInformation.address}
                    </Text>
                    }
                </View>
                
                    <Text style={styles.subTitles}>Description</Text>
                    <EventDescription description={EventInformation.description}/>
                
                <View>
                    {!EventInformation.private && 
                        <>
                            <Text style={styles.subTitles}>Additional Notes</Text>
                            <Text style={styles.eventdescription}>{EventInformation.additionalNotes}</Text>
                        </>
                    }
                </View> 
                <TouchableOpacity 
                    onPress={() => handleJoinEvent()}
                >
                <View
                    style={(eventJoinedByUser === 'requested' || eventJoinedByUser === 'yes') ? styles.joinEventButtonUserJoined : styles.joineventbutton}
                >
                    <Text style={(eventJoinedByUser === 'requested' || eventJoinedByUser === 'yes') ? styles.joinEventButtonUserJoinedText: styles.joineventbuttontext}>{(eventJoinedByUser === 'no') ? 'Join Event' : (eventJoinedByUser === 'requested') ? 'Requested to Join Event' : 'Event Joined' }</Text>
                </View>
            </TouchableOpacity>
            </ScrollView>
        )}

        {activeTab === 'People' && (
            <>
                <ScrollView>
                    <>
                        {peopleJoined.length > 0 && (
                            <View>
                                {peopleJoined.map(person => (
                                    <View key={peopleJoined.indexOf(person)} style={{flexDirection: 'row' ,justifyContent: 'flex-start', alignItems: 'center', padding: 10}}>
                                            <Image
                                                source={{
                                                    uri: person.profilePicture
                                                }} 
                                                style={{width:45, height:45, borderRadius: 22.5}}
                                            />
                                        <View style={{marginLeft: 15}}>
                                        <Text style={{color: 'gray', fontWeight: '600', fontSize: 13}}>{person.username}</Text>
                                        </View>

                                    </View>
                                ))}
                            </View>
                        )}
                    </>
                </ScrollView> 
            </>
        )}
    </SafeAreaView>
  )
}

const HeaderButton = (props) => (
    <TouchableOpacity 
        style={{
            backgroundColor: props.activeTab === props.text ? '#FEACC6': 'white',
            paddingVertical: 7,
            paddingHorizontal: 7,
            margin: 3,
            borderRadius: 8}}
        onPress={() => props.setActiveTab(props.text)}
    >
        <Text style={{color: props.activeTab === props.text ? 'white': 'black', fontWeight: '700'}}>{props.text}</Text>
    </TouchableOpacity>
)


export const ProfilePicture = ({profilePicture}) => (
    <Image
        source={{
            uri: profilePicture
        }} 
        style={{width:75, height:75, borderRadius:37.5}}
    />
)

export const ProfileName = ({username}) => (
    <Text style={{marginLeft: 20, fontSize: 20, fontWeight: '700', textAlign: 'center'}}>{username}</Text>
)

export const EventTitle = (props) => (
    <Text style={styles.eventtitle}>{props.eventtitle}</Text>
)
export const EventDescription = (props) => (
    <Text style={styles.eventdescription}>{props.description}</Text>
)

const styles = StyleSheet.create({
    eventtitle: {
        fontSize: 25,
        fontWeight: '700',
        textAlign: 'left',
        marginVertical: 15,
        paddingLeft: 30
    },
    subTitles: {
        fontSize: 20,
        fontWeight: '700',
        textAlign: 'left',
        marginVertical: 15,
    },
    eventtitle: {
        fontSize: 25,
        fontWeight: '700',
        textAlign: 'left',
        marginVertical: 15,
    },
    eventdescription: {
        fontSize: 21,
    },
    topview: {
        flexDirection: 'row',
        padding: 15,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    topbuttons: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 40
        
    },
    commentview: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
  
    },
    joineventbutton: {
        backgroundColor: '#FEACC6',
        marginHorizontal: 15,
        height: 75,
        borderRadius: 25,
        marginVertical: 15,
        alignItems: 'center',
        justifyContent: 'center'
    },
    joineventbuttontext: {
        color: 'white',
        fontWeight: '700',
        fontSize: 26
    },
    joineventbutton: {
      backgroundColor: '#FEACC6',
      marginHorizontal: 15,
      height: 75,
      borderRadius: 25,
      marginVertical: 15,
      alignItems: 'center',
      justifyContent: 'center'
  },
  joineventbuttontext: {
    color: 'white',
    fontWeight: '700',
    fontSize: 26
  },
  joinEventButtonUserJoined: {
    backgroundColor: 'white',
    marginHorizontal: 15,
    borderColor: '#FEACC6',
    borderWidth: 2,
    height: 75,
    borderRadius: 25,
    marginVertical: 15,
    alignItems: 'center',
    justifyContent: 'center'
  },
  joinEventButtonUserJoinedText: {
    color: '#FEACC6',
    fontWeight: '700',
    fontSize: 26
  }

  })
