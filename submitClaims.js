require('dotenv').config();
const app = require('./app/app.js');
const zipper = require('./app/zipper.js');

zipper.run().then(() => {
    
    app.run().then((returnError) => {
    
        if(returnError){
            console.log('Error occured. Exiting...');
            process.exit(0);
        }
    
    });
});