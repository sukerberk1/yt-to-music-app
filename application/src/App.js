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
    /* May load sth here... idk */
    return 1;
}

export async function action( {params, request} ){
  /* By the neccesity of post requests, action function must be defined in order for them to work */
    return (redirect('/'));
}


function App(){


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
