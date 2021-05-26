import React, { useState, useEffect } from 'react'
import { DataTable, Button, Paragraph, Dialog, Portal, Provider as PaperProvider, Surface } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage';

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

import api from '../services/api'
import dog from '../resources/dog.png'
import cat from '../resources/cat.png'

import Header from './header'

function Admin ({ navigation }) {

	const [posts, setPosts] = useState([])
	const [publicacao, setPublicacao] = useState(null)
	const [currentPost, setCurrentPost] = useState([])
	const [visible, setVisible] = React.useState(false);

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);


	useEffect(() => {
		loadPosts()

	}, [])

	async function loadPosts() {
		const response = await api.get('/posts')

		setPosts(response.data.posts)
	}

	async function handleSubmit() {
		currentPost.aprovado = true

		await api.put(`posts/${currentPost._id}`, currentPost,
		{
			headers:
			{
				'Content-Type': 'application/json'
			}
		});

		// await api.delete('posts');

		hideDialog()
		loadPosts()
	}

	async function redirectHome (post, navigation) {
		const jsonValue = JSON.stringify(post)
		await AsyncStorage.setItem('@post', jsonValue)

		navigation.navigate('Home')
	}

	return (
		<PaperProvider>
			<Header navigation={navigation} />
		  <View >
				<ScrollView style={{width:'100%'}}>
					<View ><Text style={styles.header}>Animais próximos à sua localização...</Text></View>
					<View style={styles.container} >
						{posts.map(post => {
							return (
									post.aprovado && !post.status && post.dislike < 10 &&  (
										<TouchableOpacity
											key={post._id}
											onPress={() => {
												redirectHome(post, navigation)
										}}>
											<Surface style={styles.surface}>
													<Image style={styles.dogImage} resizeMode="cover" source={{ uri: `http://192.168.100.38:3333/files/${post.image}` }} />
											</Surface>
										</TouchableOpacity>
								)
							)
						})}
					</View>
				</ScrollView>
			</View>
		</PaperProvider>

	)
}

const styles = StyleSheet.create({
	container: {
    flex: 1,
    paddingHorizontal: 20,
    // paddingTop: 30,
    // alignContent: 'center',
    // alignItems: "center",
		marginTop: 10,
    // zIndex: -1,
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		flexWrap: 'wrap'
  },
	header: {
		fontSize: 18,
		fontWeight: 'bold',
		marginTop: 90,
		marginLeft: 20,
		alignItems: 'center',
		justifyContent: 'center'
	},
	marcador: {
		width: 37,
		height: 37,
	},

	dogImage: {
		width: 80,
		height: 80,
		alignSelf: 'center',

	},
	dogName: {
		fontWeight: 'bold',
		fontSize: 16,
		bottom: -50,
		top: 10,
		alignSelf: 'center',
	},
	title: {
		fontWeight: 'bold',
		fontSize: 18,
		alignSelf: 'center',
	},
	dogDesc: {
		color: '#666',
		marginTop: 5,
		bottom: -50,
		top: 10,
		alignSelf: 'center',
	},

  surface: {
    padding: 8,
    height: 80,
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
		marginTop: 10
  },
})

export default Admin