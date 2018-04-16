@echo off

echo This script will create the necessary files and folders to get you started.
echo For more information, visit https://github.com/hutsoninc/coop-claim-automation

set csvHeaders=Media Type,Invoice Amount,Media Name,Invoice Number,Invoice Date,Preapproval Number,Nested

set /p yourName=Enter your first and last name: 
set /p yourEmail=Enter your work email: 
set /p yourPhone=Enter your work phone number: 
set /p deereUser=Enter your Deere account username: 
set /p deerePwd=Enter your Deere account password: 

echo Visit this webpage http://advertising.deere.com/Reporting/Dealer/DealerNumberSelection.aspx and enter your dealer number

set /p deereURL=Copy the URL and enter it here: 

echo DEERE_CLAIM_URL=>.env
echo DEERE_USER=%deereUser%>>.env
echo DEERE_PWD=%deerePwd%>>.env

echo Created .env file

mkdir claim-data

mkdir claim-data\processed claim-data\zipped claim-data\skipped

echo Created claim-data folders

echo {"email": "%yourEmail%", "name": "%yourName%", "phone": "%yourPhone%"}> app\config.json

echo Created config.json file

echo %csvHeaders%>app\claims.csv

echo.>app\claims.json

echo Created claims.json and claims.csv files

set /p temp="Press enter to exit..."