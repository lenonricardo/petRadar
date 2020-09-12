import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import {createDrawerNavigator, DrawerItems } from 'react-navigation-drawer'
import React from 'react'
import { Image, View, SafeAreaView, ScrollView, Dimensions } from 'react-native'

import Main from './pages/Main'
import New from './pages/New'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Cadastro from './pages/cadastro_usuario'

import profile from './resources/user.jpg'
import { render } from 'react-dom'

class Routes extends React.Component{
  render(){
    return(
      <Drawer/>
    )
  }

}

const CustomDrawerComponent = (props) => (
  <SafeAreaView style={{flex: 1}}>
    <View style={{height:150, backgroundColor: 'white'}}>
      <Image source={profile} style={{top:40, left: 80, height: 100, width: 100, borderRadius: 60}}/>
    </View>
    <ScrollView>
      <DrawerItems {...props}/>
    </ScrollView>

  </SafeAreaView>
)

const Drawer = createDrawerNavigator({
// Login: {screen: Login},
Home:{ screen: Main},
Perfil: { screen: Profile},
Postar:{ screen: New},
Sair:{ screen: Login},
},{
  contentComponent: CustomDrawerComponent,
  contentOptions:{
    activeTintColor: '#71C7A6'
  }
},
 {
  navigationOptions:{
    },
  drawerPosition: 'left',
  // drawerLabel: 'Home',
  drawerBackgroundColor: '#fff',
  // tintColor: '#71C7A6',    
  
})

const AppNavigator = createSwitchNavigator(
  {
    App: Drawer,
    Login: {
      screen: Login,
    },
    Cadastro: {
      screen: Cadastro,
    },
  },
  {
    initialRouteName: 'Login',
  },
);



const App = createAppContainer(AppNavigator);


// const Routes = createAppContainer(
//     createStackNavigator({
//         Main: {
//             screen: Main,
//             navigationOptions:{
//                 title: 'petRadar'
//             }
//         },
//         Profile:{
//             screen: Profile,
//             navigationOptions:{
//                 title: 'Perfil'
//             }
//         },
//         New:{
//             screen: New,
//             navigationOptions:{
//                 title: 'New',
//                 headerTitle: 'Nova publicação'
//             }
//         }
//     }, {
//         defaultNavigationOptions:{
//             headerTintColor: '#fff',
//             headerStyle:{
//                 backgroundColor: '#71C7A6',
                
//             },
//             headerBackTitleVisible: false,
//             headerTitle: <Image source={logo}/>,
//             headerBackTitle: null,
//         }
//     })
// )

export default App