import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, ToastAndroid } from 'react-native';
import api from '../services/api'
import google from '../resources/google.png'
import { HelperText } from 'react-native-paper';

export default class Login extends React.Component {
    
  state = {
    email:'',
    password:''
  }

  LogarUsuario = async () => {
    if(this.state.email == '' || this.state.password == '')
      ToastAndroid.show("Preencha o email e a senha!", ToastAndroid.SHORT);
    else
    {
      try {
        // const data = new FormData();

        // data.append('email', this.state.email)
        // data.append('password', this.state.password)
        // console.log(data)
        var data = {'email': this.state.email, 'password': this.state.password}

        await api.post('auth/authenticate', data,
        {
          headers:
          {       
            'Content-Type': 'application/json'
          }       
        })
        
        this.props.navigation.navigate('Home');

      } catch (error) {
        // this.props.navigation.navigate('Login');
        ToastAndroid.show("Usuário ou Senha Inválidos", ToastAndroid.SHORT);
        console.log(error)
      }
    }  
    
  }

  

  render(){
    const navigation = this.props.navigation
    return (
        
      <View style={styles.container}>
        {/* <Text style={styles.logo}>petRadar</Text> */}
        <Image
            source={require('../resources/logo-trans.png')}
            style={styles.logo}
        />
        <View style={styles.inputs}>
            <View style={styles.inputView} >
            <TextInput  
                style={styles.inputText}
                placeholder="Email..." 
                placeholderTextColor="#999"
                onChangeText={text => this.setState({email:text})}/>
            </View>
            <View style={styles.inputView} >
            <TextInput  
                secureTextEntry
                style={styles.inputText}
                placeholder="Senha..."                 
                placeholderTextColor="#999"
                onChangeText={text => this.setState({password:text})}/>
            </View>
            <TouchableOpacity>
            <Text style={styles.forgot}>Esqueceu a senha?</Text>
            </TouchableOpacity>
            <TouchableOpacity
             onPress={() => {
              //navegação
              this.LogarUsuario();
              
          }} style={styles.loginBtn}>
            <Text style={styles.loginText}>ENTRAR</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
             style={styles.loginGoogle}>
                <Image source={google} />
              
            </TouchableOpacity> */}
            <TouchableOpacity  
            onPress={() => {
              //navegação
              this.props.navigation.navigate('Cadastro');
          }}>
            <Text style={styles.loginText}>Cadastrar-se</Text>
            </TouchableOpacity>
        </View>  
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#71C7A6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo:{
    top: 60
  },
  inputView:{
    width:"80%",
    backgroundColor:"#fff",
    borderRadius:25,
    height:50,
    marginBottom:20,
    justifyContent:"center",
    padding:20,
  },
  inputText:{
    height:50,
    color:"#000",
  },
  forgot:{
    color:"white",
    fontSize:13
  },
  loginBtn:{
    width:"80%",
    backgroundColor:"#689f89",
    borderRadius:25,
    height:50,
    alignItems:"center",
    justifyContent:"center",
    marginTop:10,
    marginBottom:10
  },
  loginText:{
    color:"#fff",
    fontWeight:"bold",
    fontSize: 15

  },
  inputs:{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      top: -30
  },
  loginGoogle:{
    // width:"80%",
    // backgroundColor:"#ffffff",
    borderRadius:10,
    height:40,
    // alignItems:"center",
    // justifyContent:"center",
    // marginTop:40,
    marginBottom:10,
    justifyContent: 'flex-start'
  },
});