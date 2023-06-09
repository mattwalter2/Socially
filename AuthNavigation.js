import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { auth } from './firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { SignedInStack, SignedOutStack } from './navigation'

export default function AuthNavigation() {
    
    const [currentUser, setCurrentUser] = useState(null)

    const userHandler = user =>
        user ? setCurrentUser(user) : setCurrentUser(null)
   
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => userHandler(user)) 
        console.log(unsubscribe)
        return unsubscribe
    }, [])
    
  return <>{currentUser ? <SignedInStack /> : <SignedOutStack />}</>
}