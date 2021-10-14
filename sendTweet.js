//NOTE: this script runs via cron job in AWS 

require('dotenv').config({ path: '.env' });

const { TwitterClient } = require('twitter-api-client');

//Uncomment the below when NOT using crontab on AWS (AKA when running via a setInterval function on AWS)
// const googleCredentials = require('./retrieveSecrets.js');
//commented out the above b/c not needed with cron job; set google credentials in cron file

const twitterClient = new TwitterClient({
    apiKey: process.env.TWITTER_API_KEY,
    apiSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

//instructions in this video for connecting to google sheet api
//https://www.youtube.com/watch?v=MiPpQzW_ya0
var {google} = require('googleapis'); //note this was changed from the video, see reasoning here: https://stackoverflow.com/questions/50068449/cant-generate-jwt-client-with-googles-node-js-client-library


function connectToGoogleSheet(){
    //WHEN USING AWS - NON CRON JOB
    //(make sure to make the function async again)
    // const googleCredentialsJson = await googleCredentials.getGoogleCredentials();
    // const client = new google.auth.JWT(
        // googleCredentialsJson.client_email,
        // null,
        // googleCredentialsJson.private_key, //commented out b/c not needed with cron job; set google credentials in cron file
        //['https://www.googleapis.com/auth/spreadsheets']
    // );

    //WHEN USING CRON JOB ON AWS
    const client = new google.auth.JWT(
        process.env.GOOGLE_CLIENT_EMAIL,
        null,
        process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/gm, "\n"), //forced to do this because cron converts \n --> \\n (don't know why)
        ['https://www.googleapis.com/auth/spreadsheets'] 
    );

    //WHEN APP IS RUNNING ON HEROKU
    // const keys = require('./google-credentials.json'); 
    // // NOTE: to use the google-credentials.json file in heroku, see below link
    // // https://elements.heroku.com/buildpacks/buyersight/heroku-google-application-credentials-buildpack
    // const client = new google.auth.JWT(
    // keys.client_email,
    // null,
    // keys.private_key,
    // ['https://www.googleapis.com/auth/spreadsheets']
    // );

    client.authorize(function(err,tokens) {
    if(err) {
        console.log(err);
    } else {
        console.log('Connected to Google Sheet');
        getDataFromGoogleSheet(client);
    }
    })
}

async function getDataFromGoogleSheet(cl) {
  console.log('Getting data from Google Sheet');
  const gsapi = google.sheets({
    version:'v4',
    auth: cl,
  });

  const kapilOptions = {
    spreadsheetId: '1myCg25YigeUDq-SNUF-FZygcCP-liO_uT2YobzqId4Q',//google sheet of kapil's tweets
    range:'sorted_tweets!A2:A',
  };

  let kapilData = await gsapi.spreadsheets.values.get(kapilOptions);
  const arrayOfKapilsTweets = kapilData.data.values;
  console.log(arrayOfKapilsTweets[0]);
  createTweet(arrayOfKapilsTweets);
}

function createTweet(arrayOfTweets) {
    console.log(arrayOfTweets[0]);
    console.log('Creating tweet');
    let tweet = arrayOfTweets[Math.floor(Math.random() * arrayOfTweets.length)].toString().replace(/"/gi, '');
    tweet = `${tweet}\n\n@kapilguptamd`;
    if (tweet.length > 280) {
        createTweet(arrayOfTweets);
    } else sendTweet(tweet);
  };

function sendTweet(tweet) {
    console.log('Sending tweet');
    twitterClient.tweets.statusesUpdate({
        status: tweet
    }).then(response => {
        console.log("Tweet sent", response)
    }).catch(err => {
        console.error(err)
    })
}

//Commented out the below because made this script run via cron job
// setInterval(function () {
    // connectToGoogleSheet();
    // var date = new Date();
    // const hour = date.getHours();
    // const minutes = date.getMinutes();
    // if (hour === 13 && minutes === 00 || hour === 16 && minutes === 00 || hour === 19 && minutes === 00 || hour === 01 && minutes === 00) {
    //     connectToGoogleSheet();
    // }
// }, 60000) //runs every 1 min.

connectToGoogleSheet();
