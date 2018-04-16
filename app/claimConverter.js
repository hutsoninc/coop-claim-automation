var fs = require('fs');
const csv = require('csvtojson');

exports.run = function() {

    return new Promise(function(resolve, reject) {

        console.log('Converting csv to JSON.')

        var output = {
            data: []
        };
        
        csv({
            noheader: false,
            headers: ['Media Type', 'Invoice Amount', 'Media Name', 'Invoice Number', 'Invoice Date', 'Preapproval Number', 'Nested']
        })
        .fromFile('./app/claims.csv')
        .on('json', (jsonObj) => {
        
            output.data.push(jsonObj);
        
        })
        .on('done', (error) => {
        
            fs.writeFile('./app/claims.json', JSON.stringify(output), (err) => {
        
                if(err) console.log(err);
                finished();
        
            });

            function finished() {
                console.log('Finished converting to JSON.');
                resolve();
            }
        
        });

    });

}