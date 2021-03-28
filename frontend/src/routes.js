import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import { createDrawerNavigator, DrawerItems } from 'react-navigation-drawer'
import React from 'react'
import { Image, View, SafeAreaView, ScrollView, Text } from 'react-native'
import { Divider } from 'react-native-paper';

import Main from './pages/Main'
import New from './pages/New'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Cadastro from './pages/cadastro_usuario'
import Chat from './pages/Chat'
import Admin from './pages/Admin'

import profile from './resources/user.jpg'
import { render } from 'react-dom'
import AsyncStorage from '@react-native-async-storage/async-storage';

class Routes extends React.Component {
	state = {
		teste: '1'
	}

	componentDidMount () {
		const data = userData()
		this.state.image = data.image
	}

	render() {
		return (
			<Drawer />
		)
	}

}

const userData = async () => {
	try {
		const jsonValue = await AsyncStorage.getItem('@user')
		console.log(jsonValue)
		return jsonValue != null ? JSON.parse(jsonValue) : null;
	} catch (e) {
		console.log(e)
	}
}

const CustomDrawerComponent = (props) => (
	<SafeAreaView style={{ flex: 1 }}>
		<View style={{ height: 150, backgroundColor: '#fff' }}>
			<View style={{ justifyContent: 'space-between' }}>
				<Image source={profile} style={{ top: 40, left: 10, height: 100, width: 100, borderRadius: 60 }} />
				<View style={{ left: 120, top: -30 }}>
					<Text style={{ fontWeight: 'bold' }}>Olá, Lenon!</Text>
					<Text>Nível 10</Text>
					<Text>20 animais recuperados</Text>
				</View>
			</View>
		</View>
		<Divider />
		<ScrollView>
			<DrawerItems {...props} />
		</ScrollView>

	</SafeAreaView>
)

const Drawer = createDrawerNavigator({
	// Login: {screen: Login},
	Home: { screen: Main },
	Perfil: { screen: Profile },
	Postar: { screen: New },
	Chat: { screen: Chat },
	Sair: { screen: Login },
}, {
	contentComponent: CustomDrawerComponent,
	contentOptions: {
		activeTintColor: '#71C7A6'
	}
},
	{
		navigationOptions: {
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
		Admin: {
			screen: Admin,
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