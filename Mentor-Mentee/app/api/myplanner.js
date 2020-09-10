import client from "./client";

const endpoint = "/user/myplanner";

const getPlans = () => client.get(endpoint);

const putPlans = (date, description) =>
  client.post(endpoint, { date, description });

const deletePlan = (id) => client.delete(endpoint, {}, { data: { id } });

export default {
  getPlans,
  putPlans,
  deletePlan,
};
