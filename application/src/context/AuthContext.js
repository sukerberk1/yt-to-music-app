import { createContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import { useHistory, redirect } from "react-router-dom";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {


  const [userToken, setUserToken] = useState(() =>
    localStorage.getItem("authtoken")
      ? localStorage.getItem("authtoken")
      : null
  );
  const [loading, setLoading] = useState(true);

  const loginUser = async (username, password) => {
    const response = await fetch("http://127.0.0.1:8000/api/token-obtain/", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password
      })
    });
    const data = await response.json();
    console.log(data);
    if (response.status === 200) {
      console.log(data);
      setUserToken(data.access);
      localStorage.setItem("authtoken", data.access);
      localStorage.setItem("refreshtoken", data.refresh);
      redirect("/");
    } else if(response.status === 401 || response.status===403){
      alert("Improper credentials!");
      /* TBD */
    } else {
      alert("Something went wrong!");
    }
  };
  
//   const registerUser = async (username, password, password2) => {
//     const response = await fetch("http://127.0.0.1:8000/api/register/", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({
//         username,
//         password,
//         password2
//       })
//     });
//     if (response.status === 201) {
//       redirect("/");
//     } else {
//       alert("Something went wrong!");
//     }
//   };

  const logoutUser = async () => {
    setUserToken(null);
    localStorage.removeItem("authtoken");
    localStorage.removeItem("refreshtoken");
    redirect("/");
  };

  const contextData = {
    userToken,
    setUserToken,
    loginUser,
    logoutUser,
  };

  useEffect(() => {
    if (localStorage.getItem('authtoken')) {
        console.log(userToken);
        setUserToken(localStorage.getItem('authtoken'));
    }
    setLoading(false);
  }, [loading]);

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};