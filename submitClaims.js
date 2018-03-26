require('dotenv').config();
const app = require('./app/app.js');
const zipper = require('./app/zipper.js');
const claimConverter = require('./app/claimConverter.js');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Would you like to convert claims.csv? (y or n)\nType n if you entered claim data in claims.json\n', (answer) => {

    if(answer == 'y'){

        claimConverter.run().then(() => {

            startApp();

        });

    }else {

        startApp();

    }

    rl.close();

});

function startApp() {
    
    zipper.run().then(() => {
        
        app.run().then((returnError) => {
        
            if(returnError){
                console.log('Error occured. Exiting...');
                process.exit(0);
            }
        
        });
    
    });

}