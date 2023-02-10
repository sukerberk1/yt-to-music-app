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

  const verifyAccessToken = async () => {
    const accessToken = localStorage.getItem('authtoken');
    const response = await fetch("http://127.0.0.1:8000/api/token-verify/", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: accessToken,
      })
    });
    if (response.status === 200) return 1
    else return 0;
  }

  const refreshUser = async () => {
    const refreshToken = localStorage.getItem('refreshtoken');
    const response = await fetch("http://127.0.0.1:8000/api/token-refresh/", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh: refreshToken
      })
    });
    const data = await response.json();
    if (response.status === 200) {
      localStorage.setItem('authtoken', data.access); 
      return 1;
    } else{
      console.log('Couldnt refresh token');
      return 0;
    }
  }
  
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
    refreshUser,
    verifyAccessToken,
  };

  useEffect(() => {
    if (localStorage.getItem('authtoken')) {
        verifyAccessToken().then(ans => {
          if(!ans) refreshUser();
        });
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