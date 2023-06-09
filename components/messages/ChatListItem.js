import { View, Text, Image, StyleSheet, Pressable } from 'react-native'
import React from 'react'
import { Divider } from 'react-native-elements'
import { auth } from '../../firebase'

export default function ChatListItem({id, chatName, chatProfilePictures, enterChat, chatLastMessage, chatLastSender}) {
  console.log("chatID " + id)
  console.log("ChatListItem")
  console.log(chatProfilePictures.length)
  console.log('these are pictures' , chatProfilePictures)
  return (
    <>
      <Pressable onPress={() => enterChat(id, chatName, chatProfilePictures) }>
        <View style={styles.container1}>
            <View style={styles.profilesidecontainer}>
              <View style={{flexDirection: 'row', width: 75, flexWrap: 'wrap'}}>
              {chatProfilePictures.length > 1 ? (
              
              chatProfilePictures.slice(0,4).map((chatProfilePicture, index) => {
                return (
                  <Image
                    key={index}
                    source={{
                      uri: chatProfilePicture
                    }} 
                    style={{width:37.5, height:37.5, borderRadius:37.5}}
                  />)
              })
              ) : 
              

                <Image
                  key={'test'}
                  source={{
                    uri: chatProfilePictures[0]
                  }} 
                  style={{width:75, height:75, borderRadius:37.5}}
                />
              


              }
              </View>

              <View style={{marginLeft: 10}}>
                <Text style={styles.messagereceivertext}>{chatName}</Text>
                <View style={{display: 'flex', flexDirection: 'row'}}>
                  <Text style={{fontWeight: '500'}}>{chatLastSender === auth.currentUser.uid ? 'You: ' : chatName}</Text>
                  <Text style={styles.latestmessagetext}>{chatLastMessage}</Text>
                </View>
              </View>
            </View>
            {/* <View>
              <Text style={styles.timesenttext}>YESTERDAY</Text>
            </View> */}
        </View>
        <Divider style={{width: '100%'}} width={.5} />
      </Pressable>
      
    </>
  )

  
}

const styles= StyleSheet.create({
  container1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    height: 75
    
  },
  profilesidecontainer: {
    flexDirection: 'row',
    alignItems: 'center',

  },
  messagereceivertext: {
    fontSize: 18,
    fontWeight: '700'
  },
  latestmessagetext: {
    color: 'black',
    fontWeight: '300'
  },
  timesenttext: {
    color: 'gray',
    fontWeight: '500'
  }


})

