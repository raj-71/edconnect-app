import client from "./client";

const endpoint = "/admin/registerpair";

const postPair = (data) => client.post(endpoint, data);

export default {
  postPair,
};
