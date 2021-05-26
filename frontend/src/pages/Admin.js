import React, { useState, useEffect } from 'react'
import { DataTable, Button, Paragraph, Dialog, Portal, Provider as PaperProvider } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons'

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

function Admin ({ navigation }) {

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
		  <View style={styles.container} >
				<ScrollView style={{width:'100%'}}>
					<View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
						<View><Text style={styles.header}>Aprovar Publicações</Text></View>
						<TouchableOpacity onPress={() => {
							navigation.navigate('Login')
						}}>
							<MaterialIcons name="exit-to-app" size={20} color="#000" />
						</TouchableOpacity>
					</View>
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
							<Image style={styles.dogImage} resizeMode="cover" source={{ uri: `http://192.168.100.38:3333/files/${currentPost.image}` }} />
							<Text style={styles.dogName}>{currentPost.description}</Text>
							<Text style={styles.dogDesc}>{currentPost.aprovado}</Text>
						</Dialog.Content>
						<Dialog.Actions>
							<Button onPress={hideDialog}>Cancelar</Button>
							<Button onPress={() => handleSubmit()}>Aprovar</Button>
						</Dialog.Actions>
					</Dialog>
				</Portal>
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
})

export default Admin