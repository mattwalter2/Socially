import { View, Text, ScrollView, Image, StyleSheet, Pressable} from 'react-native'
import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'


export default function Categories({setShownEventsType}) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{flexDirection: 'row', marginLeft: 25, marginTop: 20}}>
            <Category name='american-football' text='For You' iconImage='/Users/matthewwalter/Desktop/socially/socially/assets/For You Icon.png' setShownEventsType={setShownEventsType} />
            <Category name='american-football' text='Party' iconImage='/Users/matthewwalter/Desktop/socially/socially/assets/Party Icon.png' setShownEventsType={setShownEventsType} />
            <Category name='american-football' text='Chill' iconImage='/Users/matthewwalter/Desktop/socially/socially/assets/Chill Icon.png' setShownEventsType={setShownEventsType} />
            <Category name='american-football' text='Sports' iconImage='/Users/matthewwalter/Desktop/socially/socially/assets/Sports Icon.png' setShownEventsType={setShownEventsType} />
            <Category name='american-football' text='Adventure' iconImage='/Users/matthewwalter/Desktop/socially/socially/assets/Adventure Icon.png' setShownEventsType={setShownEventsType} />
            
    
        </View>
    </ScrollView>
  )
}

const Category = ({setShownEventsType, ...props}) => (
    <View>
        <Pressable style={styles.category} onPress={() => setShownEventsType(props.text)}>
            <View>
                <Image 
                    source={{uri: props.iconImage}}
                    style={{resizeMode: 'contain', width: 60, height: 60}}
                />
                
            </View>
            <Text style={styles.categorytext}>{props.text}</Text>
        </Pressable>
    </View>
    
    
)

const styles = StyleSheet.create({
    categorytext: {
        marginTop: 3,
        textAlign: 'center',
        fontWeight: '700'
    },
    category: {
        justifyContent: 'center',
        marginRight: 35,
    }
})