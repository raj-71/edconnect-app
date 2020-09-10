import client from "./client";

const endpoint = "/user/userdetails/pair";

const getPairDetails = () => client.get(endpoint);

export default {
  getPairDetails,
};
