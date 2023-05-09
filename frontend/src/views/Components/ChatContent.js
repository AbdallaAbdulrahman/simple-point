import React, {useEffect, useState} from "react";
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import NavPills from "components/NavPills/NavPills.js";

import useChat from "../../services/useChat";

import "./style/ChatContent.css";
import { makeStyles } from "@material-ui/core/styles";
import styles from "./style/mainStyle.js";

const useStyles = makeStyles(styles);

const ChatContent = (props) => {

  const classes = useStyles();

  const projectId = props.projectId;
  
  const [newMessage, setNewMessage] = React.useState("");
  const [receiverFlag, setReceiverFlag] = React.useState(true);
  const { messages, sendMessage, getMessages } = useChat({projectId: projectId, user: props.user, receiverFlag: receiverFlag});

  const handleNewMessageChange = (event) => {
    setNewMessage(event.target.value);
  };

  const handleSendMessage = () => {
    if (newMessage !== ""){
      sendMessage(newMessage, receiverFlag);
      setNewMessage("");
    }
  };

  const handleKeypress = e => {
    if (e.key === 'Enter') {
      e.preventDefault();      
      handleSendMessage();
    }
  };

  const handleTabChange = () => {
    setReceiverFlag(!receiverFlag);
    getMessages({projectId: projectId, user: props.user, receiverFlag: !receiverFlag})
  };

  const getDate = (date, format) => {
    const mDate		= {
      'S': date.getSeconds(),
      'M': date.getMinutes(),
      'H': date.getHours(),
      'd': date.getDate(),
      'm': date.getMonth() + 1,
      'Y': date.getFullYear()
    }

    // Apply format and add leading zeroes
    return format.replace(/([SMHdmY])/g, function(key){return (mDate[key] < 10 ? '0' : '') + mDate[key];});
  }

  const getPreviousDay = (date = new Date()) => {
    const previous = new Date(date.getTime());
    previous.setDate(date.getDate() - 1);
  
    return previous;
  }

  const newFormatOfMessageTime = (time) => {
    const today = new Date();
    const messageTime = new Date(time);
    if (getDate(messageTime, 'Y/m/d') === getDate(today, 'Y/m/d')) {
      return '今日' + getDate(messageTime, 'H:M');
    } else if (getDate(messageTime, 'Y/m/d') === getDate(getPreviousDay(), 'Y/m/d')) {
      return '昨日' + getDate(messageTime, 'H:M');
    }
    return getDate(messageTime, 'Y/m/d H:M');
  };

  return (
    <div style={{ width: "100%" }}>
      {props.user.roles[0].name === 'Admin' && 
      <NavPills
        color="rose"
        clickOnTab={handleTabChange}
        tabs={[
          {
            tabButton: "ユーザー",
            tabContent: (
              <div style={{ width: "100%" }}>
                <div className={classes.chatWindow}>
                  <List component="nav">
                    {messages.map((message, i) => (
                      <span key={i}>
                        <ListItem
                          key={i}
                          className={`message-item ${
                            message.ufrom === props.user.id ? "my-message" : "received-message"
                          }`}
                        >
                          <ListItemText primary={message.message} />
                        </ListItem>
                        <div className={`${message.ufrom === props.user.id ? "my-time-message" : "received-time-message"}`}>
                          {newFormatOfMessageTime(message.created_at)}
                        </div>
                      </span>
                    ))}
                  </List>
                </div>
                <div style={{ marginTop: "10px" }}>
                  <TextField
                    id="inputText"
                    label=""
                    multiline
                    variant="outlined"
                    value={newMessage}
                    onChange={handleNewMessageChange}
                    placeholder="Write message..."
                    className="new-message-input-field"
                    onKeyPress={handleKeypress}
                  />
                  <button variant="contained" 
                  onClick={handleSendMessage}
                  className="send-message-button">
                    <i className="fas fa-paper-plane"></i>
                  </button>
                </div>
              </div>
            )
          },
          {
            tabButton: "事業者",
            tabContent: (
              <div style={{ width: "100%" }}>
                <div className={classes.chatWindow}>
                  <List component="nav">
                    {messages.map((message, i) => (
                      <div key={i}>
                        <ListItem
                          key={i}
                          className={`message-item ${
                            message.ufrom === props.user.id ? "my-message" : "received-message"
                          }`}
                        >
                          <ListItemText primary={message.message} />
                        </ListItem>
                        <div className={`${message.ufrom === props.user.id ? "my-time-message" : "received-time-message"}`}>
                          {newFormatOfMessageTime(message.created_at)}
                        </div>
                      </div>
                    ))}
                  </List>
                </div>
                <div style={{ marginTop: "10px" }}>
                  <TextField
                    id="inputText"
                    label=""
                    multiline
                    variant="outlined"
                    value={newMessage}
                    onChange={handleNewMessageChange}
                    placeholder="Write message..."
                    className="new-message-input-field"
                    onKeyPress={handleKeypress}
                  />
                  <button variant="contained" onClick={handleSendMessage} className="send-message-button">
                    <i className="fas fa-paper-plane"></i>
                  </button>
                </div>
              </div>
            )
          }
        ]}
      />
      }
      {props.user.roles[0].name !== 'Admin' && 
        <div style={{ width: "100%" }}>
          <div className={classes.chatWindow}>
            <List component="nav">
              {messages.map((message, i) => (
                <div key={i}>
                  <ListItem
                    key={i}
                    className={`message-item ${
                      message.ufrom === props.user.id ? "my-message" : "received-message"
                    }`}
                  >
                    <ListItemText primary={message.message} />
                  </ListItem>
                  <div className={`${message.ufrom === props.user.id ? "my-time-message" : "received-time-message"}`}>
                    {newFormatOfMessageTime(message.created_at)}
                  </div>
                </div>
              ))}
            </List>
          </div>
          <div style={{ marginTop: "10px" }}>
            <TextField
              id="inputText"
              label=""
              multiline
              variant="outlined"
              value={newMessage}
              onChange={handleNewMessageChange}
              placeholder="Write message..."
              className="new-message-input-field"
              onKeyPress={handleKeypress}
            />
            <button variant="contained" onClick={handleSendMessage} className="send-message-button">
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      }
    </div>
  )
}

const mapStateToProps = (state, ownProps) => ({
  user: state.auth.user
})

const mapDispatchToProps = ({})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ChatContent))