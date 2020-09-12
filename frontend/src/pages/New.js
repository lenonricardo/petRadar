import React, { Component } from 'react';
import api from '../services/api'
import * as ImagePicker from 'expo-image-picker'
import { RadioButton} from 'react-native-paper';
import dog from '../resources/dog.png'
import cat from '../resources/cat.png'

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
       } from 'react-native';

import Header from './header'

export default class New extends Component {


  state = {
    preview: null,
    image: null,
    title: '',
    description: '',
    checkedAnimal: 'dog',
    checkedSituacao: 'perdido',
    // hashtags: '',
    // comment: '',
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
      [prefix, fileName] = pickerResult.uri.split('ImagePicker/')    }

    ext = fileName.split('.')

    const image = {
      uri: pickerResult.uri,
      type: pickerResult.type + '/' +ext[1],
      name: fileName,
      allowsEditing: true,
      aspect: [4, 3],
    }

    this.setState({ preview, image })
  }


  handleSubmit = async () => {
    try {
      carregar = true

      const currentRegion = this.props.navigation.getParam('currentRegion')

      const data = new FormData();
      console.log(this.state.image)

      data.append('image', this.state.image)
      data.append('title', this.state.title)
      data.append('description', this.state.description)
      data.append('latitude', currentRegion.latitude)
      data.append('longitude', currentRegion.longitude)
      data.append('animal', this.state.checkedAnimal)
      data.append('situacao', this.state.checkedSituacao)
      // data.append('hashtags', this.state.hashtags);
      // data.append('comment', this.state.comment)

      // console.log(data)

      await api.post('posts', data,
      {
        headers:
        {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      this.props.navigation.navigate('Home');

    } catch (error) {
      console.log(error)
    }
  }

  render() {
    const navigation = this.props.navigation
    let carregar = false;

    return (
      
      <>
      <Header navigation={navigation}/>
      <View style={styles.container} behavior="height" enabled>
      
        
        <View>
        <ActivityIndicator style={{top: 150}} animating={carregar} hidesWhenStopped={true} size="large" color="#71C7A6" />
        </View>

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
          placeholder="Descrição"
          placeholderTextColor="#999"
          value={this.state.description}
          onChangeText={description => this.setState({ description })}
        />

      <View style={styles.check}>
          <TouchableOpacity style={styles.check} onPress={() => this.setState({checkedAnimal: 'dog'})}>
            <Image style={styles.marcador} source={dog} />
            <RadioButton
              value="dog"
              status={ this.state.checkedAnimal === 'dog' ? 'checked' : 'unchecked' }
              onPress={() => this.setState({checkedAnimal: 'dog'})}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.check} onPress={() => this.setState({checkedAnimal: 'cat'})}>
            <Image style={styles.marcador} source={cat} />
            <RadioButton
              value="cat"
              status={ this.state.checkedAnimal === 'cat' ? 'checked' : 'unchecked' }
              onPress={() => this.setState({checkedAnimal: 'cat'})}              
            />
          </TouchableOpacity>
      </View>

      <View style={styles.check}>
          <TouchableOpacity style={styles.check} onPress={() => this.setState({checkedSituacao: 'perdido'})}>
            
            <RadioButton
              value="perdido"
              status={ this.state.checkedSituacao === 'perdido' ? 'checked' : 'unchecked' }
              onPress={() => this.setState({checkedSituacao: 'perdido'})}
            />
            <Text style={styles.situacao}>Perdido</Text>            
          </TouchableOpacity>
          <TouchableOpacity style={styles.check} onPress={() => this.setState({checkedSituacao: 'abandonado'})}>
            <RadioButton
              value="abandonado"
              status={ this.state.checkedSituacao === 'abandonado' ? 'checked' : 'unchecked' }
              onPress={() => this.setState({checkedSituacao: 'abandonado'})}
            />
            <Text style={styles.situacao}>Abandonado</Text>
          </TouchableOpacity>
      </View>

        <TouchableOpacity style={styles.shareButton} onPress={() => this.handleSubmit()}>
        	<Text style={styles.shareButtonText}>Compartilhar</Text>
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
  form:{
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
  marcador: {
    width: 37,
    height: 37,
    marginLeft: 10,
    paddingLeft:10
  },
  check:{
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
