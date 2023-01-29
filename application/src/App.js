import logo from './logo.svg';
import React, { useState, useEffect } from "react";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Grid from '@mui/material/Grid'; // Grid version 1
import { Paper, styled } from '@mui/material';
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
  return(
      <div className="App">
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
      </div>
  );
}

export default App;
