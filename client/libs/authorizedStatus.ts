import axios from "axios";

const authorizedStatus = async () => {
  try {
    const { data } = await axios.get("api/files/authorizedStatus", {
      headers: { "Content-Type": "application/json" },
    });

    if (data.status !== 200) {
      console.log(data.message);
    }

    return data.user;
  } catch (error) {
    console.error(error);
  }
};

export default authorizedStatus;
