import client from "./client";

const endpoint = "/admin/pairs";

const getPair = () => client.get(endpoint);

const getPairDetails = (pairId) => client.get(endpoint + "/" + pairId);

const getPairUserDetails = (mentorId, menteeId) =>
  client.get(endpoint + "/userdetails/" + mentorId + "/" + menteeId);

const getPairReports = (mentorId, menteeId) =>
  client.get(endpoint + "/reports/" + mentorId + "/" + menteeId);

const getPairPlans = (pairId) => client.get(endpoint + "/plans/" + pairId);

const getPairChat = (pairId) => client.get(endpoint + "/chat/" + pairId);

export default {
  getPair,
  getPairDetails,
  getPairUserDetails,
  getPairReports,
  getPairPlans,
  getPairChat,
};
