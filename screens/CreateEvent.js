import { View, Text, SafeAreaView, TextInput, TouchableOpacity, Switch, Pressable, StyleSheet, Button, Platform, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Formik } from 'formik'
import Feather from 'react-native-vector-icons/Feather'
import Entypo from 'react-native-vector-icons/Entypo'
import { collection, addDoc, doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'
import * as Yup from 'yup'
import DateTimePicker from '@react-native-community/datetimepicker'
import SelectDropdown from 'react-native-select-dropdown'
import AntDesign from 'react-native-vector-icons/AntDesign'


export default function CreateEvent( { navigation }) {
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [showStartTime, setShowStartTime] = useState(false)
    const [showEndTime, setShowEndTime] = useState(false)
    const [switchIsEnabled, setSwitchIsEnabled] = useState(false)
    const [startTime, setStartTime] = useState()
    const [endTime, setEndTime] = useState()

    const [dropdownCategorySelected, setDropdownCategorySelected] = useState(null)

    const [userProfileInformation, setUserProfileInformation] = useState({profile_picture: null, username: null})

    const ProfileDocRef = doc(db, 'users/' + auth.currentUser.uid + '/profile/profile')
    useEffect(
        () => 
            onSnapshot(ProfileDocRef, (doc) => {
            setUserProfileInformation(() => ({
                username: doc.data().username,
                profile_picture: doc.data().profile_picture
            }))
        }
    ), 
    []
    )

    const createEventSchema = Yup.object().shape({
        eventname: Yup.string().required().min(4, 'An event title is required'),
        address: Yup.string().required('An address is required'),
        description: Yup.string().required().min(10, 'A description is required')
    })

    const onChangeStartTime = (event, selectedDate) => {
        const currentDate = selectedDate || startDate
        setStartDate(currentDate)
        var weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 
                        'September','October', 'November', 'December'
                     ]
        let tempDate = new Date(currentDate)
        let fDate = weekdays[tempDate.getDay()] + ' ' + months[tempDate.getMonth()] + ' ' + tempDate.getDate() + ','
        let fTime = tempDate.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})
        setStartTime(fDate + ' ' + fTime)
    }

    const onChangeEndTime = (event, selectedDate) => {
        const currentDate = selectedDate || endDate
        setEndDate(currentDate)
        var weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 
                        'September','October', 'November', 'December'
                     ]
        let tempDate = new Date(currentDate)
        let fDate = weekdays[tempDate.getDay()] + ' ' + months[tempDate.getMonth()] + ' ' + tempDate.getDate() + ','
        let fTime = tempDate.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})
        setEndTime(fDate + ' ' + fTime)
    }

    const createEventChat = async (document, eventname) => {
        const chatDocRef = doc(db, 'users', auth.currentUser.uid, 'chats', document.id)
        console.log('this is a test' + document.id)
        await setDoc(chatDocRef, {
            sender_id: auth.currentUser.uid,
            receiver_id: [],
            chatProfilePictures: null,
            chatName: eventname,
            eventChat: true,
            chatLastMessageSentTime: null,
            chatLastMessageSent: null
        })
    }
    const handleCreateEvent = async (eventname, category, starttime, endtime, address, additionalNotes, description) => {
        try { 
            const colRef = collection(db, 'users', auth.currentUser.uid, 'posts')
            await addDoc(colRef, {
                owner_uid: auth.currentUser.uid,
                owner_email: auth.currentUser.email,
                eventtitle: eventname,
                category: category,
                timeofevent: starttime + '-\n' + (endtime !== undefined ? endtime: ''),
                address: address,
                additionalNotes: additionalNotes,
                description: description,
                peoplejoined: [],
                peopleRequestedToJoin: [],
                private: switchIsEnabled,
                profile_picture: userProfileInformation.profile_picture,
                username: userProfileInformation.username
            }).then((doc) => {createEventChat(doc, eventname)
                
            })
            console.log('a test')
        } catch {
            console.log('event not added')
        }

    }
  return (
    <SafeAreaView style={{flex: 1, margin: 20}}>
        <TopofPage navigation = {navigation}/>
        <ScrollView showsVerticalScrollIndicator={false} >
        <Formik
            enableReinitialize= {true}
            initialValues={{eventname: '', category: '', description: '', address: '', additionalNotes: ''}}
            onSubmit={values => {
                const newEvent = handleCreateEvent(values.eventname, values.category, startTime, endTime, values.address, values.additionalNotes, values.description)
                // createEventChat()
                navigation.navigate('Home')
            }}
            validationSchema={createEventSchema}
        >
            {({handleChange, handleBlur, handleSubmit, values}) => (
                <>
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                        <InputFieldName name= 'Event Name' />
                        <TextInput 
                            placeholder='Movie Night' 
                            onChangeText={handleChange('eventname')}
                            value={values.eventname}
                            style={[styles.SmallInputBox, {width: 200}]}
                        />
                    </View>
                    
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 20}}>
                        <InputFieldName name= 'Category' />
                        <SelectDropdown 
                        data={['Party', 'Chill', 'Sports', 'Adventure']}
                        defaultButtonText={'Select Category'}
                        dropdownIconPosition='right'
                        buttonStyle={{backgroundColor: '#f5f5f5', borderColor: '#777', borderWidth: 1, borderRadius: 5, height: 30, width: 200}}
                        buttonTextStyle={{color:'#bfbfbf', fontSize: 15}}
                        dropdownStyle={{}}
                        dropdownOverlayColor='transparent'
                        renderDropdownIcon={() => <AntDesign name='caretdown' />}
                        onSelect={(selectedItem) => {
                            values.category = selectedItem
                        }}

                        
                    />
                    </View>
                    {showStartTime && (
                        <DateTimePicker
                            testID='dateTimePicker'
                            value={startDate}
                            mode={'datetime'}
                            display={'spinner'}
                            is24Hour={true}
                            onChange={onChangeStartTime}
                            minuteInterval={15}
                        />)}

                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                        
                        <InputFieldName name= 'Start Time' />
                        <View style={{flexDirection: 'row', alignItems: 'center', width: 200}}>
                            <TextInput 
                                style={[styles.SmallInputBox, {flex: 1}]} 
                                placeholder='June 26th 6pm' 
                                editable={false}
                                value={startTime}
                            />
                            
                            <Pressable onPress={() => setShowStartTime(!showStartTime)}>
                                <Entypo name='calendar' size={30} />
                            </Pressable>


                        </View>

                    </View>
                    {showEndTime && (
                        <DateTimePicker
                            testID='dateTimePicker'
                            value={endDate}
                            mode={'datetime'}
                            display={'spinner'}
                            is24Hour={true}
                            onChange={onChangeEndTime}
                            minuteInterval={15}
                        />)}
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                        <InputFieldName name= 'End Time' />
                        <View style={{flexDirection: 'row', alignItems: 'center', width: 200}}>
                            <TextInput 
                                style={[styles.SmallInputBox, {flex: 1}]} 
                                placeholder='June 26th 8pm' 
                                editable={false}
                                value={endTime}
                            />
                            <Pressable onPress={() => setShowEndTime(!showEndTime)}>
                                <Entypo name='calendar' size={30} />
                            </Pressable>


                        </View>

                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                        <InputFieldName name= 'Address' />
                        <TextInput 
                            placeholder='123 Main Street' 
                            onChangeText={handleChange('address')}
                            value={values.address}
                            style={[styles.SmallInputBox, {width: 200}]}
                        />
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                        <InputFieldName name= 'Additonal Notes' />
                        <TextInput 
                            placeholder='Meet at the park by the street' 
                            onChangeText={handleChange('additionalNotes')}
                            value={values.additionalNotes}
                            style={[styles.SmallInputBox, {width: 200}]}
                        />
                    </View>
                    <View style={{marginVertical: 20}}>
                        <InputFieldName name= 'Description' />
                        <TextInput 
                            style={styles.BigInputBox} 
                            placeholder='Watch a movie with me and my friends! Snacks are provided!' 
                            onChangeText={handleChange('description')}
                            value={values.description}
                            multiline={true} 
                        />
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 20}}>
                        <View style={{width:140}}>
                            <InputFieldName name='Private Event' />
                            <PrivateEventSubText />
                        </View>
                        <Switch 
                            value={switchIsEnabled}
                            onValueChange={() => setSwitchIsEnabled(previousState => ! previousState)}/>
                        
                    </View>
                    
                    <Pressable 
                        style={{ margin: 15}} 
                        onPress={handleSubmit}
                    >
                        <View style={{backgroundColor: 'pink', height: 70, borderRadius: 35, justifyContent: 'center'}}>
                            <Text style={{color: 'white', fontSize: 25, fontWeight:'700', textAlign: 'center'}}>Create Event</Text>
                        </View>
                    </Pressable>
                </>
            )}
        </Formik>
        </ScrollView>
    </SafeAreaView>
  )
}

export const TopofPage = ( {navigation }) => (
    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20}}>
        <Text style={{fontSize:24, fontWeight: '700'}}>Create Event</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Feather name='x' size={24}/>
        </TouchableOpacity>
    </View>
)

export const InputFieldName = (props) => (
    <Text style={{fontSize: 16, fontWeight: '600'}}>{props.name}</Text>
)

export const PrivateEventSubText = () => (
    <Text style={{fontSize:13, color:'gray', marginTop: 10}}>Only people you approve can join the event</Text>
)

export const CreateEventButton = () => (
    <TouchableOpacity style={{ margin: 15}} onPress={() => console.log('hi')}>
        <View style={{backgroundColor: 'pink', height: 70, borderRadius: 35, justifyContent: 'center'}}>
            <Text style={{color: 'white', fontSize: 25, fontWeight:'700', textAlign: 'center'}}>Create Event</Text>
        </View>
    </TouchableOpacity>
)

const styles = StyleSheet.create({
    SmallInputBox: {
        borderWidth: 1,
        borderColor: '#777',
        height: 30,
        borderRadius: 5,
        paddingLeft: 10,
        marginVertical: 20,
    },
    BigInputBox: {
        marginTop: 12,
        borderWidth: 1,
        borderColor: '#777',
        borderRadius: 5,
        height: 125
    }
})
