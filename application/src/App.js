import logo from './logo.svg';
import React, { useState, useEffect } from "react";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import './App.css';
import Header from './components/Header'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';


function App(){
  return(
      <div className="App">
        App<br/>
        <Header/>
        <div>
          
        </div>
      </div>
  );
}

export default App;
