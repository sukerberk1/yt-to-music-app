import { Typography } from "@mui/material";
import { Link, useLoaderData } from "react-router-dom";
import { Card, CardMedia, CardContent, CardActions, Button } from "@mui/material";

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
    console.log(videoData);

    return(
        <Card sx={{ maxWidth: 565 }}>
        <CardMedia
          component="img"
          alt="green iguana"
          height="140"
          image={videoData.image_url}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {videoData.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Author: {videoData.author}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Duration: {videoData.duration_seconds}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">Share</Button>
          <Button size="small">Learn More</Button>
        </CardActions>
      </Card>
    );
}