import { View, Text, TouchableOpacity, SafeAreaView, TextInput, StyleSheet, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Formik } from 'formik'
import Feather from 'react-native-vector-icons/Feather'
import { auth, db } from '../firebase'
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore'
import { launchImageLibraryAsync } from 'expo-image-picker'

export default function UserProfileEdit({navigation}) {
    const docRef = doc(db, 'users/' + auth.currentUser.uid + '/profile/profile')
    const [profileInformation, setProfileInformation] = useState(getDoc(docRef))
    const [selectedPhoto, setSelectedPhoto] = useState(null)

    const choosePhotoFromLibrary = async () => {
        const selectedPhoto = await launchImageLibraryAsync()
        setSelectedPhoto(selectedPhoto.uri)
    }
    
    useEffect(
        () => 
            onSnapshot(docRef, (doc) => {
            setProfileInformation(doc.data())
        }
    ), 
    []
    )

    const handleUpdateProfileInformation = async (username, biography) => {
        try {
            updateDoc(docRef, {
                username: username,
                biography: biography,
                profile_picture: selectedPhoto !== null ? selectedPhoto : profileInformation.profile_picture
            })  
        } catch(error) {
            console.log('error')
        }
    }
  return (
    <SafeAreaView>
        <Formik
            initialValues={{username: profileInformation.username , biography: profileInformation.biography}}
            enableReinitialize= {true}
            onSubmit={values => {
                const updateProfileInformation = handleUpdateProfileInformation(values.username, values.biography)
                navigation.navigate('UserProfileView')
            }}          
        >
            {({handleChange, handleBlur, handleSubmit, values}) => (
                <>
                
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', padding: 15}}>
                        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                            <Text>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Text style={{color: 'pink'}} onPress={handleSubmit}>Save</Text>
                        </TouchableOpacity>
                    </View>
                    <View 
                        style={styles.ProfilePictureChange}
                    >
                        <Image 
                            source={{
                                uri: selectedPhoto !== null ? selectedPhoto : profileInformation.profile_picture
                            }}
                            style={{width:75, height:75, borderRadius:37.5}}
                        />
                        <TouchableOpacity onPress={choosePhotoFromLibrary}>
                            <Text style={styles.ProfilePictureChangeText}>Change Profile Picture</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{flexDirection: 'row', padding:15, alignItems: 'center'}}>
                        <InputFieldName name='Username' />
                        <TextInput 
                            style={styles.SmallInputBox} 
                            placeholder='username123' 
                            onChangeText={handleChange('username')}
                            value={values.username}
                        />
                    </View>
                    <View style={styles.inputview}>
                        <InputFieldName name='Biography' />
                        <TextInput 
                            style={styles.SmallInputBox} 
                            placeholder='my bio' 
                            onChangeText={handleChange('biography')}
                            value={values.biography}
                        />
                    </View>
                </>
            )}
        </Formik>
      
    </SafeAreaView>
  )
}

const InputFieldName = (props) => (
    <Text style={{fontSize: 16, fontWeight: '600', paddingRight: 35}}>{props.name}</Text>
)

const styles = StyleSheet.create({
    inputview: {
        flexDirection: 'row',
        padding: 15,
        alignItems: 'center'
    },
    SmallInputBox: {
        borderWidth: 1,
        borderColor: '#777',
        height: 30,
        borderRadius: 5,
        flex: 1
    },
    ProfilePictureChange: {
        alignItems: 'center',
    },
    ProfilePictureChangeText: {
        marginTop: 15,
        marginBottom: 30
    }

})