import React, { useState, useEffect } from "react";
import Grid from '@mui/material/Grid'; // Grid version 1
import { Box, Container, Button, TextField, Paper } from '@mui/material';
import './App.css';
import Header from './components/Header'
import { Outlet,  redirect } from 'react-router-dom';
import UserPanel from "./components/UserPanel";
import { AuthProvider } from "./context/AuthContext";

export function loader({ request, params }) {
    /* May load sth here... idk */
    return 1;
}

export async function action( {params, request} ){
  /* By the neccesity of post requests, action function must be defined in order for them to work */
    return (redirect('/'));
}


function App(){

  const [userLibUpdates, setUserLibUpdates] = useState(0);

  return(
    <AuthProvider>
      <Container className="App">
        youtube-music-app<br/>
        <Header/>

          <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
            <Grid item xs={12} md={3}>
              <UserPanel libUpdates={userLibUpdates}/>
            </Grid>
            <Grid item xs={12} md={9}>
              <Outlet context={[userLibUpdates, setUserLibUpdates]}/>
            </Grid>
          </Grid>

      </Container>
    </AuthProvider>
  );
}

export default App;
