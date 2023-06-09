import { View, Text, SafeAreaView, ScrollView, TextInput, Pressable, KeyboardAvoidingView, StyleSheet, Image } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { auth, db } from '../firebase';
import { addDoc, collection, serverTimestamp, onSnapshot, doc, query, orderBy, where, collectionGroup, getDocs, documentId, getDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { Divider } from 'react-native-elements';

export default function Chat({ navigation, route }) {
  // const [receiverProfileInformation, setReceiverProfileInformation] = useState()
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [chatID, setchatID] = useState(route.params.id)
  console.log("Chat.js")

  const sendMessage = async () => {
    console.log('sending message')

    // If there is chatID, the chat has been created already 
    // but if there isn't a new chat has to be created
    if (route.params.id != null) {

      const chatsQuery = collectionGroup(db, "chats")
      const chats = await getDocs(chatsQuery)

      const chatRef = chats.docs.find(doc => doc.id === route.params.id)
      const chatCollectionRef = collection(db, chatRef.ref.path + "/messages")

      addDoc(chatCollectionRef, {
        timeStamp: serverTimestamp(),
        message: input,
        displayName: 'this is the display name',
        profilePicture: "this is the profile picture",
        sender_id: auth.currentUser.uid,
        senderIDEmail: auth.currentUser.email
      })



    }

    else {
      let chatCollectionRef = collection(db, "users/" + auth.currentUser.uid + "/chats")
      const chatDocs = await getDocs(chatCollectionRef)

      if (chatDocs.size > 0) {
        let chatAlreadyCreated = false
        chatDocs.forEach((doc) => {
          if (doc.data().sender_id === auth.currentUser.uid && doc.data().receiver_id === route.params.receiverId) {
            chatAlreadyCreated = true
          }
        })

        if (chatAlreadyCreated) {
          console.log("Chat has already been created")
        }

        else {
          chatCollectionRef = collection(db, "users/" + auth.currentUser.uid + "/chats")
          addDoc(chatCollectionRef, {
            sender_id: auth.currentUser.uid,
            receiver_id: [route.params.receiverId],
            chatName: route.params.userBeingViewedProfileInformation.email,
            chatProfilePictures: route.params.userBeingViewedProfileInformation.profile_picture,
            eventChat: false,
            chatLastMessageSent: null,
            chatLastMessageSentTime: null
          }).then((doc) => {
            setchatID(doc.id)
            addDoc(collection(db, doc.path + "/messages"), {
              timeStamp: serverTimestamp(),
              sender_id: auth.currentUser.uid,
              message: input,
              senderIDEmail: auth.currentUser.email,
            })

            //setchatID(doc.id)


          })

        }
      }
      else {
        chatCollectionRef = collection(db, "users/" + auth.currentUser.uid + "/chats")
        addDoc(chatCollectionRef, {
          sender_id: auth.currentUser.uid,
          receiver_id: [route.params.receiverId],
          chatName: route.params.userBeingViewedProfileInformation.username,
          chatProfilePictures: route.params.userBeingViewedProfileInformation.profile_picture,
          eventChat: false,
          chatLastMessageSent: null,
          chatLastMessageSentTime: null
        }).then((doc) => {
          setchatID(doc.id)
          addDoc(collection(db, doc.path + "/messages"), {
            timeStamp: serverTimestamp(),
            sender_id: auth.currentUser.uid,
            message: input,
            senderIDEmail: auth.currentUser.email,
            displayName: 'this is the display name',
            profilePicture: "this is the profile picture",
          })

          //setchatID(doc.id) 


        })

      }
    }
    setInput('')
  };



  async function createMessage(message) {
    const messageSenderProfileInformationRef = doc(db, 'users/', message.sender_id, 'profile', 'profile')
    const messageSenderProfileInformation = (await getDoc(messageSenderProfileInformationRef)).data()

    return {
      ...message,
      senderUsername: messageSenderProfileInformation.username,
      senderProfilePicture: messageSenderProfileInformation.profile_picture
    }

  }

  useEffect(
    () => {
      if (chatID != null) {
        async function getChatCollectionRef() {
          const chatsQuery = collectionGroup(db, "chats")
          const chats = await getDocs(chatsQuery)

          const chatRef = chats.docs?.find(doc => doc.id === chatID)

          const chatCollectionRef = collection(db, chatRef.ref.path + "/messages")



          const q = query(chatCollectionRef, orderBy("timeStamp", "asc"))
          onSnapshot(q, async (snapshot) => {
            const newMessages = []
            for (const document of snapshot.docs) {
              newMessages.push(await createMessage(document.data()))
            }
            setMessages(newMessages)
          })



        }
        async function setMessagesInformation() {

          const chatsQuery = collectionGroup(db, "chats")
          const chats = await getDocs(chatsQuery)
          const chat = chats.docs.find(doc => doc.id === chatID)
          const chatCollectionRef = collection(db, chat.ref.path, 'messages')
          const chatCollectionQuery = query(chatCollectionRef, orderBy("timeStamp", "asc"))
          const messages = await getDocs(chatCollectionQuery)
  
        const messageData = []
        for (const message of messages.docs) {
          messageData.push(await createMessage(message.data()))
        }  

          setMessages(messageData)


        }


        getChatCollectionRef()
        setMessagesInformation()

      }




    }, [db, chatID])
  
  // useEffect(
  //   () => {
      


  //   }, [messages]
  // )

  return (
    <SafeAreaView style={{ display: 'flex', flex: 1, margin: 20, flexDirection: 'column' }}>

      <View style={{ flexDirection: 'row', marginBottom: 15 }}>
        <Ionicons style={{ alignSelf: 'center' }} name='chevron-back' size={35} onPress={() => navigation.navigate('Messages')} />
        <View style={{ flex: .9, alignItems: 'center', }}>
          <Image
            source={{ uri: route.params.chatProfilePictures[0] }}
            style={{ width: 50, height: 50, borderRadius: 25 }}
          />

          <Text style={{ fontWeight: '500' }}>{route.params.chatName}</Text>
        </View>

      </View>
      <Divider style={{ width: '100%' }} width={.5} />



      <ScrollView
        style={{ flexBasis: '100%', marginVertical: 20}}
        showsVerticalScrollIndicator={false}

      >
        <>
          {messages.map(({ id, message, senderID, senderUsername, senderProfilePicture }) => (
            senderID === auth.currentUser.uid ? (

              <View key={id} style={{ flexDirection: 'row', marginBottom: 5 }}>
                <View style={{ marginRight: 20, alignSelf: 'center' }}>
                  <Image
                    source={{ uri: senderProfilePicture }}
                    style={{ width: 50, height: 50, borderRadius: 25 }}
                  />
                </View>
                <View style={{ flexDirection: 'column' }}>
                  <Text>{senderUsername}</Text>
                  <View style={styles.receiver}>
                    <Text>{message}</Text>
                  </View>
                </View>
              </View>

            ) : (
              <>
                <View key={id} style={{ flexDirection: 'row', marginBottom: 5 }}>
                  <View style={{ marginRight: 20, alignSelf: 'center' }}>
                    <Image
                      source={{ uri: senderProfilePicture }}
                      style={{ width: 50, height: 50, borderRadius: 25 }}
                    />
                  </View>
                  <View style={{ flexDirection: 'column' }}>
                    <Text>{senderUsername}</Text>
                    <View style={styles.receiver}>
                      <Text>{message}</Text>
                    </View>
                  </View>
                </View>
              </>
            )


          ))}
        </>
      </ScrollView>
      <KeyboardAvoidingView
        // behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset='60%'
        style={{ display: "flex", flexDirection: "column" }}
      >
        <View
          style={{ height: 50, flexDirection: 'row', alignItems: 'center' }}

        >
          <View style={{ backgroundColor: 'lightgray', borderRadius: 25, height: 40, flex: 1, marginRight: 20, justifyContent: 'center' }}>
            <TextInput
              value={input}
              onChangeText={(text) => setInput(text)}
              placeholder="send a message"
              style={{ justifyContent: 'center', marginLeft: 15 }}
            />
          </View>

          <Pressable onPress={sendMessage}>
            <Ionicons name='send' size={25} />
          </Pressable>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  sender: {
    padding: 15,
    backgroundColor: "#2B68E6",
    alignSelf: "flex-end",
    borderRadius: 20,
    margin: 15,
    maxWidth: "80%",
    position: "relative"

  },
  receiver: {
    padding: 15,
    backgroundColor: "#ECECEC",
    alignSelf: "flex-start",
    borderRadius: 20,
    marginRight: 15,
    marginBottom: 20,
    maxWidth: "80%",
    position: "relative"
  }
})