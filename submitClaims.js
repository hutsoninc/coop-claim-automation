require('dotenv').config();
const app = require('./app/app.js');

app.run().then((returnError) => {

    if(returnError){
        console.log('Error occured. Exiting...');
        process.exit(0);
    }

});