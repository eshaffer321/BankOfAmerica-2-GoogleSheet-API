# Bank Of America to Google Spreadsheet - Web Server
[![CircleCI](https://circleci.com/gh/eshaffer321/BankOfAmerica-2-GoogleSheet-API.svg?style=svg)](https://circleci.com/gh/eshaffer321/BankOfAmerica-2-GoogleSheet-API)
[![Coverage Status](https://coveralls.io/repos/github/eshaffer321/boa-spreadsheet-api/badge.svg?branch=master)](https://coveralls.io/github/eshaffer321/boa-spreadsheet-api?branch=master)
![Docker Pulls](https://img.shields.io/docker/pulls/erickshaffer/boa-spreadsheet-api.svg)

Bank transactions categorized automatically inserted into a [google sheet](https://docs.google.com/spreadsheets/d/14GYLeWTUBPFWYzXMAJJV4YPmwcsf6vabkQ0-CeHSqHQ/edit?usp=sharing).
## About
The motivation behind this project is that my spouse and I have different bank accounts. I wanted to centralize our 
bank transactions into a single google sheet. However, I don't like spending time manually inserting
transactions into the sheet. So I created an automated way to centralize multiple bank accounts into one sheet.


In addition, I wanted to have the transactions be categorized. Bank of America has categorization but often times they 
don't put transactions into categories that I want. For example, if I go to a winery that would fall under entertainment
while Bank of America categorizes it as groceries. To solve that, this service allows custom rules be implemented to re-categorize transactions.


The transaction are screen scraped from a [python web scraper](https://github.com/eshaffer321/boa-web-scraper). 
The gathered transactions are sent via RESTful calls to this service, which then re-categorizes and inserts them into a google spread sheet.

## Getting Started

Start the project by running:
### Running locally
```
npm install
```
You will need a google service account with correct IAM policies for accesing google sheets api. The private key and email from the google provided `credentials.json` must be placed in the `.env` file. Additionally, the service account email must be granted access to the spreadsheet.

### Running with Docker
Use the following command to start a docker container with the latest image. Please make sure that all the following environment variables are set in your shell before running.
```
sudo docker run --name=boa-api -p 80:80 -d \
           -v ~/log:/app/log \
           --env PRIVATE_KEY="${PRIVATE_KEY}" \
           --env SPREADSHEET_ID="${SPREADSHEET_ID}" \
           --env SHEET_ID="${SHEET_ID}" \
           --env CLIENT_EMAIL="${CLIENT_EMAIL}" \
           --env MAILGUN_API_KEY="${MAILGUN_API_KEY}" \
           --env TO_EMAIL="${TO_EMAIL}" \
           --env MAILGUN_DOMAIN="${MAILGUN_DOMAIN}" \
            erickshaffer/boa-spreadsheet-api:latest
```

## Environment Variables
These are the environment variables that must be set. If you would like to get email reports from mail gun,
provide the mailgun credentials.
```
SPREADSHEET_ID=
SHEET_ID=
PORT=
NODE_ENV=
CLIENT_EMAIL=
PRIVATE_KEY=
MAILGUN_API_KEY=
MAILGUN_DOMAIN=
TO_EMAIL=
```
## How it works
There are 2 important files that allow the service to correctly insert transcation into the sheet. 
The first is [rules.json](https://github.com/eshaffer321/boa-spreadsheet-api/blob/master/static/rules.json).
This use regular expressions to match properties of a transaction, and re-categorize based on the item. Here is an example of a rule that would re-categorize an item that matched the pattern /VINEYARD/ to groceries. 

```
{
    "expression": "VINEYARDS",
    "properties_to_match": [
      "merchant_name"
    ],
    "updated_values": {
      "category": "Entertainment"
    }
  }
```

It is possible to use values to recategorize transactions.
```
{
    "expression": "59.00",
    "properties_to_match": [
      "amount"
    ],
    "updated_values": {
      "category": "Phones"
    }
  },
  ```
  
The rules are evaluated sequentially. The last matching expression is the one that will be used on the transaction. 


The second important file is [ranges.json](https://github.com/eshaffer321/boa-spreadsheet-api/blob/master/static/ranges.json). 
This defines what the column numbers are for each of the category types. This maps a name to a column number. This column number is the left most column of the 3 merged cells. This is where you could change the column layout, and include new columns.

The ranges for which for which cells are pulled from the api are located in the class constructor. To adjust what ranges are used, make changes here.
```
export class Balance {
    constructor() {
        this.range = 'A10:D15';
    }
}
```

# Testing
To run the test:
```
npm test
```
