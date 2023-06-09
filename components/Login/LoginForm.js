import { View, Text, TextInput, Button, TouchableOpacity, Pressable, Alert, StyleSheet, SafeAreaView } from 'react-native'
import React, { useState } from 'react'
import { Formik, validateYupSchema } from 'formik'
import { sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../firebase'
import * as Yup from 'yup'
import Validator from 'email-validator'
import { LinearGradient } from 'expo-linear-gradient'

export default function LoginForm({navigation}) {
    const LoginFormSchema = Yup.object().shape({
        email: Yup.string().email().required('An email is required'),
        password: Yup.string()
            .required()
            .min(8, 'Your password has to have at least 8 characters')
    })

    const onLogin = async (email, password) => {
        try {
            await signInWithEmailAndPassword(auth, email, password)
            console.log('Firebase Login Successful!', email, password)
        } catch(error) {
            Alert.alert(error.message)
        }
    }
  return (
    <SafeAreaView style={{margin: 10}}>
        <Formik
            initialValues={{email: '', password: ''}}
            onSubmit={values => {
                onLogin(values.email, values.password)
            }}
            validationSchema={LoginFormSchema}
            validateOnMount={true}
        >
            {({handleChange, handleBlur, handleSubmit, values, isValid }) => (
                <>
                    <View style={styles.loginInputContainer}>
                        <TextInput 
                        style={{color: 'rgba(255, 255, 255, 1)', padding: 10}}
                        placeholderTextColor= 'rgba(255, 255, 255, 1)'
                        placeholder= 'Phone number, username or email'
                        autoCapitalize= 'none'
                        keyboardType= 'email-address'
                        textContentType= 'emailAddress'
                        autoFocus= {true}
                        onChangeText={handleChange('email')}
                        onBlur={handleBlur('email')}
                        value={values.email}
                        />
                    </View>
                    <View style={styles.loginInputContainer}>
                        <TextInput 
                        style={{color: 'rgba(255, 255, 255, 1)', padding: 10}}
                        placeholderTextColor= 'rgba(255, 255, 255, 1)'
                        placeholder= 'Password'
                        autoCapitalize= 'none'
                        autoCorrect= {false}
                        textContentType= 'password'
                        secureTextEntry= {true}
                        onChangeText={handleChange('password')}
                        onBlur={handleBlur('password')}
                        value={values.password}

                        />
                    </View>
                    <View>
                        <Pressable 
                            onPress={() => {sendPasswordResetEmail(auth, values.email), alert('password reset form has been sent to your email inputed.')}}
                        >
                        <Text style={{color: 'white'}}>Forgot password?</Text>
                        </Pressable>
                    </View>
                    <View style={{height: 50, borderRadius: 25, borderColor: 'white', borderWidth: 1.5, justifyContent: 'center', marginVertical: 10}}>

                    <Pressable
                        onPress={handleSubmit}
                    >
                        <Text style={{textAlign: 'center', color: 'white', fontSize: 20, fontWeight: '700'}}>Login</Text>
                    </Pressable>
                    
                </View>
                <View style={{flexDirection: 'row', alignContent: 'center', justifyContent: 'center'}}>
                        <Text style={{color: 'white'}}>
                            Don't have an account?

                        </Text>
                        <Pressable
                                onPress={() => navigation.navigate("SignUp")}
                            >
                                <Text style={{fontWeight: '600', color: 'white'}}> Sign Up</Text>
                            </Pressable>
                </View>
            </>
                )}
      </Formik>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    loginInputContainer:{
        
        borderRadius: 25, 
        height: 50, 
        justifyContent: 'center',
        marginBottom: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.18)'
        
        
        
    }
  })