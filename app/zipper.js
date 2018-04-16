var fs = require('fs');
var archiver = require('archiver');

exports.run = function() {

    return new Promise(function(resolve, reject){

        var i = 0;
        var nestedDirectories = [];

        getClaims().then(claims => {

            zipFiles();
            
            function zipFiles(){

                var currentClaim = claims.data[i];

                getOutputStream(currentClaim, function(outputStream){

                    var archive = archiver('zip', {
                        zlib: {
                            level: 9
                        }
                    });
                
                    outputStream.on('close', function() {
                                
                        moveFiles(currentClaim);
                
                    });
                
                    archive.on('warning', function(err) {
        
                        if (err.code === 'ENOENT') {
        
                            console.log("ENOENT Warning: " + err);
        
                        }else {
        
                            console.log(err);
        
                        }
        
                    });
                
                    archive.on('error', function(err) {
        
                        moveFiles(currentClaim, err);
        
                    });
                
                    archive.pipe(outputStream);
                
                    archive.directory('./claim-data/' + currentClaim['Preapproval Number'], '/');
                
                    archive.finalize();

                });
    
            }

            function increment() {
            
                i++;
                
                if(i < claims.data.length){

                    zipFiles();

                }else {

                    console.log('Finished zipping.');
                    
                    if(nestedDirectories.length > 0){
                        
                        removeNested();

                    }else {

                        resolve();
                    
                    }

                }

            }

            function removeNested() {

                var k = 0;

                removeFiles();

                function removeFiles() {

                    fs.rmdir('./claim-data/' + nestedDirectories[k], function(){

                        incrementRemove();

                    });

                }

                function incrementRemove() {

                    k++;

                    if(k == nestedDirectories.length){

                        resolve();

                    }else {

                        removeFiles();

                    }

                }

            }
            
            function getOutputStream(currentClaim, callback){

                if(currentClaim.Nested.toString().toLowerCase() == 'true') {

                    checkDirectory('./claim-data/zipped/' + currentClaim['Preapproval Number'], function(err){
                        
                        callback(fs.createWriteStream('./claim-data/zipped/' + currentClaim['Preapproval Number'] + '/' + currentClaim['Invoice Number'] + '.zip'));

                    });
                    
                }else {

                    callback(fs.createWriteStream('./claim-data/zipped/' + currentClaim['Preapproval Number'] + '.zip'));

                }

            }

            function moveFiles(currentClaim, err){

                var mainDir;

                if(err) {

                    console.log('Skipping due to error: ' + err);
                    mainDir = 'skipped';
                    
                }else {
                    
                    mainDir = 'processed';

                }
                                
                if(currentClaim.Nested.toString().toLowerCase() == 'true') {

                    if(nestedDirectories.indexOf(currentClaim['Preapproval Number']) == -1) {
                        nestedDirectories.push(currentClaim['Preapproval Number']);
                    }

                    checkDirectory('./claim-data/' + mainDir + '/' + currentClaim['Preapproval Number'], function(err){
                        
                        if(err) {

                            console.log(err);

                        }else {

                            fs.rename('./claim-data/' + currentClaim['Preapproval Number'] + '/' + currentClaim['Invoice Number'], './claim-data/' + mainDir + '/' + currentClaim['Preapproval Number'] + '/' + currentClaim['Invoice Number'], function (err) {

                                if(err) console.log(err);
                                console.log('Handled ' + currentClaim['Invoice Number']);
                                increment();
                                
                            });

                        }

                    });

                }else {

                    fs.rename('./claim-data/' + currentClaim['Preapproval Number'], './claim-data/' + mainDir + '/' + currentClaim['Preapproval Number'], function (err) {

                        if(err) console.log(err);
                        console.log('Handled ' + currentClaim['Preapproval Number']);
                        increment();
                        
                    });

                }
                
            }

            function checkDirectory(directory, callback) {  

                fs.stat(directory, function(err, stats) {

                    if (err && err.code == 'ENOENT') {

                        fs.mkdir(directory, callback);

                    }else {

                        callback(err);

                    }

                });

            }

        });
        
        // fetches the array of claims to be submitted
        function getClaims(){

            return new Promise(function(resolve, reject){

                fs.readFile('./app/claims.json', 'utf8', function (err, data) {

                    if(err) console.log(err);
            
                    resolve(JSON.parse(data));
                    
                });

            });

        }

    });

}