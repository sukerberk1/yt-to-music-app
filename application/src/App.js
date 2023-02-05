import React, { useState, useEffect } from "react";
import Grid from '@mui/material/Grid'; // Grid version 1
import { Box, Container, Button, TextField, Paper } from '@mui/material';
import { AccountCircle, ConstructionOutlined, PasswordRounded } from '@mui/icons-material';
import './App.css';
import Header from './components/Header'
import { Form } from 'react-router-dom';
import { Outlet, useLoaderData, useActionData, redirect } from 'react-router-dom';
import UserPanel from "./components/UserPanel";
import AuthContext, { AuthProvider } from "./context/AuthContext";
import jwtDecode from "jwt-decode";

export function loader({ request, params }) {
    const user = {
      token: localStorage.getItem('authtoken'),
      // user_id: localStorage.getItem('user_id'),
      // username: localStorage.getItem('username'),
      // email: localStorage.getItem('email'),
    }
    return user;
}

export async function action( {params, request} ){

  let formData = await request.formData();
  const response = await fetch("http://127.0.0.1:8000/api-token-auth/", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            {
              username: formData.get('username'), 
              password: formData.get('password'),
            }
          )
        });
        
    response.json()
    .then(token => {console.log(token);localStorage.setItem('authtoken', token.token )} );

    return (redirect('/'));
}


function App(){

  const loaderUser = useLoaderData();
  const [user, setUser] = useState({});
  const [userLogged, setUserLogged] = useState(0);


  return(
    <AuthProvider>
      <Container className="App">
        youtube-music-app<br/>
        <Header/>

          <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
            <Grid item xs={12} md={3}>
              <UserPanel/>
            </Grid>
            <Grid item xs={12} md={9}>
              <Outlet/>
            </Grid>
          </Grid>

      </Container>
    </AuthProvider>
  );
}

export default App;
