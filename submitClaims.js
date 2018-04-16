require('dotenv').config();
const app = require('./app/app.js');
const zipper = require('./app/zipper.js');
const claimConverter = require('./app/claimConverter.js');
var fs = require('fs');

var csvHeaders = "Media Type,Invoice Amount,Media Name,Invoice Number,Invoice Date,Preapproval Number,Nested";

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

            fs.writeFile('./app/claims.csv', csvHeaders, err => {

                if(err) console.log(err);

                console.log('Reset claims.csv');
                console.log('Uploading completed');

            });
        
        });
    
    });

}