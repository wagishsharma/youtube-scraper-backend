class YoutubeScraper {

    static fresh_video_entry(){
        
        return  {
            videoId:-1,
            title:"",
            author:"",
            videoThumbnails:{},
            description:"",
            viewCount:-1,
            published:"",
            publishedText:"",
            duration:"",
            timeText:"",
            likeCount:-1,
            dislikeCount:-1,
            viewCount:-1,
            channelId:""
        };
    }


    static build_video_entry_object(videoList){
        let popular_videos = {};
        //access the relevant field of data and calculate missing values
        videoList.forEach(element => {
            let video_entry = this.fresh_video_entry();
            video_entry.videoId =  element.id;
            video_entry.title =  element.snippet.title;
            video_entry.author =   element.snippet.channelTitle;
            video_entry.videoThumbnails =  element.snippet.thumbnails;
            video_entry.description = element.snippet.description;
            video_entry.viewCount = element.statistics.viewCount;
            video_entry.published =  element.snippet.publishedAt;
            video_entry.publishedText =  "";
            video_entry.duration =  element.contentDetails.duration;
            video_entry.timeText =  this.makeDurationReadable(element.contentDetails.duration);
            video_entry.likeCount =  (element.statistics.likeCount != undefined)?element.statistics.likeCount:-1;
            video_entry.dislikeCount = (element.statistics.dislikeCount != undefined)?element.statistics.dislikeCount:-1;
            video_entry.channelId =  element.snippet.channelId;
            popular_videos[element.id] = video_entry;
        });
        
        
        return popular_videos;
    }

    static build_channel_object(channelList){
        let channelObj = {};
        //access the relevant field of data and calculate missing values
        channelList.forEach(element => {
            let channel = {};
            channel.channelId =  element.id;
            channel.title =  element.snippet.title;
            channel.channelThumbnail =  element.snippet.thumbnails;
            channel.description = element.snippet.description;
            channel.subscriberCount = element.statistics.subscriberCount;
            channelObj[element.id] = channel;
        });
        
        
        return channelObj;
    }
    
    //calculates the length of the video in seconds as a number from the string "hh:mm:ss"
    static calculate_length_in_seconds(lengthText){
        let length_seconds = 0;
        const hours_minutes_seconds = lengthText.match(/(\d(\d)*)/g);
        // calculate the time in seconds for every entry
        for(let i = hours_minutes_seconds.length-1; i >= 0; i--){
            length_seconds += Math.pow(60, (hours_minutes_seconds.length - i - 1)) * hours_minutes_seconds[i];
        }
        return length_seconds;
    }
    static makeDurationReadable(duration){
        return duration.replace("PT","").replace("H",":").replace("M",":").replace("S","");
    }
}
module.exports = YoutubeScraper
