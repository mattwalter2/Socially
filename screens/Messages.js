import { View, Text, SafeAreaView, StyleSheet, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import ChatListItem from '../components/messages/ChatListItem'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { auth, db } from '../firebase'
import { collection, collectionGroup, doc, getDoc, getDocs, onSnapshot, orderBy, query, where } from 'firebase/firestore'

export default function Messages({navigation}) {
  const [chats, setChats] = useState([])
  console.log("Messages.js")
  const enterChat = (id, chatName, chatProfilePictures) => {
    navigation.navigate('Chat', {
      id: id,
      chatName,
      chatProfilePictures,
    })
  }





  console.log(chats)
 
  useEffect(
    () => {
        async function getChatsInformation() {
          const chatCollectionGroupRef = collectionGroup(db, "chats")
          const receiverChatsQuery = query(chatCollectionGroupRef, where("receiver_id", 'array-contains', auth.currentUser.uid))
          // Check if there are any receiverChats
          const receiverChats = await getDocs(receiverChatsQuery)
          if (receiverChats.size !== 0) {
            //receiverChats.forEach((chat) => {
            for (const chat of receiverChats.docs) {
              


              // const chatMessagesRef = collection(db, chat.ref.path, 'messages')
              // const chatMessagesQuery = query(chatMessagesRef, orderBy("timeStamp", "asc"))
              // const chatMessages = getDocs(chatMessagesQuery).then(console.log(chatMessages[0].message))

              






              // Check if chat is an event chat
              if (chat.data().eventChat) {
                console.log('Chat is an event chat')

                // One of the profiles that needs to be shown is the event creators
                const senderUid = chat.data().sender_id

                console.log('hey')
                
                // Now all the receiver profiles need to be shown except the current user logged in
                const receiverUids = chat.data().receiver_id
                let allReceiverUIDsExceptCurrentUser = receiverUids.filter(id => id !== auth.currentUser.uid)
                
                allReceiverUIDsExceptCurrentUser = allReceiverUIDsExceptCurrentUser.concat(senderUid)
                // console.log(allReceiverUIDsExceptCurrentUser)
                const receiverUIDProfilePictures = []
                for (const receiverUid of allReceiverUIDsExceptCurrentUser) {
                  const receiverUidProfileInformationRef = doc(db, 'users', receiverUid, 'profile', 'profile')
                //   console.log(receiverUID)
                     const receiverUidProfileInformation = await getDoc(receiverUidProfileInformationRef)
                     receiverUIDProfilePictures.push(receiverUidProfileInformation.data().profile_picture)
                }

                setChats(oldState => [...oldState, {id: chat.id, chatProfilePictures: receiverUIDProfilePictures, chatName: chat.data().chatName}])
 
                

                    
                
              }
              else {
                
                // At this point, it is verified the chat is not an event chat. 
                // Since in this case the user is the receiver, the profile picture that should be shown is the sender's.
                const senderUID = chat.data().sender_id[0]
                const senderUIDProfileInformationRef = doc(db, 'users', senderUID, 'profile', 'profile')
                const senderUIDProfileInformation = getDoc(senderUIDProfileInformationRef)
                setChats(oldState => [...oldState, {id: chat.id, chatProfilePictures: [senderUIDProfileInformation.data().profile_picture]}])
              }
            }
          } else {
            console.log('user does not have any chats in which they are the receiver')










          }

          
          
          const senderChatsQuery = query(chatCollectionGroupRef, where("sender_id", "==", auth.currentUser.uid))
          const senderChats = await getDocs(senderChatsQuery)
          if (senderChats.size !== 0) {
            
            // senderChats.forEach((chat) => {
              for (const chat of senderChats.docs) {

              console.log(chat.ref.path + '/messages')

                
            
              // Check if chat is an event chat
              if (chat.data().eventChat) {
                console.log('Chat is an event chat')

                const senderUid = chat.data().sender_id

                console.log('hey')
                
                // Now all the receiver profiles need to be shown except the current user logged in
                const receiverUids = chat.data().receiver_id
                let allReceiverUIDsExceptCurrentUser = receiverUids.filter(id => id !== auth.currentUser.uid)
                
                allReceiverUIDsExceptCurrentUser = allReceiverUIDsExceptCurrentUser.concat(senderUid)
                // console.log(allReceiverUIDsExceptCurrentUser)
                const receiverUIDProfilePictures = []
                for (const receiverUid of allReceiverUIDsExceptCurrentUser) {
                  const receiverUidProfileInformationRef = doc(db, 'users', receiverUid, 'profile', 'profile')
                //   console.log(receiverUID)
                     const receiverUidProfileInformation = await getDoc(receiverUidProfileInformationRef)
                     receiverUIDProfilePictures.push(receiverUidProfileInformation.data().profile_picture)
                }

                setChats(oldState => [...oldState, {id: chat.id, chatProfilePictures: receiverUIDProfilePictures, chatName: chat.data().chatName}])
                //setChats(oldState => [...oldState, {id: chat.id, data: doc.data()}])
              }
              else {
                // At this point, it is verified the chat is not an event chat. 
                // Since in this case the user is the sender, the profile picture that should be shown is the receiver's.
                const receiverUID = chat.data().receiver_id[0]
                const receiverUIDProfileInformationRef = doc(db, 'users', receiverUID, 'profile', 'profile')
                console.log(receiverUIDProfileInformationRef.path)
                const receiverUIDProfileInformation = await getDoc(receiverUIDProfileInformationRef)
                const chatMessagesRef = collection(db, chat.ref.path, 'messages')
                const chatMessagesQuery = query(chatMessagesRef, orderBy("timeStamp", "desc"))
                const chatMessages = await getDocs(chatMessagesQuery)
                setChats(oldState => [...oldState, {id: chat.id, chatProfilePictures: [receiverUIDProfileInformation.data().profile_picture], chatName: receiverUIDProfileInformation.data().username, chatLastMessage: chatMessages.docs[0].data().message, chatLastSender: chatMessages.docs[0].data().sender_id}])
                
                
              }




              
            }
          } else {
            console.log('user does not have any chats in which they are the sender')
          }


        }

        getChatsInformation()
      }, 
    [db]
  )

  return (
    <SafeAreaView>
        <View style={styles.topview}>
            <Text style={styles.mainheader}>Messages</Text>
            <AntDesign style={{padding: 30}} name='close' size={24} onPress={() => navigation.navigate('Home')} />
        </View>
      <ScrollView>
        {chats.map(({id, chatProfilePictures, chatName, chatLastMessage, chatLastSender}) => (
            <ChatListItem key={id} id={id} chatProfilePictures={chatProfilePictures} chatName={chatName} chatLastMessage={chatLastMessage} chatLastSender={chatLastSender} lastMessagetime={null} enterChat={enterChat} />
        ))}
        
      </ScrollView>

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
  }
})