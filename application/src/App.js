import logo from './logo.svg';
import React, { useState, useEffect } from "react";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Grid from '@mui/material/Grid'; // Grid version 1
import { Container, Paper, styled } from '@mui/material';
import { Menu, MenuItem } from '@mui/material';
import './App.css';
import Header from './components/Header'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import { Outlet } from 'react-router-dom';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(6),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));



function App(){

  const [currentPage, setCurrentPage] = useState('')

  useEffect(()=>{
    async function fetchToken(){
      const response = await fetch("http://127.0.0.1:8000/api-token-auth/", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            {
              username: 'sukerberk1', 
              password: '7Amemecorporation',
            }
          )
        });
        if(!response.ok){
          return(new Error('Couldnt fetch data from api'))
        }
        return (response.json());
    }
    fetchToken().then( res => console.log(res))
  }, [])


  return(
      <Container className="App">
        App<br/>
        <Header/>
      
          <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
            <Grid item xs={12} md={3}>
              <Item>User</Item>
            </Grid>
            <Grid item xs={12} md={9}>
              <Item><Outlet/></Item>
            </Grid>
          </Grid>

      </Container>
  );
}

export default App;
