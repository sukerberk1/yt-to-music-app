import { Form } from "react-router-dom";
import React from "react";
import { Box, Button, TextField, List, Avatar, CircularProgress, ListItem, ListItemAvatar, ListItemText, Typography, Divider, LinearProgress } from '@mui/material';
import { AccountCircle, PasswordRounded } from '@mui/icons-material';
import { useContext, useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import AuthContext from "../context/AuthContext";
import { display } from "@mui/system";

/* borrowed from MUI website */
function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name[0]}`,
  };
}
function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}


function UserHero(props){
  const { verifyAccessToken, refreshUser } = useContext(AuthContext);
  const [ userObject, setUserObject ] = useState({id: 0, username: 'A'});

  verifyAccessToken().then(ans => {
    if(!ans) refreshUser();
  })


  async function load() {
    const userToken = localStorage.getItem('authtoken');
    const res = await fetch("http://127.0.0.1:8000/api/getuser/", {
      method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + userToken,
        }
    });
    const userData = await res.json();
    setUserObject(userData);
  }
  
  useEffect(()=>{load();},[]);
  console.log(userObject);
  return (
    <>
      {userObject.id != 0 ? (
      <Box sx={{display: 'flex', flexFlow: 'column', alignItems: 'center',}}>
        <Avatar {...stringAvatar(userObject.username)}
        sx={{ width: 56, height: 56 }}
        />
        <h1>{userObject.username}</h1>
        <p>{userObject.email}</p>
      </Box>
      ) : (
        <Box sx={{ display: 'flex', flexFlow: 'column', alignItems: 'center', }}>
          <CircularProgress/>
        </Box>
      )}
      
    </>
  );
}

function UserLibrary(props){
  const [userLib, setUserLib] = useState([]);
  const { userToken } = useContext(AuthContext);
  
  async function load(){
    
    const res = await fetch("http://127.0.0.1:8000/api/userlib/", {
      method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + userToken,
        }
    });
    const libArray = await res.json();
    setUserLib(libArray);
  }

  useEffect(()=>{load();}, []);

  return (
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      {userLib.length > 0 ? (userLib.map(elem=>(
          <>
            <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar alt={elem.title} src={elem.image_url} variant="square"/>
                </ListItemAvatar>
              <ListItemText
                primary={elem.title}
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: 'inline' }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {Math.floor(elem.duration_seconds/60)}:{elem.duration_seconds%60}
                    </Typography>
                  </React.Fragment>
                }
              />
            </ListItem>
            <Divider variant="inset" component="li" />
          </>
        ))
      )
      :(
        <Box sx={{ display: 'flex', flexFlow: 'column', alignItems: 'center', }}>
        <LinearProgress/>
      </Box> 
      )}
    </List>
  );
}


export default function UserPanel(props){

  const { userToken, setUserToken, loginUser, logoutUser } = useContext(AuthContext);


  const handleSubmit = (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    username.length > 0 && loginUser(username, password);
  }
  

    return (<>{ userToken ? (
        <Box sx={{padding: 1, wordWrap: 'break-word' }}>
          <UserHero/>
          <Button variant="outlined" style={{margin: 8}} onClick={logoutUser}>Log out</Button>
          <UserLibrary libUpdates={props.libUpdates}/>
        </Box>
        
      ): (

        <Form method="POST" onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
            <AccountCircle sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
            <TextField  label="Username" variant="filled" fullWidth margin="normal" name="username"/>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
            <PasswordRounded sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
            <TextField type={'password'} label="Password" variant="filled" fullWidth margin="normal" name="password"/>
          </Box>

          <Button variant="contained" type="submit">Log in</Button>
          <span style={{marginLeft: 8, marginRight:8}}>or</span>
          <Button variant="text">Sign up</Button>
        </Form>

      ) }
      </>);
}
