import React from 'react'
import { View } from 'react-native'
import Header from './header'

function Profile({ navigation }){

    const userId = navigation.getParam('userId') 

    return (<Header navigation={navigation}/>)
}

export default Profile