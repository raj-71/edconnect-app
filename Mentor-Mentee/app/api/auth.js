import client from "./client";

const login = (username, password) =>
  client.post("/user/login", { username, password });

export default {
  login,
};
