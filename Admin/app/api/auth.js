import client from "./client";

const login = (username, password) =>
  client.post("/admin/login", { username, password });

export default {
  login,
};
