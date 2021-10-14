//NOTE: this script runs via cron job 

require('dotenv').config({ path: '.env' });

const { TwitterClient } = require('twitter-api-client');

//added b/c of AWS
const googleCredentials = require('./retrieveSecrets.js');

console.log(process.env);

const twitterClient = new TwitterClient({
    apiKey: process.env.TWITTER_API_KEY,
    apiSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

//instructuons in this video for connecting to google sheet api
//https://www.youtube.com/watch?v=MiPpQzW_ya0

var {google} = require('googleapis'); //note this was changed from the video, see reasoning here: https://stackoverflow.com/questions/50068449/cant-generate-jwt-client-with-googles-node-js-client-library
// const keys = require('./google-credentials.json');

//note: to use the google-credentials.json file in heroku, see below link
    //https://elements.heroku.com/buildpacks/buyersight/heroku-google-application-credentials-buildpack
//made the below function async b/c of aws
async function connectToGoogleSheet(){
    //added b/c of aws
    const googleCredentialsJson = await googleCredentials.getGoogleCredentials();

    const client = new google.auth.JWT(
    // keys.client_email,
    googleCredentialsJson.client_email,
    null,
    // keys.private_key,
    googleCredentialsJson.private_key,
    ['https://www.googleapis.com/auth/spreadsheets'] //this is the SCOPE
    );

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
  createTweet(arrayOfKapilsTweets);
}

function createTweet(combinedTweets) {
    console.log('Creating tweet');
    let tweet = combinedTweets[Math.floor(Math.random() * combinedTweets.length)].toString().replace(/"/gi, '').replace(/\n\n@naval/gi, '');
    tweet = `${tweet}\n\n@kapilguptamd`;
    if (tweet.length > 280) {
        createTweet();
    }
    sendTweet(tweet);
  };

function sendTweet(tweet) {
    console.log('Sending tweet');
    twitterClient.tweets.statusesUpdate({
        status: tweet
    }).then(response => {
        console.log("Tweeted!", response)
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
// }, 90000) //runs every 90 sec

connectToGoogleSheet();
