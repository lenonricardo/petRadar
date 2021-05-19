// import { createAppContainer } from '@react-navigation/native'
import { createSwitchNavigator, createAppContainer } from 'react-navigation'
import { createDrawerNavigator, DrawerItems } from 'react-navigation-drawer'
import React, { useState } from 'react'
import { Image, View, SafeAreaView, ScrollView, Text, LogBox } from 'react-native'
import { Divider } from 'react-native-paper';

import Main from './pages/Main'
import New from './pages/New'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Cadastro from './pages/cadastro_usuario'
import Chat from './pages/Chat'
import Galeria from './pages/Galeria'
import Admin from './pages/Admin'
import Adocao from './pages/Adocao'
import Anuncio from './pages/Anuncio'

import profile from './resources/user.jpg'
import AsyncStorage from '@react-native-async-storage/async-storage';

class Routes extends React.Component {

	componentDidMount () {
		console.log('teste')
		LogBox.ignoreAllLogs()
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
		return jsonValue
	} catch (e) {
		console.log(e)
	}
}

const CustomDrawerComponent = (props) => {
	const [user, setUser] = useState({})

	if (Object.keys(user).length === 0) {
		userData().then((value) => {
			setUser(JSON.parse(value))
		})
	}

	return (

	<SafeAreaView style={{ flex: 1 }}>
		<View style={{ height: 150, backgroundColor: '#fff' }}>
			<View style={{ justifyContent: 'space-between' }}>
				<Image source={{ uri: `http://192.168.100.7:3333/files/${user.image}` }} style={{ top: 40, left: 10, height: 100, width: 100, borderRadius: 60 }} />
				<View style={{ left: 120, top: -30 }}>
					<Text style={{ fontWeight: 'bold' }}>Olá, {user.name}!</Text>
					<Text>Nível {!user.nivel ? '1' : user.nivel}</Text>
					<Text>{!user.recuperados ? '0' : user.recuperados} animais recuperados</Text>
				</View>
			</View>
		</View>
		<Divider />
		<ScrollView>
			<DrawerItems {...props} />
		</ScrollView>

	</SafeAreaView>
	)
}

const Drawer = createDrawerNavigator({
	Home: { screen: Main },
	Perfil: { screen: Profile },
	Postar: { screen: New },
	Chat: { screen: Chat },
	Galeria: {
		screen: Galeria,
		navigationOptions:{
			title: 'Animais Próximos'
		}
	},
	Adocao: {
		screen: Adocao,
		navigationOptions:{
			title: 'Adoção'
		}
	},
	Anuncio: {
		screen: Anuncio,
		navigationOptions:{
			title: 'Anunciar'
		}
	},
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
		drawerBackgroundColor: '#fff',

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

export default App