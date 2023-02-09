import { Form } from "react-router-dom";
import { Box, Button, TextField, Paper } from '@mui/material';
import { AccountCircle, PasswordRounded } from '@mui/icons-material';
import { useContext, useEffect } from "react";
import jwt_decode from "jwt-decode";
import AuthContext from "../context/AuthContext";



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
          
          <div>{JSON.stringify(jwt_decode(userToken))}</div>
          <Button variant="outlined" style={{margin: 8}} onClick={logoutUser}>Log out</Button>
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