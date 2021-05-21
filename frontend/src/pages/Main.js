import React, { useState, useEffect } from 'react'
import { StyleSheet, Image, Modal, View, Text, TouchableOpacity, Dimensions, LogBox } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import { FAB, Portal, Provider, Dialog, Button, Snackbar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Directions from "./directions";
import { requestPermissionsAsync, getCurrentPositionAsync } from 'expo-location'
import { MaterialIcons } from '@expo/vector-icons'
import Header from './header'
import dog from '../resources/dog.png'
import cat from '../resources/cat.png'

import api from '../services/api'

function Main({ navigation }) {
	const [posts, setPosts] = useState([])
	const [image, setImage] = useState([])
	const [title, setTitle] = useState([])
	const [desc, setDesc] = useState([])
	const [animal, setAnimal] = useState([])
	const [situacao, setSituacao] = useState([])
	const [coord, setCoord] = useState([])
	const [coordAux, setCoordAux] = useState([null])
	const [currentRegion, setCurrentRegion] = useState(null)
	const [postId, setPostId] = useState(null)
	const [modalVisible, setModalVisible] = useState(false)
	const [dialogVisible, setDialogVisible] = useState(false)
	const [state, setState] = useState({ open: false })
	const [status, setStatus] = useState(false)
  const [visible, setVisible] = useState(false);
  const [region, setRegion] = useState({});
  const [likes, setLikes] = useState({});
  const [dislikes, setDislikes] = useState({});
  const [user, setUser] = useState({});
  const [userLogado, setUserLogado] = useState({});
  const [nivelDialog, setNivelDialog] = useState(false);

  const onToggleSnackBar = () => setVisible(!visible);

  const onDismissSnackBar = () => setVisible(false);

	const userData = async () => {
		try {
			const jsonValue = await AsyncStorage.getItem('@user')
			return jsonValue
		} catch (e) {
			console.log(e)
		}
	}


	const onStateChange = ({ open }) => setState({ open })
	const { open } = state;

	useEffect(async () => {
		LogBox.ignoreAllLogs()

		if (Object.keys(userLogado).length === 0) {
			userData().then((value) => {
				setUserLogado(JSON.parse(value))
			})
		}

		navigation.addListener("didFocus", () => {
			// setTimeout(() => {
			// 	const post = navigation.getParam('publicacao')
			// 	console.log(post)

			// 	if (post) {
			// 		setImage(post.image)
			// 		setTitle(post.title)
			// 		setDesc(post.description)
			// 		setSituacao(post.situacao)
			// 		setCoordAux({
			// 			latitude: post.location.coordinates[1],
			// 			longitude: post.location.coordinates[0]
			// 		})

			// 		setModalVisible(true)
			// 	}
			// }, 1000)
    });

		async function loadInitialPosion() {
			const { granted } = await requestPermissionsAsync()

			if (granted) {
				const { coords } = await getCurrentPositionAsync({
					enableHighAccuracy: true
				})

				const { latitude, longitude } = coords
				latitudeInicial = latitude;
				longitudeInicial = longitude;

				setCoord({
					latitude: latitudeInicial,
					longitude: longitudeInicial
				})

				setCurrentRegion({
					latitude,
					longitude,
					latitudeDelta: 0.002,
					longitudeDelta: 0.002,
				})
			}
		}

		loadInitialPosion()
	}, [])

	async function loadPosts() {
		const { latitude, longitude } = currentRegion

		const response = await api.get('/search', {
			params: {
				latitude,
				longitude
			}
		})

		// console.log(response.data.posts)

		setPosts(response.data.posts)
		//console.log(response.data.posts)
	}

	function handleRegionChanged(region) {
		setCurrentRegion(region)
		loadPosts()
	}


	if (!currentRegion) {
		return null
	}

	function handleGetGoogleMapDirections() {

		console.log('chegou aqui')
		setModalVisible(!modalVisible)

		setCoord(coordAux)

	};

	function handleGetGoogleMapDirections() {
		setModalVisible(!modalVisible)
		setCoord(coordAux)
	};

	async function handleLike () {
		try {
			const post = await api.put('likesDislikes/like/' + postId);
			console.log(post.data)
			setLikes(post.data.post.like)
		} catch (error) {
			console.log(error)
		}
	}

	async function handleDislike () {
		try {
			const post = await api.put('likesDislikes/dislike/' + postId);
			setDislikes(post.data.post.dislike)
		} catch (error) {
			console.log(error)
		}
	}

	async function handleEncontrado () {
		try {
			setDialogVisible(false)
			setModalVisible(false)
			const post = await api.put('likesDislikes/encontrado/' + postId);
			const respUser = await api.put('likesDislikes/nivel/' + userLogado._id);
			const dataUser = respUser.data.user
			console.log(dataUser.nivel)

			setUserLogado(dataUser)
			if (dataUser.nivel > 1) {
				setNivelDialog(true)
			}

			const jsonValue = JSON.stringify(dataUser)
			await AsyncStorage.setItem('@user', jsonValue)
			loadPosts()
		} catch (error) {
			console.log(error)
		}
	}


	return (
		<>
			<MapView provider="google" onRegionChangeComplete={handleRegionChanged} initialRegion={currentRegion} style={styles.map}>

				{posts.map(post => {
					return (
						post.aprovado && !post.status &&  (
							<Marker
								key={post._id}
								coordinate={{
									latitude: post.location.coordinates[1],
									longitude: post.location.coordinates[0]
								}} onPress={() => {
									console.log(post)
									setModalVisible(true);
									setImage(post.image)
									setTitle(post.title)
									setDesc(post.description)
									setSituacao(post.situacao)
									setPostId(post._id)
									setLikes(post.like)
									setDislikes(post.dislike)
									setPostId(post._id)
									setCoordAux({
										latitude: post.location.coordinates[1],
										longitude: post.location.coordinates[0]
									})
									setUser(post.user)
									console.log(post.image)
								}}>
								{/* <View style={styles.raio}></View> */}
								<Image style={styles.marcador} source={post.animal == 'dog' ? dog : cat} />


								<Modal
									animationType="none"
									transparent={true}
									visible={modalVisible}
									onRequestClose={() => {
										setModalVisible(!modalVisible)
										setVisible(true)
									}}

								>
									<View style={styles.modalNew}>
										<Image style={styles.dogImage} resizeMode="cover" source={{ uri: `http://192.168.100.7:3333/files/${image}` }} />
										<Text style={styles.dogName}>{title}</Text>
										<Text style={styles.dogName}>{desc}</Text>
										<Text style={styles.dogDesc}>{situacao}</Text>

										<View style={styles.thumb}>
											<TouchableOpacity onPress={handleLike} >
												<View style={styles.like}>
													<MaterialIcons style={styles.thumbUp} name="thumb-up" size={30} color="#000" />
													<Text style={styles.likeText}>{likes}</Text>
												</View>
											</TouchableOpacity>
											<TouchableOpacity onPress={handleDislike} >
												<View style={styles.like}>
													<Text style={styles.dislikeText}>{dislikes}</Text>
													<MaterialIcons style={styles.thumbDown} name="thumb-down" size={30} color="#000" />
												</View>
											</TouchableOpacity>
										</View>

										<Text style={styles.userName}>{user.name}</Text>
										<Text style={styles.userLocation}>{user.cidade}</Text>
										<Image style={styles.profileImage} resizeMode="cover" source={{ uri: `http://192.168.100.7:3333/files/${user.image}` }} />
										<Provider>
											<Portal>
												<FAB.Group style={styles.opcoes}
													open={open}
													icon={open ? 'chevron-down' : 'plus'}
													fabStyle={{ backgroundColor: '#71C7A6' }}
													color={'#fff'}
													actions={[
														{
															icon: 'checkbox-marked-circle',
															label: 'Marcar como Encontrado',
															color: '#7FBF7F',
															onPress: () => {
																if (user._id != userLogado._id) {
																	setDialogVisible(true)
																} else {
																	handleEncontrado()
																}
															},
														},
														{
															icon: 'crosshairs-gps',
															label: 'Realizar Rota',
															color: '#22a7f0',
															onPress: handleGetGoogleMapDirections,
														},
														{
															icon: 'chat-processing',
															label: 'Conversar',
															color: '#e26a6a',
															onPress: () => { navigation.navigate('Chat'); setModalVisible(!modalVisible) },
														},
													]}
													onStateChange={onStateChange}
													onPress={() => {
														if (open) {
															// do something if the speed dial is open
														}
													}}
												/>
											</Portal>
											<Portal>
												<Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false) }>
													<Dialog.Title>Ação não permitida</Dialog.Title>
													<Dialog.Content>
														<Text style={styles.dogDesc}>Somente o autor da publicação pode marcar o Animal como encontrado!</Text>
													</Dialog.Content>
													<Dialog.Actions>
														<Button onPress={() =>  setDialogVisible(false)}>Ok, entendi</Button>
													</Dialog.Actions>
												</Dialog>
											</Portal>
										</Provider>
										<TouchableOpacity onPress={() => { setNivelDialog(!modalVisible)} } style={styles.loadButton}>
											<Text style={{ color: "#fff", fontWeight: "bold", fontSize: 20 }}>Fechar</Text>
										</TouchableOpacity>
									</View>
								</Modal>
							</Marker>
						)
					)
				})}

				<Marker coordinate={{ latitude: latitudeInicial, longitude: longitudeInicial }}>
					<MaterialIcons name="person-pin-circle" size={50} color="#71C7A6" />
				</Marker>
				<Provider>
					<Portal>
						<Dialog visible={nivelDialog} onDismiss={() => setNivelDialog(false) }>
							<Dialog.Title>Parabéns!</Dialog.Title>
							<Dialog.Content>
								<Text style={styles.dogDesc}>Você ajudou a recuperar {userLogado.recuperados} animais</Text>
								<Text style={styles.dogDesc}>e subiu para o nível {userLogado.nivel}.</Text>
							</Dialog.Content>
							<Dialog.Actions>
								<Button onPress={() =>  setNivelDialog(false)}>Fechar</Button>
							</Dialog.Actions>
						</Dialog>
					</Portal>
				</Provider>

				{coord && (
					<Directions
						destination={coord}
						origin={{ latitude: latitudeInicial, longitude: longitudeInicial }} />

				)}
			</MapView>

			<Header navigation={navigation} />

			<TouchableOpacity onPress={() => {
				//navegação
				navigation.navigate('Postar', { currentRegion })
			}} style={styles.addButton}>
				<MaterialIcons name="pets" size={20} color="#FFF" />
			</TouchableOpacity>

			<View style={styles.container}>
				{/* <Button onPress={onToggleSnackBar}>{visible ? 'Hide' : 'Show'}</Button> */}
				<Snackbar
					visible={visible}
					onDismiss={onDismissSnackBar}
					action={{
						label: 'Fechar',
						onPress: () => {
							// Do something
						},
					}}>
					Sua publicação será aprovada em até 30 minutos.
				</Snackbar>
			</View>

		</>

	)
}

const styles = StyleSheet.create({
	map: {
		flex: 1
	},
	marcador: {
		width: 37,
		height: 37,
		//borderRadius: 4,
		//borderWidth: 4,
		//borderColor: '#fff'
	},
	callout: {
		width: 190,
		height: 200
	},
	calloutText: {
		height: 100
	},
	dogName: {
		fontWeight: 'bold',
		fontSize: 16,
		bottom: -50,
		top: 10
	},
	dogDesc: {
		color: '#666',
		marginTop: 5,
		marginBottom: 20,
		top: 10
	},
	userName: {
		fontWeight: 'bold',
		color: '#63af92',
		fontSize: 16,
		bottom: -50,
		top: 325,
		left: 90,
		position: "absolute"
	},
	userLocation: {
		color: '#63af92',
		marginTop: 5,
		bottom: -50,
		top: 60,
		top: 335,
		left: 90,
		position: "absolute"
	},
	dogImage: {
		width: 200,
		height: 200,
		borderRadius: 50,
		alignSelf: 'center',
		// transform: [{ rotate: '90deg' }]

	},
	profileImage: {
		width: 60,
		height: 60,
		borderRadius: 100,
		position: "absolute",
		top: 310,
		left: 20
	},
	searchForm: {
		position: 'absolute',
		top: 20,
		left: 20,
		right: 20,
		zIndex: 5,
		flexDirection: 'row',
	},

	searchInput: {
		flex: 1,
		height: 50,
		backgroundColor: '#FFF',
		color: '#333',
		borderRadius: 25,
		paddingHorizontal: 20,
		fontSize: 16,
		shadowColor: '#000',
		shadowOpacity: 0.2,
		shadowOffset: {
			width: 4,
			height: 4
		},
		elevation: 2
	},

	loadButton: {
		width: 200,
		height: 50,
		backgroundColor: '#71C7A6',
		borderRadius: 10,
		justifyContent: 'center',
		alignItems: 'center',
		top: 80
		// marginLeft: 15

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
		width: 50,
		height: 50,
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
		top: 305,
		left: 200
	},
	modalNew: {
		flex: 1,
		marginTop: 230,
		margin: 50,
		bottom: 100,
		padding: 22,
		borderRadius: 25,
		shadowRadius: 10,
		shadowColor: '#000',
		borderColor: '#ccc',
		backgroundColor: '#fff',
		alignContent: "center",
		alignItems: "center",
	},
	header: {
		flex: 1,
		height: 80,
		backgroundColor: '#71C7A6',
		color: '#fff',
		paddingHorizontal: 20,
		fontSize: 16,
		top: 0,
		position: 'absolute',
		flexDirection: 'row',
		width: Dimensions.get('window').width
	},
	menuIcon: {
		top: 40,
		width: 25,
		height: 25

	},

	logo: {
		left: 40,
		top: 8
	},
	thumb: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: '100%',
		top: -30
	},
	thumbUp: {
		paddingRight: 10,
		color: '#7FBF7F'
	},
	thumbDown: {
		paddingLeft: 10,
		color: '#D26A6A'
	},
	raio:
	{
		backgroundColor: '#D26A6A',
		width: 150,
		height: 150,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 80,
		opacity: 0.4,
		position: "absolute",
		top: -55,
		left: -55
	},
	location: {
		justifyContent: 'center',
		alignItems: 'center',
		position: 'absolute',
		bottom: 40,
		flexDirection: 'row',
		top: 140,
		left: 40
	},
	like: {
		flexDirection: 'row'
	},
	likeText: {
		color: '#7FBF7F',
		marginBottom: 20,
		top: 10
	},
	dislikeText: {
		color: '#D26A6A',
		marginBottom: 20,
		top: 10
	},
})

export default Main