import client from "./client";

const endpoint = "/user/userdetails";

const getDetails = () => client.get(endpoint);

const putDetails = (data) => client.post(endpoint, data);

const putImage = (image) => {
  const data = new FormData();

  data.append("image", {
    name: "image",
    type: "image/jpeg",
    uri: image,
  });

  return client.post(endpoint + "/profile", data);
};

export default {
  getDetails,
  putDetails,
  putImage,
};
