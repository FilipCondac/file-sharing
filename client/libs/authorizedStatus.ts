import axios from "axios";

//Function to check if user is authorized

const authorizedStatus = async () => {
  try {
    //Get user data from server
    const { data } = await axios.get("api/files/authorizedStatus", {
      headers: { "Content-Type": "application/json" },
    });

    //If user is not authorized, return false
    if (data.status !== 200) {
      console.log(data.message);
    }
    //If user is authorized, return user data
    return data.user;
  } catch (error) {
    console.error(error);
  }
};

export default authorizedStatus;
