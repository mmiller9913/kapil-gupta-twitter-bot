// require('dotenv').config({ path: '.env' });


// //added b/c of aws
// const retrieveSecrets = require("./retrieveSecrets");
// const fs = require("fs").promises;
// const dotenv = require("dotenv");


// const app = require('./app');
// // app.set('port', process.env.PORT || 3000);
// const port = process.env.port || 3000;
// app.listen(port, async () => {

//   //added b/c of aws
//   try {
//     //get secretsString:
//     const secretsString = await retrieveSecrets();

//     //write to .env file at root level of project:
//     await fs.writeFile(".env", secretsString);

//     //configure dotenv package
//     dotenv.config();

//     console.log(`Express running → PORT ${server.address().port}`);

//   } catch (error) {
//     //log the error and crash the app
//     console.log("Error in setting environment variables", error);
//     process.exit(-1);
//   }
// });

require('dotenv').config({ path: '.env' });

const app = require('./app');
app.set('port', process.env.PORT || 3000);
const server = app.listen(app.get('port'), () => {
    console.log(`Express running → PORT ${server.address().port}`);
  });


  