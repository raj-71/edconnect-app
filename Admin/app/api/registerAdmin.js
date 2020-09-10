import client from "./client";

const endpoint = "/admin/register";

const postAdminRegister = (username, password) =>
  client.post(endpoint, { username, password });

export default {
  postAdminRegister,
};
