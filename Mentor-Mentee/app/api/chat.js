import client from "./client";
import io from "socket.io-client";
import authStorage from "../auth/storage";
let socket;

const initiateSocket = async (room) => {
  const token = await authStorage.getToken();
  socket = io("https://edconnectbackend.herokuapp.com/", {
    query: { token },
  });
  if (socket && room) socket.emit("joinRoom", room);
};

const subscribeToChat = (cb) => {
  if (!socket) return true;

  socket.on("sendMsg", (msg) => {
    return cb(null, msg);
  });
};

const sendMessage = (roomId, userId, msg) => {
  if (socket) socket.emit("message", { room: roomId, userId, msg });
};

const getAllMessages = () => client.get("/user/messages");

export default {
  initiateSocket,
  subscribeToChat,
  sendMessage,
  getAllMessages,
};
