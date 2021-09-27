import React, { Component } from 'react';
import axios from 'axios';
import Pusher from 'pusher-js';
import ChatList from './ChatList';
import ChatBox from './ChatBox';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      username: '',
      appointment: '',
      chats: []
    };
  }

  componentDidMount() {
    let token = window.prompt('Enter Token', 'paste token here');
    //verfiy and decode token
    try {
      const decoded = jwt_decode(token);
      let username = decoded.username;
      let appointment = decoded.appointmentid
      this.setState({ username });
      this.setState({ appointment });
      
      // append previous messages
      let url = 'https://chat-api-x.herokuapp.com/chatApi/getChat/' + appointment + '?page=1&limit=30';
      axios.get(url).then(result => {
        console.log(result.data.messages)
        let chats = result.data.messages
        this.setState({ chats })
      })

      const pusher = new Pusher('860995510ee9701b6238', {
        cluster: 'ap2',
        encrypted: true,
        authEndpoint: "https://chat-api-x.herokuapp.com/chatApi/p_auth",
        auth : {
          params: {
            appointment,
            username
          }
        }
      });
      console.log("This is appointment: ", appointment)
      //this works
      const channel = pusher.subscribe("private-" + appointment);
      console.log(channel)
    
      channel.bind('inserted', data => {
        this.setState({ chats: [...this.state.chats, data]});
        console.log("This is data: ", data)
      });
    
      this.handleTextChange = this.handleTextChange.bind(this);
    } catch (e) {
      console.log('token error', e)
    }
  }
  
  
  handleTextChange(e) {
    if (e.keyCode === 13) {
      const payload = {
        username: this.state.username,
        appointment: this.state.appointment,
        text: this.state.text
      };
      axios.post('https://chat-api-x.herokuapp.com/chatApi/sendMsg', payload);
    } else {
      this.setState({ text: e.target.value });
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to reALTIME Chat</h1>
        </header>
        <section>
          <ChatList chats={this.state.chats} />
          <ChatBox
            text={this.state.text}
            username={this.state.username}
            handleTextChange={this.handleTextChange}
          />
        </section>
      </div>
    );
  }
}

export default App;
