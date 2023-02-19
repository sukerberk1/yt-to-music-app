import React, { useState } from "react";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Link } from "react-router-dom";
import { Button } from "@mui/material";

const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;
const url = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&type=video&part=snippet&q=`;

export default function Header(){

  const [searchResults, setSearchResults] = useState([]);

  const getAPIdata = (prompt) => {
    fetch(url+prompt)
    .then((response)=>{return response.json()})
    .then((res) => {
      let videoList = [];
      for (let i = 0; i < res.items.length; i++) {
        let o = {
          name: res.items[i].snippet.title,
          link: `yt-result/${res.items[i].id.videoId}`,
        };
        videoList.push(o);
        console.log(res.items);
      }
      setSearchResults(videoList);
    })
  };

  return(<Autocomplete
        style={{margin: 10}}
        freeSolo
        autoComplete
        autoHighlight
        options={searchResults || [] }
        getOptionLabel={(option => option.name)}
        renderOption={(props, option) => (
          <Button {...props} variant="text" LinkComponent={Link} to={option.link}>
            {option.name}
          </Button>
    )}
        renderInput={(params)=>
          <TextField
            {...params}
            onChange={(e)=> getAPIdata(e.target.value)}
            variant="outlined"
            label="Search via YouTube"
          />
        }
        />);
}