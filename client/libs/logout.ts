const logout = async () => {
  const response = await fetch("http://localhost:8000/api/files/logout", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const data = await response.json();
  if (data.status !== 200) {
    console.log(data.message);
  }
  return data.user;
};

export default logout;
