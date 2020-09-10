import client from "./client";

const endpoint = "/user/report";

const getReports = () => client.get(endpoint);

const putReports = (date, description) =>
  client.post(endpoint, { date, description });

export default {
  getReports,
  putReports,
};
