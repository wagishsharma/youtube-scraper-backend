const express = require('express')
const app = express()
const PORT = process.env.PORT || 8080
const dotenv = require('dotenv').config();
const fs = require('fs');

/*youtube scraper*/
const YoutubeScraper = require('./YoutubeScraper');
const ytdl = require('ytdl-core');
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

/*firebase*/
const admin=require('firebase-admin');
const {google} = require('googleapis');


var serviceAccount = require("./firebase-account-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://scraper-12aba.firebaseio.com"
});

var db=admin.database();
var popular_video_ref=db.ref("scraper").child("popular_video");
var channel_ref=db.ref("scraper").child("channel");



app.listen(PORT, () => {
  console.log('Listening on port ');
});

app.get('/api/trending', async (req, res, next) => {
	popular_video_ref.once('value',function(snap){
		res.status(200).json(snap.val());
	}); 
});
app.post('/api/trending', async (req, res, next) => {
	
	google.youtube('v3').videos.list({
	key:	YOUTUBE_API_KEY,
      part: [
        "snippet,contentDetails,statistics"
      ],
      chart: "mostPopular",
	  regionCode: "IN",
	  maxResults:50
    }).then((response) => {
		
		return YoutubeScraper.build_video_entry_object(response.data.items);
		
	}).then((popularVideos) =>{
		let channels = [];
		Object.keys(popularVideos).forEach(function(video) {
			
			if (popularVideos[video].hasOwnProperty('channelId')) {
				channels.push(popularVideos[video].channelId);
			}
		});
		popular_video_ref.set(popularVideos);
		return channels
	}).then((channels)=>{
		return google.youtube('v3').channels.list({
			key:	YOUTUBE_API_KEY,
			part: [
				"snippet,statistics"
			  ],
			  id:channels,
			  maxResults:50
			})
	}).then((response) => {
		let channelObj =  YoutubeScraper.build_channel_object(response.data.items);
		channel_ref.set(channelObj);
		res.sendStatus(200);
	});
});
app.get('/api/videos/:id',  async (req, res, next) =>  {
	
	let response = {};
	popular_video_ref.child(""+req.params.id).once('value',function(snap){
		let video = snap.val(); 
		 
		if(video.hasOwnProperty('channelId')){
			
			channel_ref.child(""+video.channelId).once('value',function(snapshot){
				response.video = video;
				response.channel = snapshot.val();
				res.status(200).json(response);
			});
		
		}

	});

});

app.get('/api/videos/:id/download',  async (req, res, next) =>  {
	
	let response = {};

	let id = req.params.id
	let url = "https://www.youtube.com/watch?v="+id;   
    res.header("Content-Disposition", 'attachment;\  filename="Video.mp4');    
    ytdl(url, {format: 'mp4'}).pipe(res);

});
