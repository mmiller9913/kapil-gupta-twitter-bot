const AWS = require('aws-sdk');

//For local testing: Storing the AWS_ACCESS_KEY_ID & AWS_SECRET_ACCESS_KEY
// AWS.config.loadFromPath('./aws-credentials.json'); 

const client = new AWS.SecretsManager({ region: "us-east-2" });

const getMySecret = async (SecretId) => {
    const s = await client.getSecretValue({ SecretId }).promise();
    return s.SecretString;
};

//Gets google-credentials secrets from AWS secrets manager 
//NOTE: For this to work, either have to uncomment line that reads AWS.config.loadFromPath('./aws-credentials.json') (do this when testing locally)
    //OR store AWS_ACCESS_KEY_ID & AWS_SECRET_ACCESS_KEY in AWS under configuration -> environment properties (this is what I did) (this will only work when using AWS server, not testing locally)
        //to make sure they're actually being stored as env variables, console.log(process.env)
    //OR, when testing locally, add AWS_ACCESS_KEY_ID & AWS_SECRET_ACCESS_KEY to process.env
        //how? see here: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-envvars.html
        //type the following in powershell in vscode
            //$Env:AWS_ACCESS_KEY_ID="AKIAIOSFODNN7EXAMPLE" (replace string with my key_id)
            //$Env:AWS_SECRET_ACCESS_KEY="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY" (replace with my access_key)
            //can then check these are part of local machine enviromental variables by console.log(process.env)
//Below was for testing, syntax indicates Async functions that run on load
// (async () => {
//     const secret = await getMySecret('google-credentials');
//     console.log('My secret:', secret);
//     // console.log(typeof secret); secret is a string, so need to parse it 
//     const googleCredentialsJson = JSON.parse(secret);
//     // console.log(googleCredentialsJson.client_email);
// })();

//the below would have been if I decided to access twitter api keys via secret manager, but I choose to store them under environment properties
// (async () => {
//     const secret_101 = await getMySecret('twitter-api-keys');
//     console.log('My secret:', secret_101);
// })();

exports.getGoogleCredentials = async() => {
    const secret = await getMySecret('google-credentials');
    const googleCredentialsJson = JSON.parse(secret);
    return googleCredentialsJson;
}
