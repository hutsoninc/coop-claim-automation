var fs = require('fs');
var archiver = require('archiver');

exports.run = function() {

    return new Promise(function(resolve, reject){

        console.log('Starting zip process.')

        var i = 0;
        
        fs.readdir('./claim-data/', (err, files) => {
            
            (function processFiles() {
                                
                if(files[i] == 'processed' || files[i] == 'skipped' || files[i] == 'zipped') {
                
                    increment();
                
                }else {
                
                    var output = fs.createWriteStream('./claim-data/zipped/' + files[i] + '.zip');

                    var archive = archiver('zip', {
                        zlib: {
                            level: 9
                        }
                    });
                
                    output.on('close', function() {
                                
                        moveFiles();
                
                    });
                
                    archive.on('warning', function(err) {

                        if (err.code === 'ENOENT') {

                            console.log("ENOENT Warning: " + err);

                        }else {

                            console.log(err);

                        }

                    });
                
                    archive.on('error', function(err) {

                        moveFiles(err);

                    });
                
                    archive.pipe(output);
                
                    archive.directory('./claim-data/' + files[i], '/');
                
                    archive.finalize();
                
                }

                function moveFiles(err){

                    if(err){
                    
                        console.log(err);
                        
                        fs.rename('./claim-data/' + files[i], './claim-data/skipped/' + files[i], function (err) {

                            if(err) console.log(err);
                            console.log('Skipped ' + files[i]);
                            increment();
                            
                        });
                        
                    }else{
                        
                        fs.rename('./claim-data/' + files[i], './claim-data/processed/' + files[i], function (err) {
                            
                            if(err) console.log(err);
                            console.log('Processed ' + files[i]);
                            increment();
                
                        });
                        
                    }
                    
                }

                function increment() {

                    i++;
                    
                    if(i < files.length){

                        processFiles();

                    }else {

                        console.log('Finished zipping.');
                        resolve();

                    }

                }

            })();

        });

    });

}