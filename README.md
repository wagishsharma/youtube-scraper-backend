# Youtube Scraper Backend

This is a server-side implementation to fetch/store YouTube trending videos in India using the YouTube data API. 

## Installation

Clone the project and use npm to install

```bash
git clone https://github.com/wagishsharma/youtube-scraper-backend.git
cd youtube-scraper-backend
npm install
```
This project uses firebase to store data from YouTube.

Create a firebase project, set up a realtime database, and download your credentials.

Rename this credential file to 'firebase-account-key.json' and place it in the root folder.
## API

GET /api/trending to get trending videos

POST /api/trending to update trending videos

GET /api/videos/{video_id} to fetch video and channel details related to a single video.

## Firebase DB Sruture.

scrapper: {
video:{..video detail json..},
channel:{..channel detail json..}
} 

Video Object Contains video detail along with channel id which is used to fech channel details 

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.