import React, { useState } from "react";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Link } from "react-router-dom";
import { optionGroupUnstyledClasses } from "@mui/base";

/* google api link already filled in with a key */
const YOUTUBE_API_KEY = 'AIzaSyC6LZBjHVXzJeihFO1EymtwKdI5b4QxsIs'+'';
const url = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&type=video&part=snippet&q=`;
const url2_duration = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&key=${YOUTUBE_API_KEY}&id=`;
/*data above needs to be moved to config file */
/* kaz bałagane */

export default function Header(){

    const [searchResults, setSearchResults] = useState([]);

  const getAPIdata = (prompt) => {
    console.log('data from api');
    fetch(url+prompt)
    .then((response)=>{return response.json()})
    .then((res) => {
      console.log(res.items)
      let videoList = [];
      for (let i = 0; i < res.items.length; i++) {
        let o = {
          name: res.items[i].snippet.title,
          link: `yt-result/${res.items[i].id.videoId}`
        };
        videoList.push(o);
      }
      console.log(videoList);
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
          <Link {...props} to={option.link}>
             {option.name}
          </Link>
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