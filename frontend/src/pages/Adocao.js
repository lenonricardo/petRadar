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

	return (
		<PaperProvider>
			<Header navigation={navigation} />
		  <View style={styles.container} >
				<ScrollView style={{width:'100%'}}>
					<DataTable>
						<DataTable.Header>
							<DataTable.Title>Animal</DataTable.Title>
							<DataTable.Title>Descrição</DataTable.Title>
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
										}}>
										<DataTable.Cell><Image style={styles.marcador} source={post.animal == 'dog' ? dog : cat} /></DataTable.Cell>
										<DataTable.Cell>{post.description}</DataTable.Cell>
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
					<Dialog visible={visible} onDismiss={hideDialog}>
						<Dialog.Title style={styles.title}>Animal</Dialog.Title>
						<Dialog.Content>
							<Image style={styles.dogImage} resizeMode="cover" source={{ uri: `http://192.168.100.7:3333/files/${currentPost.image}` }} />
							<Text style={styles.dogName}>{currentPost.description}</Text>
							<Text style={styles.dogDesc}>{currentPost.aprovado}</Text>
						</Dialog.Content>
						<Dialog.Actions>
							<Button onPress={hideDialog}>Cancelar</Button>
							<Button onPress={() => handleSubmit()}>Aprovar</Button>
						</Dialog.Actions>
					</Dialog>
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
})

export default Adocao