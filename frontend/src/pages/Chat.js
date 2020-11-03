import React, { Component } from "react";
import { TextInput, StyleSheet, Text, View } from "react-native";
import io from "socket.io-client";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chatMessage: "",
      chatMessages: [],
      id: ''
    };
  }

  componentDidMount() {
    this.socket = io("http://192.168.100.22:3333", { transports: ["websocket"] });



    this.socket.on('connect', a =>{
      this.state.id = this.socket.id;
      console.log(this.state.id)
      console.log(this.socket.id)
    })

    this.socket.on("chat message", msg => {
      this.setState({ chatMessages: [...this.state.chatMessages, msg] });
    });
  }

  submitChatMessage() {

   // console.log(this.socket)
   console.log(this.socket.id)
   console.log(this.state.id)
    this.socket.emit("chat message", this.state.chatMessage);
    this.setState({ chatMessage: "" });
    this.state.id = this.socket.id;
  }

  render() {
    const chatMessages = this.state.chatMessages.map(chatMessage => (
      <View style={this.state.id == this.socket.id ? styles.right : styles.left}>
        <Text key={chatMessage}>{chatMessage}</Text>
      </View>
    ));

    return (
      <View style={styles.container}>
        <TextInput
          style={{ height: 60, borderWidth: 2 }}
          autoCorrect={false}
          value={this.state.chatMessage}
          onSubmitEditing={() => this.submitChatMessage()}
          onChangeText={chatMessage => {
            this.setState({ chatMessage });
          }}
        />
        {chatMessages}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF"
  },
  left:{
    // flex: 1,
    alignItems: "flex-start",
  },
  right:{
    // flex: 1,
    alignItems: "flex-end",
  },

});