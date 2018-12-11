require('dotenv').config();
const app = require('./app/app.js');
const zipper = require('./app/zipper.js');
const claimConverter = require('./app/claimConverter.js');

claimConverter.run().then(() => {

    startApp();

});

function startApp() {
    
    zipper.run().then(() => {
        
        app.run().then((returnError) => {
        
            if(returnError){
                console.log('Error occured. Exiting...');
                process.exit(0);
            }

            console.log('Uploading completed');
        
        });
    
    });

}