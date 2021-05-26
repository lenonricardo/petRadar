import React, { Component } from 'react';
import api from '../services/api'
import * as ImagePicker from 'expo-image-picker'
import { RadioButton, Portal, Dialog, Button, Provider as PaperProvider } from 'react-native-paper';
import dog from '../resources/dog.png'
import cat from '../resources/cat.png'
import { MaterialIcons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
	View
	, StyleSheet
	, TouchableOpacity
	, Text
	, TextInput
	, Image
	, KeyboardAvoidingView
	, ScrollView
} from 'react-native';

import Header from './header'

export default class New extends Component {


	state = {
		preview: null,
		image: null,
		title: '',
		description: '',
		checkedAnimal: 'dog',
		porte: '',
		raca: ''
	}


	handleSelectImage = async () => {
		// let permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();
		let permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();

		if (permissionResult.granted === false) {
			alert("É preciso dar permissão para acesso à camera!");
			return;
		}

		let pickerResult = await ImagePicker.launchImageLibraryAsync();
		// let pickerResult = await ImagePicker.launchCameraAsync();
		let prefix
		let ext
		let fileName

		const preview = {
			uri: pickerResult.uri
		}

		if (pickerResult.uri) {
			[prefix, fileName] = pickerResult.uri.split('ImagePicker/')
		}

		ext = fileName.split('.')

		const image = {
			uri: pickerResult.uri,
			type: pickerResult.type + '/' + ext[1],
			name: fileName,
			allowsEditing: true,
			aspect: [4, 3],
		}

		this.setState({ preview, image })
	}


	handleSubmit = async () => {
		try {
			const currentRegion = this.props.navigation.getParam('currentRegion')
			const user = await AsyncStorage.getItem('@user')

			const data = new FormData();
			console.log(this.state.image)

			data.append('image', this.state.image)
			data.append('title', this.state.title)
			data.append('description', this.state.description)
			data.append('animal', this.state.checkedAnimal)
			data.append('porte', this.state.porte)
			data.append('raca', this.state.raca)
			data.append('user', JSON.parse(user)._id)

			await api.post('adocao', data,
				{
					headers:
					{
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				});

			this.props.navigation.navigate('Adocao', {
				showMessage: true
			});

			this.setState({ preview: null })
			this.setState({ image: null })
			this.setState({ title: '' })
			this.setState({ description: '' })
			this.setState({ checkedAnimal: 'dog' })
			this.setState({ porte: '' })
			this.setState({ raca: '' })

		} catch (error) {
			console.log(error)
		}
	}

	render() {
		const navigation = this.props.navigation

		return (

			<PaperProvider>
				<Header navigation={navigation} />
				<View style={styles.container} behavior="height" enabled>

					<KeyboardAvoidingView style={styles.form} behavior="height" enabled>
						<ScrollView>
							<TouchableOpacity style={styles.selectButton} onPress={this.handleSelectImage}>
								<MaterialIcons name="camera-alt" size={24} color="#666" />
								<Text style={styles.selectButtonText}> Selecionar Foto</Text>
							</TouchableOpacity>

							{this.state.preview && <Image style={styles.preview} source={this.state.preview} />}

							<TextInput
								style={styles.input}
								autoCorrect={false}
								autoCapitalize="none"
								placeholder="Título"
								placeholderTextColor="#999"
								value={this.state.title}
								onChangeText={title => this.setState({ title })}
							/>
							<TextInput
								style={styles.input}
								autoCorrect={false}
								autoCapitalize="none"
								placeholder="Descrição"
								placeholderTextColor="#999"
								value={this.state.description}
								onChangeText={description => this.setState({ description })}
							/>
							<TextInput
								style={styles.input}
								autoCorrect={false}
								autoCapitalize="none"
								placeholder="Porte"
								placeholderTextColor="#999"
								value={this.state.porte}
								onChangeText={porte => this.setState({ porte })}
							/>
							<TextInput
								style={styles.input}
								autoCorrect={false}
								autoCapitalize="none"
								placeholder="Raça"
								placeholderTextColor="#999"
								value={this.state.raca}
								onChangeText={raca => this.setState({ raca })}
							/>

							<View style={styles.check}>
								<TouchableOpacity style={styles.check} onPress={() => this.setState({ checkedAnimal: 'dog' })}>
									<Image style={styles.marcador} source={dog} />
									<RadioButton
										value="dog"
										status={this.state.checkedAnimal === 'dog' ? 'checked' : 'unchecked'}
										onPress={() => this.setState({ checkedAnimal: 'dog' })}
									/>
								</TouchableOpacity>
								<TouchableOpacity style={styles.check} onPress={() => this.setState({ checkedAnimal: 'cat' })}>
									<Image style={styles.marcador} source={cat} />
									<RadioButton
										value="cat"
										status={this.state.checkedAnimal === 'cat' ? 'checked' : 'unchecked'}
										onPress={() => this.setState({ checkedAnimal: 'cat' })}
									/>
								</TouchableOpacity>
							</View>

							<TouchableOpacity style={styles.shareButton} onPress={() => this.setState({ visible: true })}>
								<Text style={styles.shareButtonText}>Compartilhar</Text>
							</TouchableOpacity>
						</ScrollView>
					</KeyboardAvoidingView>

				</View>
{/*
				<Portal>
					<Dialog visible={this.state.visible} onDismiss={() => this.setState({ visible: false })}>
						<Dialog.Title>Nova Publicação</Dialog.Title>
						<Dialog.Content>
							<Text style={styles.dogDesc}>Sua Publicação será aprovada em até 30 minutos.</Text>
						</Dialog.Content>
						<Dialog.Actions>
							<Button onPress={() => this.setState({ visible: false })}>Cancelar</Button>
							<Button onPress={() =>  this.handleSubmit()}>Ok, entendi</Button>
						</Dialog.Actions>
					</Dialog>
				</Portal> */}
			</PaperProvider>

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
		zIndex: -1
	},
	form: {
		flex: 1,
		top: 60
	},

	selectButton: {
		borderRadius: 4,
		borderWidth: 1,
		borderColor: '#CCC',
		borderStyle: 'dashed',
		height: 42,
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},

	selectButtonText: {
		fontSize: 16,
		color: '#666',
	},

	preview: {
		width: 200,
		height: 200,
		marginTop: 10,
		alignSelf: 'center',
		borderRadius: 4,
	},

	input: {
		borderRadius: 4,
		borderWidth: 1,
		borderColor: '#ddd',
		padding: 15,
		marginTop: 10,
		fontSize: 16,
	},

	shareButton: {
		backgroundColor: '#71C7A6',
		borderRadius: 25,
		height: 42,
		marginTop: 15,
		width: 300,
		justifyContent: 'center',
		alignItems: 'center',
	},

	shareButtonText: {
		fontWeight: 'bold',
		fontSize: 16,
		color: '#FFF',
	},
	marcador: {
		width: 37,
		height: 37,
		marginLeft: 10,
		paddingLeft: 10
	},
	check: {
		flexDirection: 'row',
		marginTop: 15,
		justifyContent: 'center'
	},
	situacao: {
		fontSize: 16,
		color: '#666',
		marginTop: 10
	},
})
