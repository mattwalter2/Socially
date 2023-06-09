import { View, Text, StyleSheet, Pressable, ScrollView, TouchableOpacity, Image, TextInput, Button, SafeAreaView } from 'react-native'
import React from 'react'
import { useState } from 'react'
import { useRef } from 'react'
import { useEffect } from 'react'
import { auth, db } from '../../firebase'
import AntDesign from 'react-native-vector-icons/AntDesign'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { addDoc, arrayRemove, arrayUnion, collection, collectionGroup, doc, getDoc, getDocs, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore'

export default function EventInformationEditModal({navigation, setShowEventInformationEditModal, selectedEventCreatedByUser, setSelectedEventCreatedByUser}) {
    const [EventHosterInformation, setEventHosterInformation] = useState({username: null, profilePicture: null})
    const [EventInformation, setEventInformation] = useState({eventtitle: null, description: null, peoplejoined: null, private: null, additionalNotes: null, timeofevent: null, profile_picture: null, username: null})
    const eventPath = useRef(null)
    const [activeTab, setActiveTab] = useState('About')
    const [comments, setComments] = useState([])
    const [comment, setComment] = useState('')
    const [peopleRequestedToJoin, setPeopleRequestedToJoin] = useState([])
    const [peopleJoined, setPeopleJoined] = useState([])

    const sendComment = async (e) => {
      const commentToSend = comment
      setComment('')
      const postsQuery = collectionGroup(db, 'posts')
      const posts = await getDocs(postsQuery)
      const selectedEventDocRef = posts.docs.find(doc => doc.id === selectedEventCreatedByUser)

      const profileRef = doc(db, 'users/' + auth.currentUser.uid + '/profile/profile')
      const profileData = await getDoc(profileRef)
    
      console.log(selectedEventDocRef.ref.path)
      await addDoc(collection(db, selectedEventDocRef.ref.path, '/comments'), {
        comment: commentToSend,
        email: auth.currentUser.email,
        timeStamp: serverTimestamp()
      })
    }
    console.log('people requested to join' + peopleRequestedToJoin)
    console.log('people joined' + peopleJoined)

    const requestedPersonAccepted = async (uid) => {
        console.log('accepting requested person')

        const postsQuery = collectionGroup(db, 'posts')
        const posts = await getDocs(postsQuery)
        const selectedEventInformation = posts.docs.find(doc => doc.id === selectedEventCreatedByUser)
        // Remove person accepted from requested to join array
       
        await updateDoc(selectedEventInformation.ref, {
            peopleRequestedToJoin: arrayRemove(uid)
        })

        // Add person accepted into people joined array
        await updateDoc(selectedEventInformation.ref, {
            peoplejoined: arrayUnion(uid)
        })
        
        setPeopleJoined(oldState => [...oldState, peopleRequestedToJoin.find((person) => person.uid === uid)])
        setPeopleRequestedToJoin(peopleRequestedToJoin.filter((person) => person.uid !== uid ))

    }
    console.log('people requested' ,peopleRequestedToJoin)
    console.log('people joined' , peopleJoined)

    const requestedPersonDenied = async (uid) => {
        const postsQuery = collectionGroup(db, 'posts')
        const posts = await getDocs(postsQuery)
        const selectedEventInformation = posts.docs.find(doc => doc.id === selectedEventCreatedByUser)   

        // Remove person accepted from requested to join array
        let peopleRequestedToJoinList = selectedEventInformation.data().peopleRequestedToJoin
        console.log(peopleRequestedToJoinList)
        let indexOfPersonEmailInRequestedToJoinList = peopleRequestedToJoinList.indexOf(uid);
        peopleRequestedToJoinList = peopleRequestedToJoinList.splice(indexOfPersonEmailInRequestedToJoinList, 1)
        await updateDoc(selectedEventInformation.ref, {
            peopleRequestedToJoin: arrayRemove(uid)
            
        })


        setPeopleRequestedToJoin(peopleRequestedToJoin.filter((person) => person.uid !== uid ))
    }
    console.log(peopleRequestedToJoin)
   
    
    useEffect(
        () => {
            async function getEventInformationData() {
                const postsQuery = collectionGroup(db, 'posts');
                const posts = await getDocs(postsQuery);
                const selectedEventDocRef = posts.docs.find(doc => doc.id === selectedEventCreatedByUser)
                setEventInformation(() => ({
                    eventtitle: selectedEventDocRef.data().eventtitle,
                    description: selectedEventDocRef.data().description,
                    peoplejoined: selectedEventDocRef.data().peoplejoined,
                    private: selectedEventDocRef.data().private,
                    additionalNotes: selectedEventDocRef.data().additionalNotes,
                    timeofevent: selectedEventDocRef.data().timeofevent,
                    profile_picture: selectedEventDocRef.data().profile_picture,
                    username: selectedEventDocRef.data().username
                }))

            }
            async function getProfileInformation() {
                const postsQuery = collectionGroup(db, 'posts');
                const posts = await getDocs(postsQuery);
                const selectedEventDocRef = posts.docs.find(doc => doc.id === selectedEventCreatedByUser)
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
                const selectedEventDocRef = posts.docs.find(doc => doc.id === selectedEventCreatedByUser)
                const commentCollectionRef = collection(db, selectedEventDocRef.ref.path + '/comments')
                
                const q = query(commentCollectionRef, orderBy("timeStamp", "asc"))
                
                onSnapshot(q, (snapshot) => {
                    setComments(snapshot.docs.map((doc) => ({
                        data: doc.data()
                    })))
                })
                
                
               
            }
            getCommentData()
    }, [db])  

    useEffect(
        () => {
            async function getPeopleJoined() {
                const postsQuery = collectionGroup(db, 'posts')
                const posts = await getDocs(postsQuery)
                const selectedEventInformation = posts.docs.find(doc => doc.id === selectedEventCreatedByUser)
                
                // Sets peopled joinded emails
                console.log(selectedEventInformation.data().peoplejoined)
                // Get each person joined profile information
                async function getPeopleJoinedProfiles() {
                    for (const uid of selectedEventInformation.data().peoplejoined) {
                        console.log('users/' + uid + '/profile/profile')
                        const profileDocRef = doc(db, 'users/' + uid + '/profile/profile')
                        
                        onSnapshot(profileDocRef, (snapshot) => {
                            setPeopleJoined(oldState => [...oldState, {username: snapshot.data().username, uid: snapshot.data().uid, email: snapshot.data().email, profilePicture: snapshot.data().profile_picture} ])
                        })
                        
                    }
                }

                // async function getPeopleRequestedToJoinProfiles() {
                //     for (const uid of selectedEventInformation.data().peopleRequestedToJoin) {
                //         const profileDocRef = doc(db, 'users/' + uid + '/profile/profile')
                //         onSnapshot(profileDocRef, (snapshot) => {
                //             setPeopleRequestedToJoin(oldState => [...oldState, {username: snapshot.data().username, uid: snapshot.data().uid, email: snapshot.data().email, profilePicture: snapshot.data().profile_picture} ])
                //         })
                        
                //     }    
                // }
                getPeopleJoinedProfiles()
                // getPeopleRequestedToJoinProfiles()
            }
            
            getPeopleJoined()
    }, [db])  

async function getPeopleRequestedToJoinProfiles()  {
    const postsQuery = collectionGroup(db, 'posts')
    const posts = await getDocs(postsQuery)
    const selectedEventInformation = posts.docs.find(doc => doc.id === selectedEventCreatedByUser)
    for (const uid of selectedEventInformation.data().peopleRequestedToJoin) {
        
        const profileDocRef = doc(db, 'users/' + uid + '/profile/profile')
        getDoc(profileDocRef).then((doc) => {
            setPeopleRequestedToJoin(oldState => [...oldState, {username: doc.data().username, uid: doc.data().uid, email: doc.data().email, profilePicture: doc.data().profile_picture} ])
    })


    }
}

useEffect( () => {
    getPeopleRequestedToJoinProfiles()

}

,[])


  return (
    <SafeAreaView style={{flex: 1, margin: 10}}> 
      <View style={styles.topview}>
        <TouchableOpacity onPress={() => {setShowEventInformationEditModal(false), navigation.navigate('EditEvent', {selectedEventCreatedByUser: selectedEventCreatedByUser})}}>
            <View style={{alignItems: 'center'}}>
                <FontAwesome name='gear' size={24} style={{}} />
                <Text style={{fontSize: 10, fontWeight: '600'}}>Edit Event</Text>
            </View> 
        </TouchableOpacity>
        <View style={styles.topbuttons}>
          <HeaderButton text='Comments' btnColor='white' txtColor='black' activeTab={activeTab} setActiveTab={setActiveTab} />
          <HeaderButton text='About' btnColor='pink' txtColor='white' activeTab={activeTab} setActiveTab={setActiveTab} />
          <HeaderButton text='People' btnColor='white' txtColor='black' activeTab={activeTab} setActiveTab={setActiveTab} />
        </View>
      
        <AntDesign name='close' size={24} onPress={() => {setShowEventInformationEditModal(false), setSelectedEventCreatedByUser(null)}} />
        
      </View>
      {activeTab === 'Comments' && (
            <>
                <ScrollView>
                <>
                    {comments.length > 0 && (
                        <View>
                            {comments.map(({data}) => (
                                <View key={comment.id} style={styles.commentview}>
                                        <Image
                                            source={{
                                                uri: comment.profile_picture
                                            }} 
                                            style={{width:45, height:45, borderRadius: 22.5}}
                                        />
                                    <View style={{marginLeft: 15}}>
                                        <Text style={{color: 'gray', fontWeight: '600', fontSize: 13}}>{comment.username}</Text>
                                        <Text style={{fontSize: 14}}>{data.comment}</Text>
                                    </View>

                                </View>
                            ))}
                        </View>
                    )}
                </>
                <TextInput
                    value={comment}
                    onChangeText={(e) => setComment(e)}
                />
                <Button title='send comment' onPress={sendComment} />
                </ScrollView>
            </>
        )}

        {activeTab === 'About' && (
            <ScrollView>
                <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
                    <Pressable onPress={() => {navigation.navigate("ViewUserProfile", {selectedEvent: selectedEventCreatedByUser}), setShowEventInformationEditModal(false)}}>
                        <ProfilePicture profilePicture={EventHosterInformation.profilePicture} />
                    </Pressable>
                    
                    <ProfileName username={EventHosterInformation.username} />
                </View>
                <View style={{alignItems: 'flex-start', justifyContent: 'flex-start'}}>
                  <EventTitle eventtitle={EventInformation.eventtitle}/>
                  <Text style={{color: 'gray', fontSize: 17, marginBottom: -10}}>{EventInformation.timeofevent}</Text>
                  <Text style={{color: 'gray', fontSize: 17}}>123 Main Street</Text>
                </View>
                    <Text style={styles.subTitles}>Description</Text>
                    <EventDescription description={EventInformation.description}/>
                <View>
                    <Text style={styles.subTitles}>Additional Notes</Text>
                    <Text style={styles.eventdescription}>{EventInformation.additionalNotes}</Text>
                </View>
                
            </ScrollView>
        )}

        {activeTab === 'People' && (
            <>
                <ScrollView>
                    <>
                        {peopleRequestedToJoin.length > 0 && (
                            <View>
                            {peopleRequestedToJoin.map(person => (
                                <View key={peopleRequestedToJoin.indexOf(person)} style={styles.commentview}>
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <Image
                                            source={{
                                                uri: person.profilePicture
                                            }} 
                                            style={{width:45, height:45, borderRadius: 22.5}}
                                        />
                                    
                                        <Text style={{color: 'gray', fontWeight: '600', fontSize: 13, marginLeft: 15}}>{person.username}</Text>
                                        
                                    </View>
                                    <View style={{display: 'flex', flexDirection: 'row', marginLeft: 15}}>
                                        <TouchableOpacity 
                                            onPress={() => requestedPersonAccepted(person.uid)}
                                            style={{backgroundColor: 'white', paddingVertical: 7,
                                            paddingHorizontal: 7, borderColor: 'pink', borderWidth: 1,
                                            margin: 3, borderRadius: 8}} >
                                                <Text style={{color: 'pink', fontWeight: '700'}}>Accept</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity 
                                            onPress={() => requestedPersonDenied(person.uid)}
                                            style={{backgroundColor: 'white', paddingVertical: 7,
                                            paddingHorizontal: 7, borderColor: 'pink', borderWidth: 1,
                                            margin: 3, borderRadius: 8}} >
                                                <Text style={{color: 'pink', fontWeight: '700'}}>Deny</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                ))}
                            </View>
                        )}
                        {peopleJoined.length > 0 && (
                            <View>
                                {peopleJoined.map(person => (
                                    <View key={peopleJoined.indexOf(person)} style={styles.commentview}>
                                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                            <Image
                                                source={{
                                                    uri: person.profilePicture
                                                }} 
                                                style={{width:45, height:45, borderRadius: 22.5}}
                                            />
                                        
                                            <Text style={{color: 'gray', fontWeight: '600', fontSize: 13, marginLeft: 15}}>{person.username}</Text>
                                            
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
            backgroundColor: props.activeTab === props.text ? 'pink': 'white',
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
       alignItems: 'center',
       justifyContent: 'space-between',
       marginBottom: 15
    },
    topbuttons: {
        flexDirection: 'row',
        alignItems: 'center',
        
    },
    commentview: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
  
    },
    joineventbutton: {
        backgroundColor: 'pink',
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
      backgroundColor: 'pink',
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
  }
  })