import { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";
import config from '../config/config';
import {httpService} from 'services/httpService.js';

const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";
const INIT_CHAT = "initChat";
const JOIN_CHAT = "joinChat";
const SOCKET_SERVER_URL = config.chatUrl;

const useChat = ({projectId, user, receiverFlag}) => {
  const [messages, setMessages] = useState([]);
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = socketIOClient(SOCKET_SERVER_URL);

    socketRef.current.on(NEW_CHAT_MESSAGE_EVENT, (message) => {
      let newMessage = message.data;
      if ((newMessage.ufrom === user.id) || (newMessage.uto === user.id)) {
        setMessages((messages) => [...messages, newMessage]);
        
        if (newMessage.uto === user.id) {    // when receive a message
          markMessageAsRead(newMessage.id);
        }
      }
      sendEmailToReceiver(newMessage);
    });

    socketRef.current.on(INIT_CHAT, ({ messages }) => {
      if (Array.isArray(messages.data)) {
        setMessages(messages.data);
        // when read previous unread messages
        markMessageProjectAsRead(projectId);
      }
    })

    socketRef.current.emit(JOIN_CHAT, {
      projectId: projectId,
      user: user,
      receiverFlag: receiverFlag,
    })

    return () => {
      socketRef.current.disconnect();
    };
  }, [projectId]);

  const getMessages = ({projectId, user, receiverFlag}) => {
    socketRef.current.emit(JOIN_CHAT, {
      projectId: projectId,
      user: user,
      receiverFlag: receiverFlag,
    })
  };

  const sendMessage = (messageBody, receiverFlag) => {
    socketRef.current.emit(NEW_CHAT_MESSAGE_EVENT, {
      body: messageBody,
      sender: user,
      receiverFlag: receiverFlag,
      projectId: projectId,
    });
  };

  const markMessageAsRead = (id) => {
    httpService.get('api/markChatMessage/' + id).then(res => {
      if (res.data.message == 'success') {
      }
      else {
      }
    }).catch((err) => {
    });
  }

  const markMessageProjectAsRead = (id) => {
    httpService.get('api/markChatMessageProject/' + id).then(res => {
      if (res.data.message == 'success') {
      }
      else {
      }
    }).catch((err) => {
    });
  }

  const sendEmailToReceiver = (data) => {
    httpService.post('api/sendEmailToReceiver', data).then(res => {
      return res;
    }).catch((err) => {
      console.log(err);
    });
  }

  return { messages, sendMessage, getMessages };
};

export default useChat;
