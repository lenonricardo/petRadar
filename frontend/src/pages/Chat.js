import React, { useState, useCallback, useEffect } from 'react'
import { YellowBox, View, StyleSheet, Text, Image} from 'react-native';
import Header from './header'
import { GiftedChat } from 'react-native-gifted-chat'
import io from "socket.io-client";
import session from '../services/session'
import AsyncStorage from '@react-native-async-storage/async-storage';

export function Chat({ navigation }) {
  const [messages, setMessages] = useState([]);
  const [id, setId] = useState('');
  const [usuario, setUsuario] = useState('');
  const socket = io("http://192.168.100.38:3333", { transports: ["websocket"] });

  useEffect(async () => {
		const jsonValue = await AsyncStorage.getItem('@user')
		const user = JSON.parse(jsonValue)
    setId(user._id)
		setUsuario(navigation.getParam('user'))

    YellowBox.ignoreWarnings(['Setting a timer']);

    socket.on("chat message", msg => {
      // setMessages(previousMessages => GiftedChat.append(previousMessages, msg))
      setMessages((prevMsgs) => GiftedChat.append(prevMsgs, msg))
      // this.setState({ chatMessages: [...this.state.chatMessages, msg] });
    });

  }, [])

  const onSend = useCallback((messages = []) => {

    messages.forEach((msg)=>{
      console.log(msg)
      const { text, user } = msg;
      const message = {_id: user._id , text, user, createdAt: new Date().getTime() };
      socket.emit("chat message", message);
    })

    // setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
  }, [])

  return (
    <View style={{flex: 1}}>
      <Header navigation={navigation} />
			<View style={{ position: 'absolute', zIndex: 9999}}>
				<Text style={styles.userName}>{usuario.name}</Text>
				<Text style={styles.userLocation}>{usuario.cidade}</Text>
				<Image style={styles.profileImage} resizeMode="cover" source={{ uri: `http://192.168.100.38:3333/files/${usuario.image}` }} />
			</View>
      <View style={{flex: 1}}>
        <GiftedChat
          messages={messages}
          onSend={messages => onSend(messages)}
          user={{
            _id: id

          }
          }
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
	userName: {
		fontWeight: 'bold',
		color: '#63af92',
		fontSize: 16,
	},
	userLocation: {
		color: '#63af92',
	},

})

export default Chat