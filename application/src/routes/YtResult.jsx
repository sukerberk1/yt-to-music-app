import { Box, IconButton, Typography } from "@mui/material";
import { Link, useLoaderData, useOutletContext } from "react-router-dom";
import { Card, CardMedia, CardContent, CardActions, Button } from "@mui/material";
import { Download } from "@mui/icons-material";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
const YOUTUBE_API_KEY = 'AIzaSyC6LZBjHVXzJeihFO1EymtwKdI5b4QxsIs'+'';
const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&key=${YOUTUBE_API_KEY}&id=`
const url2_duration = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&key=${YOUTUBE_API_KEY}&id=`;

/* function handles reformatting video length */
function parseDurationString( durationString ){
    var stringPattern = /^PT(?:(\d+)D)?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d{1,3})?)S)?$/;
    var stringParts = stringPattern.exec( durationString );
    return (
             (
               (
                 ( stringParts[1] === undefined ? 0 : stringParts[1]*1 )  /* Days */
                 * 24 + ( stringParts[2] === undefined ? 0 : stringParts[2]*1 ) /* Hours */
               )
               * 60 + ( stringParts[3] === undefined ? 0 : stringParts[3]*1 ) /* Minutes */
             )
             * 60 + ( stringParts[4] === undefined ? 0 : stringParts[4]*1 ) /* Seconds */
           );
}

function getDurationSeconds(videoId){
    return(
        fetch(url2_duration+videoId)
        .then(res=>res.json())
        .then( data => {
            let duration_ISO = data.items[0].contentDetails.duration;
            console.log(duration_ISO);
            let duration_seconds = parseDurationString(duration_ISO)
            return(duration_seconds);
        }
        )
    );
}

export async function loader({params}){
    return(
        fetch(url+params.videoId)
        .then(
            res => {
                let response1 = res.json();
                let vid_length = getDurationSeconds(params.videoId).then(res_dur=>res_dur);
                return [response1, vid_length];
            } /* code above makes data[0] a first fetch, and data[1] a second fetch that is required to get duration */
        )
        .then( data =>{
            return(Promise.all(data).then( (data) => {
                    return(
                        {
                            yt_id: params.videoId,
                            title: data[0].items[0].snippet.title,
                            author: data[0].items[0].snippet.channelTitle,
                            image_url: data[0].items[0].snippet.thumbnails.high.url,
                            duration_seconds: data[1],
                        }
                    )
                } 
            ))
        }
    ));
}


export default function YtResult(props){

    const videoData = useLoaderData();
    const { verifyAccessToken, refreshUser, userToken } = useContext(AuthContext)
    /* state inheritage */
    const [libUpdates, setLibUpdates] = useOutletContext();

    const handleVideoSave = async () =>{
      verifyAccessToken().then(ans => {
        if(!ans) refreshUser();
      });
      const accessToken = localStorage.getItem('authtoken');
      const response = await fetch("http://127.0.0.1:8000/api/addaudio/", {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          "Content-Type": "application/json",
          "Authorization": 'Bearer '+ accessToken,
        },
        body: JSON.stringify(videoData),
      }); 
      console.log(await response.json());
      if (response.status === 208){
        alert("Already in your lib!");
      }
      setLibUpdates(libUpdates+1);
    }

    return(
      <Card sx={{ display: 'flex' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flex: '1 0 auto' }}>
          <Typography component="div" variant="h5">
            {videoData.title}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" component="div">
            {videoData.author}
          </Typography>
        </CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', pl: 1, pb: 4 }}>
        { userToken ? (
          <Button variant="contained" startIcon={<Download/>} onClick={handleVideoSave}>
          Save in your library
        </Button>
        ):(
          <Button disabled variant="contained" startIcon={<Download/>} >
            Log in to save
          </Button>
        )}
        

        </Box>
      </Box>
      <CardMedia
        component="img"
        sx={{ margin: 2, maxWidth:480 }}
        image={videoData.image_url}
        alt="Music video thumbnail"
      />
    </Card>
    );
}