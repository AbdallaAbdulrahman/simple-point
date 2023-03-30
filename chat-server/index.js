require('dotenv').config();
const server = require("http").createServer();
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});
var axios = require('axios');
const axios_url = process.env.AXIOS_URL;
const axios_private_key = process.env.AXIOS_PRIVATE_KEY;

function notifyMessage(payload) {
  payload['key'] = axios_private_key;
  axios.post(axios_url + 'api/notifyChat', payload, {
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      // 'Authorization': `Bearer ${token}`
    }
  }).then((response)=>{
      // console.log('------axios post resp:', response.data);
      return response;
  }).catch((err)=>{
    // console.log('------axios err:', err);
    return err;
  })  
}

function checkMessages() {
  axios.post(axios_url + 'api/check-messages', {key: axios_private_key}, {
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
    }
  }).then((response)=>{
    let messages = response.data.result;
    for (var i = 0; i < messages.length; i++) {
      if (messages[i].countdown == 0) {
        notifyMessage({id: messages[i].id});
      }
    }
  }).catch((err)=>{
    console.log(err);
  })
  setTimeout(function () {
    checkMessages();
  }, 10000);
}

io.on("connection", (socket) => {
  console.log(`Client ${socket.id} connected`);

  setTimeout(function () {
    checkMessages();
  }, process.env.CHAT_UNREAD_CHECK_INTERVAL);

  socket.on(process.env.JOIN_CHAT, ({ projectId, user, receiverFlag }) => {
    socket.join(projectId);
    axios.post(axios_url + 'api/get-chat-messages', { key: axios_private_key, projectId: projectId, userId: user.id, receiverFlag: (!receiverFlag ? 0 : 1) }, {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      }
    }).then((response)=>{
      if (response.status === 200) {
        socket.emit(process.env.INIT_CHAT, { messages: response.data });
      }
    }).catch((err)=>{
      console.log(err);
    })
  })

  // Listen for new messages
  socket.on(process.env.NEW_CHAT_MESSAGE_EVENT, (data) => {
    data['key'] = axios_private_key;
    axios.post(axios_url + 'api/create-chat-messages', data, {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      }
    }).then((response)=>{
      if (response.status === 200) {
        io.in(data.projectId).emit(process.env.NEW_CHAT_MESSAGE_EVENT, response.data);
      }
    }).catch((err)=>{
      console.log(err);
    })
  });

  // Leave the room if the user closes the socket
  socket.on("disconnect", (projectId) => {
    console.log(`Client ${socket.id} diconnected`);
    socket.leave(projectId);
  });
});

server.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});
