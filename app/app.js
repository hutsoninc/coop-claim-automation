require('dotenv').config();
const puppeteer = require('puppeteer');
const helper = require('./helper.js');
var fs = require('fs');

exports.run = async function(){

    console.log('Starting upload.');

    var returnError, config, claims, mediaTypeID;

    fs.readFile('./app/config.json', 'utf8', function (err, data) {
        if (err) throw err;
        config = JSON.parse(data);
    });

    fs.readFile('./app/claims.json', 'utf8', function (err, data) {
        if (err) throw err;
        claims = JSON.parse(data);
    });
    
    const options = {
        headless: false,
        ignoreHTTPSErrors: true,
    };
	
	const browser = await puppeteer.launch(options);
	var page = await browser.newPage();

	try{

		await page.goto('https://dealerpath.deere.com/');

		await page.waitForSelector('#username');
		await page.type('#username', process.env.DEERE_USER);
		await page.type('[type="password"]', process.env.DEERE_PWD);
		await helper.delay(1000);
		await page.click('[name="login"]');

		await helper.delay(5000);

		await page.evaluate(() => {

			var loginTitle = document.querySelector('.login-title');

			if(loginTitle){

				if(loginTitle.innerText == 'Reset Password'){

					throw new Error('Password Expired');

				}

			}

			return;

        });
        
        for(var i = 0; i < claims.data.length; i++){

            // Submit Claims
            await page.goto(process.env.DEALER_CLAIM_URL);
            
            // Step 1
            await page.waitForSelector('#ctl00_ContentPlaceHolder1_ReportCenterTabContainer_DealerInformation_lnkbtnSubmitClaim');
            await page.click('#ctl00_ContentPlaceHolder1_ReportCenterTabContainer_DealerInformation_lnkbtnSubmitClaim');
            
            await page.waitForSelector('#ctl00_ContentPlaceHolder1_txtEmail');
            await page.type('#ctl00_ContentPlaceHolder1_txtEmail', config.email);
            
            await page.waitForSelector('#ctl00_ContentPlaceHolder1_txtContactName');
            await page.type('#ctl00_ContentPlaceHolder1_txtContactName', config.name);
            
            await page.waitForSelector('#ctl00_ContentPlaceHolder1_txtContactPhone');
            await page.type('#ctl00_ContentPlaceHolder1_txtContactPhone', config.phone);
            
            await page.keyboard.press('Enter');
            // await page.waitForSelector('#ctl00_ContentPlaceHolder1_btnStep1Next');
            // await page.click('#ctl00_ContentPlaceHolder1_btnStep1Next');
            
            // Step 2
            mediaTypeID = '#ctl00_ContentPlaceHolder1_rblMediatype_' + claims.data[i]['Media Type'];

            await page.waitForSelector(mediaTypeID);
            await page.click(mediaTypeID);

            await helper.delay(3000);
            
            await page.waitForSelector('#ctl00_ContentPlaceHolder1_txtInvoiceAmount');
            await page.type('#ctl00_ContentPlaceHolder1_txtInvoiceAmount', claims.data[i]['Invoice Amount']);
            
            await page.waitForSelector('#ctl00_ContentPlaceHolder1_txtMediaName');
            await page.type('#ctl00_ContentPlaceHolder1_txtMediaName', claims.data[i]['Media Name']);
            
            await page.waitForSelector('#ctl00_ContentPlaceHolder1_txtInvoiceNumber');
            await page.type('#ctl00_ContentPlaceHolder1_txtInvoiceNumber', claims.data[i]['Invoice Number']);
            
            await page.waitForSelector('#ctl00_ContentPlaceHolder1_txtInvoiceDate');
            await page.type('#ctl00_ContentPlaceHolder1_txtInvoiceDate', claims.data[i]['Invoice Date']);
            
            await page.waitForSelector('#ctl00_ContentPlaceHolder1_txtPANumber');
            await page.type('#ctl00_ContentPlaceHolder1_txtPANumber', claims.data[i]['Preapproval Number']);

            await page.keyboard.press('Enter');
            // await page.waitForSelector('#ctl00_ContentPlaceHolder1_btnStep2Next');
            // await page.click('#ctl00_ContentPlaceHolder1_btnStep2Next');

            // Step 3
            await page.waitForSelector('#ctl00_ContentPlaceHolder1_FileUpload1');
            const fileSelector = await page.$("input[type=file]");

            await fileSelector.uploadFile('./claim-data/zipped/' + claims.data[i]['Preapproval Number'] + '.zip');

            await page.waitForSelector('#ctl00_ContentPlaceHolder1_btnUpload');
            await page.click('#ctl00_ContentPlaceHolder1_btnUpload');

            await helper.delay(10000);

            await page.waitForSelector('#ctl00_ContentPlaceHolder1_btnStep3Next');
            await page.click('#ctl00_ContentPlaceHolder1_btnStep3Next');

            // Step 4
            await page.waitForSelector('#ctl00_ContentPlaceHolder1_btnStep4Next');
            await page.click('#ctl00_ContentPlaceHolder1_btnStep4Next');

            processCompleted(claims.data[i]['Preapproval Number'], claims.data[i]['Invoice Number'], claims.data[i]['Invoice Date'])

            await helper.delay(10000);
            
        }

	}catch(err){

		if(err){
			console.log(err);
			returnError = err;
		}

	}

	await browser.close();
	return returnError;
};

function processCompleted(preapprovalNumber, invoiceNumber, invoiceDate){

    return new Promise((resolve, reject) => {

        let currentDate = new Date();
        let logOutput = currentDate.getDay() + '/' + (currentDate.getMonth() + 1) + '/' + currentDate.getFullYear() + ','
                        + preapprovalNumber + ',' + invoiceNumber + ',' + invoiceDate;

        fs.unlink('./claim-data/zipped/' + preapprovalNumber + '.zip', (err) => {

            if(err) reject(err);

            fs.appendFile('./logs/log.csv', '\n' + logOutput, err => {
    
                if(err) reject(err);

                console.log('Logged and processed ' + preapprovalNumber);
    
            });
        });

    });

}