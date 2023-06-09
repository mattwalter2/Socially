import { View, Text, TextInput, Pressable, Alert, SafeAreaView, StyleSheet } from 'react-native'
import React from 'react'
import { Formik } from 'formik'
import { auth, db} from '../../firebase'
import { collection, doc, setDoc, getDocs, addDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import * as Yup from 'yup'
import Validator from 'email-validator'

export default function SignUpForm({navigation}) {
    const SignUpFormSchema = Yup.object().shape({
        email: Yup.string().email().required('An email is required'),
        username: Yup.string().required().min(2, 'A username is required'),
        password: Yup.string()
            .required()
            .min(6, 'Your password has to have at least 6 characters')
    })

    const getRandomProfilePicture = async () => {
        const response = await fetch('https://randomuser.me/api')
        const data = await response.json()
        console.log(data.results[0].picture.large)
        return data.results[0].picture.large
    }

    
    const onSignUp = async (email, password, username) => {
        try {
            const authUser = await createUserWithEmailAndPassword(auth, email, password)
            console.log('Firebase User Created Successfully!!')
            console.log(authUser.user.uid)
            const userRef = doc(db, 'users', authUser.user.uid)
            await setDoc(userRef, {
                owner_uid: authUser.user.uid,
                email: authUser.user.email,
            })
            
            const test = doc(db, 'users/' + auth.currentUser.uid + '/profile/profile')
            await setDoc(test, {
                username: username,
                biography: null,
                profile_picture: await getRandomProfilePicture(),
                uid: auth.currentUser.uid,
                email: auth.currentUser.email
            })

            

            
        } catch(error) {
            Alert.alert(error.message)
            console.log(username)
            console.log('erroring')
        }
    }
  return (
    <SafeAreaView style={{margin: 10}}>
        <Formik
            initialValues={{email: '', username: '', password: ''}}
            onSubmit={values => {
                onSignUp(values.email, values.password, values.username)
            }}
            validationSchema={SignUpFormSchema}
            validateOnMount={true}
        >
            {({handleChange, handleBlur, handleSubmit, values, isValid }) => (
                <>
                    <View>
                        <View style={styles.signUpInputContainer}>
                            <TextInput 
                            style={{marginLeft: 15, fontSize: 17, color: 'rgba(255, 255, 255, 1)'}}
                            placeholderTextColor= 'rgba(255, 255, 255, 1)'
                            placeholder= 'Email'
                            autoCapitalize= 'none'
                            keyboardType= 'email-address'
                            autoFocus= {true}
                            onChangeText={handleChange('email')}
                            onBlur={handleBlur('email')}
                            value={values.email}
                            />
                        </View>
                        <View style={styles.signUpInputContainer}>
                            <TextInput 
                            style={{marginLeft: 15, fontSize: 17, color: 'rgba(255, 255, 255, 1)'}}
                            placeholderTextColor= 'rgba(255, 255, 255, 1)'
                            placeholder= 'Username'
                            autoCapitalize= 'none'
                            textContentType= 'username'
                            onChangeText={handleChange('username')}
                            onBlur={handleBlur('username')}
                            value={values.username}
                            />
                        </View>
                        <View style={styles.signUpInputContainer}>
                            <TextInput 
                            style={{marginLeft: 15, fontSize: 17, color: 'rgba(255, 255, 255, 1)'}}
                            placeholderTextColor= 'rgba(255, 255, 255, 1)'
                            placeholder= 'Password'
                            autoCapitalize= 'none'
                            textContentType= 'password'
                            secureTextEntry= {true}
                            onChangeText={handleChange('password')}
                            onBlur={handleBlur('password')}
                            value={values.password}
                            />
                        </View>
                    </View>
                    
                <View style={{height: 50, borderRadius: 25, borderColor: 'white', borderWidth: 1.5, justifyContent: 'center', marginVertical: 10}}>
                    <Pressable
                        onPress={handleSubmit}
                    >
                        <Text style={{textAlign: 'center', color: 'white', fontSize: 20, fontWeight: '700'}}>Sign Up</Text>
                    </Pressable>
                </View>
                    <View style={{flexDirection: 'row', alignContent: 'center', justifyContent: 'center'}}>
                        <Text style={{color: 'white'}}>
                            Already have an account?

                        </Text>
                        <Pressable
                                onPress={() => navigation.navigate("Login")}
                            >
                                <Text style={{fontWeight: '600', color: 'white'}}> Login here</Text>
                            </Pressable>
                    </View>
            </>
                )}
      </Formik>
    </SafeAreaView>

  )
}

const styles = StyleSheet.create({
    signUpInputContainer:{
        
        borderRadius: 25, 
        height: 50, 
        justifyContent: 'center',
        marginBottom: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.18)'
        
    }
})