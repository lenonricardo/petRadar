import React, { Component } from 'react';
import api from '../services/api'
import * as ImagePicker from 'expo-image-picker'
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


export default class New extends Component {

	state = {
		preview: null,
		image: null,
		nome: '',
		email: '',
		senha: '',
		cidade: ''
	}

	handleSelectImage = async () => {
		let permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();

		if (permissionResult.granted === false) {
			alert("É preciso dar permissão para acesso à camera!");
			return;
		}

		let pickerResult = await ImagePicker.launchImageLibraryAsync();
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

			const data = new FormData();

			data.append('name', this.state.nome)
			data.append('email', this.state.email)
			data.append('password', this.state.senha)
			data.append('image', this.state.image)
			data.append('cidade', this.state.cidade)

			await api.post('/auth/register', data,
				{
					headers:
					{
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				});

			this.props.navigation.navigate('Login');
		} catch (error) {
			console.log(error)
		}

	}

	render() {
		const navigation = this.props.navigation

		return (
			<>
				<View style={styles.container} behavior="height" enabled>

					<KeyboardAvoidingView style={styles.form} behavior="height" enabled>
						<ScrollView>
							<TouchableOpacity style={styles.selectButton} onPress={this.handleSelectImage}>
								<Text style={styles.selectButtonText}>Selecionar Imagem</Text>
							</TouchableOpacity>

							{this.state.preview && <Image style={styles.preview} source={this.state.preview} />}

							<TextInput
								style={styles.input}
								autoCorrect={false}
								autoCapitalize="none"
								placeholder="Nome"
								placeholderTextColor="#999"
								onChangeText={nome => this.setState({ nome })}
							/>
							<TextInput
								style={styles.input}
								autoCorrect={false}
								autoCapitalize="none"
								placeholder="Cidade"
								placeholderTextColor="#999"
								onChangeText={cidade => this.setState({ cidade })}
							/>
							<TextInput
								style={styles.input}
								autoCorrect={false}
								autoCapitalize="none"
								placeholder="E-mail"
								placeholderTextColor="#999"
								onChangeText={email => this.setState({ email })}
							/>
							<TextInput
								style={styles.input}
								autoCorrect={false}
								secureTextEntry
								autoCapitalize="none"
								placeholder="Senha"
								placeholderTextColor="#999"
								onChangeText={senha => this.setState({ senha })}
							/>

							<TouchableOpacity style={styles.shareButton} onPress={() => this.handleSubmit()}>
								<Text style={styles.shareButtonText}>Cadastrar</Text>
							</TouchableOpacity>
							<TouchableOpacity style={styles.shareButton} onPress={() => this.props.navigation.navigate(`Login`)}>
								<Text style={styles.shareButtonText}>Voltar</Text>
							</TouchableOpacity>
						</ScrollView>
					</KeyboardAvoidingView>

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
		alignItems: "center"
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
})
