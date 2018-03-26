# Co-op Claim Automation

Automatically fills out form and uploads files for co-op claims.

## Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/en/)

### Installing

Clone the repo

```
git clone https://github.com/hutsoninc/coop-claim-automation.git
```

Move into the repo directory and run `npm install`

```
cd coop-claim-automation && npm install
```

### Setup

Create a new file called `.env` in the root directory and enter your environment variables.

```
DEALER_CLAIM_URL=your-url
DEERE_USER=your-username
DEERE_PWD=your-password
```

Make a directory to store claim data. 

> _This is where you will store all the files necessary to submit a claim. When submitting a claim, make a new folder and name it with the preapproval number._

```
mkdir claim-data
cd claim-data && mkdir processed skipped zipped
```

Move back to the root directory, then into the app directory.

```
cd ../app
```

Create claim and config files.

> _The `claims.csv` file is where you will enter in your claim information. You may also enter it in the `claims.json` file directly._

```
touch claims.csv claims.json config.json
```

**Windows**

```
echo "" > claims.csv
echo "" > claims.json
echo "" > config.json
```

In `config.json` file:

```
{
    "email": "your-email",
    "name": "your-name",
    "phone": "your-phone"
}
```

In `claims.csv` file:

```
Media Type,Invoice Amount,Media Name,Invoice Number,Invoice Date,Preapproval Number
```

## Built With

* [Puppeteer](https://github.com/GoogleChrome/puppeteer) - Headless Chrome Node API

## Authors

* **Austin Gordon** - *Development* - [GitHub](https://github.com/AustinLeeGordon)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.