import React, { Component } from 'react';
import api from '../services/api'
import * as ImagePicker from 'expo-image-picker'
import cao from '../resources/cao.png'
import gato from '../resources/gato.png'
import medalha from '../resources/medalha.png'
import profile from '../resources/user.jpg'
import { MaterialIcons } from '@expo/vector-icons'
import { Divider } from 'react-native-paper';

import { View
       , StyleSheet
       , TouchableOpacity
       , Text
       , TextInput
       , Image
       , ActivityIndicator
       , Keyboard
       , KeyboardAvoidingView
       , TouchableWithoutFeedback
       , ScrollView
       , Platform
       , SafeAreaView
       } from 'react-native';

import Header from './header'

export default class New extends Component {


  state = {

  }

  render() {
    const navigation = this.props.navigation

    return (
      
      <>
      <Header navigation={navigation}/>
      <View style={styles.container} >
        <ScrollView style={{width:'100%'}}>
            <View style={{alignItems: 'center', justifyContent: 'center'}} >
                <Image source={profile} style={styles.profile}/>
                <Text style={styles.userName}>Lenon Mendes</Text>
                <View style={{flexDirection: 'row', top: 90, alignItems: 'center'}}>
                    <MaterialIcons style={styles.userLocation}  name="games" size={30} color="#71C7A6" />
                    <Text style={styles.userLocation}> Nível 10</Text>
                </View>
            </View>
            
            <View style={styles.recompensa}>
                <View style={styles.textoRecompensa}>
                    <Image source={cao} style={styles.cao}/>
                    <Text style={{width: 300, fontWeight: 'bold', color: '#63af92'}}>Parabéns, você ajudou a recuperar 10 cachorrinhos! :)</Text>
                </View>
                <Divider />

                <View style={styles.textoRecompensa}>
                    <Image source={gato} style={styles.cao}/>
                    <Text style={{width: 300, fontWeight: 'bold', color: '#63af92'}}>Parabéns, você ajudou a recuperar 10 gatinhos! :)</Text>
                </View>

            </View>

        </ScrollView>             
      </View>
      
  </>
      
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
    alignContent: 'center',
    alignItems: "center",
    zIndex: -1,
    
  },
    userName: {
    fontWeight: 'bold',
    color: '#000',
    fontSize: 20,
    bottom: -50,
    top: 85,
},
userLocation: {
    color: '#666',
    fontSize: 16
},
profile:{
    top: 80
    , height: 200
    , width: 200
    , borderRadius: 100
    , borderColor: '#63af92'
    , borderWidth: 4
},
cao:{
     height: 80
    , width: 80
    , borderRadius: 100
    , marginBottom: 10
    , marginRight: 10   
    , marginTop: 10 
    // , alignItems: 'flex-start'
},
recompensa:{
    paddingTop: 20,
    top: 80,
    flexDirection: 'column'
},
textoRecompensa:{
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
    
    // flexDirection: 'row',
    // alignItems: 'center',

}
})
