import React, { useState, useEffect } from 'react'
import { DataTable, Button, Paragraph, Dialog, Portal, Provider as PaperProvider } from 'react-native-paper';
import { MaterialIcons, AntDesign } from '@expo/vector-icons'
import Header from './header'


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

function Adocao ({ navigation }) {

	const [posts, setPosts] = useState([])
	const [currentPost, setCurrentPost] = useState([])
	const [visible, setVisible] = React.useState(false);
	const [userPost, setUserPost] = React.useState({});

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);


	useEffect(() => {
		loadPosts()

		navigation.addListener("didFocus", async () => {
			hideDialog()
			loadPosts()
		})

	}, [])

	async function loadPosts() {
		const response = await api.get('/adocao')

		setPosts(response.data.anuncios)
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

	return (
		<PaperProvider>
			<Header navigation={navigation} />
		  <View style={styles.container} >
				<ScrollView style={{width:'100%'}}>
					<DataTable>
						<DataTable.Header>
							<DataTable.Title></DataTable.Title>
							<DataTable.Title>Animal</DataTable.Title>
							<DataTable.Title>Título</DataTable.Title>
						</DataTable.Header>

						{posts.map(post => {
							return (
								!post.aprovado &&
								(
									<DataTable.Row key={post.id}
										onPress={() => {
											showDialog()
											console.log(post)
											setCurrentPost(post)
											setUserPost(post.user)
										}}>
										<DataTable.Cell><Image style={styles.imageANimal} resizeMode="cover" source={{ uri: `http://192.168.100.38:3333/files/${post.image}` }} /> </DataTable.Cell>
										<DataTable.Cell><Image style={styles.marcador} source={post.animal == 'dog' ? dog : cat} /></DataTable.Cell>
										<DataTable.Cell>{post.title}</DataTable.Cell>
									</DataTable.Row>
								)
							)
						})}

						<DataTable.Pagination
							page={1}
							numberOfPages={1}
							onPageChange={page => {
								console.log(page);
							}}
							label="1-1 de 1"
						/>
					</DataTable>
				</ScrollView>
				<Portal>
					{ currentPost &&
						<Dialog visible={visible} onDismiss={hideDialog}>
							<Dialog.Title style={styles.title}><Image style={styles.marcador} source={currentPost.animal == 'dog' ? dog : cat} /></Dialog.Title>
							<Dialog.Content>
								<Image style={styles.dogImage} resizeMode="cover" source={{ uri: `http://192.168.100.38:3333/files/${currentPost.image}` }} />
								<Text style={styles.dogName}>{currentPost.title}</Text>
								<Text style={styles.dogDesc}>Descrição: {currentPost.description}</Text>
								<Text style={styles.dogDesc}>Porte: {currentPost.porte}</Text>
								<Text style={styles.dogDesc}>Raça: {currentPost.raca}</Text>
								<View style={styles.userData}>
									<Image style={styles.profileImage} resizeMode="cover" source={{ uri: `http://192.168.100.38:3333/files/${userPost.image}` }} />
									<Text style={styles.userName}>{userPost.name}</Text>
									<Text style={styles.userLocation}>{userPost.cidade}</Text>
									<TouchableOpacity onPress={() => {
										hideDialog()
										navigation.navigate('Chat', {user: userPost})
									}} style={styles.chatButton}>
										<MaterialIcons name="chat" size={20} color="#FFF" />
									</TouchableOpacity>
								</View>
							</Dialog.Content>
							<Dialog.Actions>
								<Button onPress={hideDialog}>Fechar</Button>
							</Dialog.Actions>
						</Dialog>
					}
				</Portal>
				<TouchableOpacity onPress={() => {
					navigation.navigate('Anuncio')
				}} style={styles.addButton}>
					<AntDesign name="plus" size={20} color="#FFF" />
				</TouchableOpacity>
			</View>
		</PaperProvider>

	)
}

const styles = StyleSheet.create({
	container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
    alignContent: 'center',
    alignItems: "center",
    zIndex: -1,
		marginTop: 40
  },
	header: {
		fontSize: 18,
		fontWeight: 'bold',
		marginTop: 10,
		alignItems: 'center',
		justifyContent: 'center'
	},
	marcador: {
		width: 37,
		height: 37,
	},

	imageANimal: {
		width: 70,
		height: 70,
		borderRadius: 40,
	},

	dogImage: {
		width: 200,
		height: 200,
		borderRadius: 50,
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

	addButton: {
		width: 60,
		height: 60,
		backgroundColor: '#71C7A6',
		borderRadius: 40,
		justifyContent: 'center',
		alignItems: 'center',
		marginLeft: 15,
		position: 'absolute',
		bottom: 40,
		//left: 20,
		right: 20,
		zIndex: 5,
		flexDirection: 'row',
	},
	chatButton: {
		width: 60,
		height: 60,
		backgroundColor: '#71C7A6',
		borderRadius: 40,
		justifyContent: 'center',
		alignItems: 'center',
		marginLeft: 120,
		right: 20,
		zIndex: 5,
		flexDirection: 'row',
	},


	userData: {
		alignItems: 'center',
		flexDirection: 'row',
		marginTop: 30,
		marginBottom: -20
	},

	userName: {
		fontWeight: 'bold',
		color: '#63af92',
		fontSize: 16,
	},
	userLocation: {
		color: '#63af92',
	},
	profileImage: {
		width: 60,
		height: 60,
		borderRadius: 100,
		marginRight: 10
	},
})

export default Adocao