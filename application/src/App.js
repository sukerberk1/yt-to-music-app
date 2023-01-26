import logo from './logo.svg';
import React, { useState, useEffect } from "react";
import './App.css';

/* google api link already filled in with a key */
const YOUTUBE_API_KEY = 'AIzaSyC6LZBjHVXzJeihFO1EymtwKdI5b4QxsIs'
const url = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&type=video&part=snippet&q=`;
const url2_duration = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&key=${YOUTUBE_API_KEY}&id=`;
/*data above needs to be moved to config file */


function fetchVideoDuration(videoId){
  let data = fetch(url2_duration + videoId)
    .then((res)=>res.json())
    .then((data)=>{
      return(data.items[0].contentDetails.duration);
    })
  return(data);
}

function fetchVideos(prompt){
  let data = fetch(url+prompt)
  .then((res)=>res.json())
  .then((data)=>{
    let VideoList = [];
    console.log(data.items);
    for(const elem of data.items ){
      VideoList.push(
        {
          yt_id: elem.id.videoId,
          title: elem.snippet.title,
          author: elem.snippet.channelTitle,
          image_url: elem.snippet.thumbnails.default.url,
          duration_seconds: fetchVideoDuration(elem.id.videoId).then(vid => vid)
        }
      );
      
    }
    return(VideoList);
  }
  ).catch(e=>console.log(e));
  
  
  console.log(data);
  return(data);
}
/*functions above should be optimized and more readable */



class App extends React.Component {

  constructor(props){
    super(props)
    this.state= {
      searchResults: [],
      searchTerm: '',
    }
  }

  updateSearchTerm = (e) => {
    this.setState({searchTerm: e.target.value});
    console.log(this.state.searchTerm);
  }
  
  render(){
    return(
      <div className="App">
        App<br/>
        <input type="text" name='search' value={this.state.searchTerm} onChange={this.updateSearchTerm}/>
        <button onClick={()=>console.log(fetchVideos(this.state.searchTerm))}>Znajdź</button>
      </div>
    )
  }
}

export default App;
