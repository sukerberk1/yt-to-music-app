import { PauseCircleFilledTwoTone, PhonePausedTwoTone, PlayArrow, PlayArrowSharp, PlayArrowTwoTone } from "@mui/icons-material";
import { Box, Card, CardMedia, CardContent, IconButton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";

export async function loader({params}){
    const accessToken = localStorage.getItem('authtoken');
    const videoObject = {
        id: params.videoPk
    }
      const data = await fetch('http://127.0.0.1:8000/api/audioinfo/',{
        method: "POST",
        headers: {
          'Accept': 'application/json',
          "Content-Type": "application/json",
          "Authorization": 'Bearer '+ accessToken,
        },
        body: JSON.stringify(videoObject)
      });
      /* return array of [audio, audiodata] */
    return (await data.json())
}

export default function MediaPlayer(props){

    const [audioURL, setAudioURL] = useState();
    const audioData = useLoaderData();

    const loadSong = async () => {
        const accessToken = localStorage.getItem('authtoken');
        const videoObject = {
            id: audioData.id
        }
        const response = await fetch('http://127.0.0.1:8000/api/song/',{
        method: "POST",
        headers: {
          'Accept': 'application/json',
          "Content-Type": "application/json",
          "Authorization": 'Bearer '+ accessToken,
        },
        body: JSON.stringify(videoObject)
      });
      return await response.blob();
    }

    useEffect(()=>{
        loadSong()
        .then( blob => window.URL.createObjectURL(blob))
        .then( blobURL => setAudioURL(blobURL) )
    },[])


    return(<Box>
            <Card>
            <CardMedia
            component="img"
            image={audioData.image_url}
            />
            <CardContent>
            <Typography gutterBottom variant="h5" component="div">
                {audioData.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
            <audio src={audioURL} id='audio' controls></audio>
            </Typography>
            </CardContent>
        </Card>
    </Box>)
}