import axios from "axios";
//Function to logout user
const logout = async () => {
  try {
    const response = await axios.get(`api/files/logout`);
    const data = response.data;
    if (data.status !== 200) {
      console.log(data.message);
    }
    return data.user;
  } catch (error) {
    console.error(error);
  }
};

export default logout;
