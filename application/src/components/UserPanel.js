import { Form, Link, redirect, useLocation, useNavigate } from "react-router-dom";
import React from "react";
import { Box, Button, TextField, List, Avatar, CircularProgress, ListItem, ListItemAvatar, ListItemText, Typography, Divider, LinearProgress, IconButton } from '@mui/material';
import { AccountCircle, KeyboardArrowRightRounded } from '@mui/icons-material';
import { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import { green } from "@mui/material/colors";

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
  const [ userObject, setUserObject ] = useState({});

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
  return (
    <>
      { ('email' in userObject) ? (
      <Box sx={{display: 'flex', flexFlow: 'column', alignItems: 'center',}}>
        <Avatar {...stringAvatar(userObject.username)}
        sx={{ width: 56, height: 56, margin: 2}}
        />
        <Typography variant="h4" gutterBottom>
        {userObject.username}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
        {userObject.email}
        </Typography>
      </Box>
      ) : (
        <Box sx={{ display: 'flex', flexFlow: 'column', alignItems: 'center', }}>
          <CircularProgress sx={{marginTop: 4, marginBottom: 4}}/>
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
    if (res.status === 200){
      const libArray = await res.json();
      setUserLib(libArray);
    }else{ 
      console.log('a');
      setUserLib(0);
    };
  }

  useEffect(()=>{load();}, [props.libUpdates]);

  return (
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', margin:'auto'}}>
      { userLib !== 0 ? (userLib.map(elem=>(
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
                      {Math.floor(elem.duration_seconds/60)}:{elem.duration_seconds%60 > 9 ? elem.duration_seconds%60 : '0'+elem.duration_seconds%60}
                    </Typography>
                    <IconButton aria-label="delete" size="large" LinkComponent={Link} to={`/play/${elem.id}`}>
                      <KeyboardArrowRightRounded/>
                    </IconButton>
                  </React.Fragment>
                }
              />
            </ListItem>
            <Divider variant="inset" component="li" />
          </>
        ))
      )
      :(
        <Box sx={{ width: '100%', marginTop: 6, marginBottom: 6 }}>
          <Typography variant="overline" display="block" gutterBottom>
          Library loading in progress...
          </Typography>
          <LinearProgress />
        </Box>
      )}
    </List>
  );
}


export default function UserPanel(props){

  const { userToken, loginUser, logoutUser } = useContext(AuthContext);
  const [submitState, setSubmitState] = useState(1);
  const location = useLocation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    if(username.length > 0) setSubmitState(await loginUser(username, password));
  }

  useEffect(()=>{if (location.pathname==='/register') navigate('/')}, [userToken])
  
  const handleLogout = async () => { setSubmitState( await logoutUser() ) }

    return (<>{ userToken ? (
        <Box sx={{padding: 1, wordWrap: 'break-word' }}>
          <UserHero/>
          <Button variant="outlined" style={{margin: 8}} onClick={handleLogout}>Log out</Button>
          <UserLibrary libUpdates={props.libUpdates}/>
        </Box>
        
      ): (

        <Form method="POST" onSubmit={handleSubmit}>
          <AccountCircle sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
          <Box sx={{ display: 'flex', alignItems: 'flex-end' }}> 
            { submitState === 1 ? (
            <TextField  label="Username" fullWidth margin="normal" name="username"/>
            ): submitState === 401 ? (
              <TextField  label="Username" fullWidth margin="normal" name="username"
              error/>
            ): submitState === 204 ? (
              <TextField  label="Username" fullWidth margin="normal" name="username"
               color="success" />
            ): (
              <TextField  label="Username" fullWidth margin="normal" name="username"
               error />
            )}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
            
            { submitState === 1 ? (
            <TextField type={'password'} label="Password" fullWidth margin="normal" name="password"/>
            ) : submitState === 401 ? (
              <TextField type={'password'} label="Password" fullWidth margin="normal" name="password"
               error helperText="Wrong credentials"/>
            ) : submitState === 204 ? (
              <TextField type={'password'} label="Password" fullWidth margin="normal" name="password"
              helperText="Successfully logged out" color="success" />
            ) :(
              <TextField type={'password'} label="Password" fullWidth margin="normal" name="password"
               error helperText="Unexpected error happened! Try to log in later"/>
            )}
            
          </Box>

          <Button variant="contained" type="submit">Log in</Button>
          <span style={{marginLeft: 8, marginRight:8}}>or</span>
          <Button variant="text" LinkComponent={Link} to={'register'}>Sign up</Button>
        </Form>

      ) }
      </>);
}
