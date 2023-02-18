const getUser = async () => {
  const response = await fetch(
    "http://localhost:8000/api/files/authorizedStatus",
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );

  const data = await response.json();
  const statusCode = data.status;

  // Use the user ID as needed
  if (statusCode === 200) {
    return data.user;
  } else {
    console.log(data.message);
    return null;
  }
};

export default getUser;
