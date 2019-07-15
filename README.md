# Bank Of America Google Spreadsheet API
[![CircleCI](https://circleci.com/gh/eshaffer321/boa-spreadsheet-api.svg?style=svg)](https://circleci.com/gh/eshaffer321/boa-spreadsheet-api)
[![Coverage Status](https://coveralls.io/repos/github/eshaffer321/boa-spreadsheet-api/badge.svg?branch=master)](https://coveralls.io/github/eshaffer321/boa-spreadsheet-api?branch=master)
![Docker Pulls](https://img.shields.io/docker/pulls/erickshaffer/boa-spreadsheet-api.svg)

Bank transactions categorized automatically inserted into a [google sheet](https://docs.google.com/spreadsheets/d/14GYLeWTUBPFWYzXMAJJV4YPmwcsf6vabkQ0-CeHSqHQ/edit?usp=sharing).
## About
The motivation behind this project is that my spouse and I have different bank accounts. I wanted to centralize our 
bank transactions into a single google sheet. However, I don't like spending time manually inserting
transactions into the sheet. So I created an automated way to centralize multiple bank accounts into one sheet.


In addition, I wanted to have the transactions be categorized. Bank of America has categorization but often times they 
don't put transactions into categories that I want. For example, if I go to a winery that would fall under entertainment
while Bank of America says it's groceries. So this system let's custom rules be implemented to re-categorize transactions.


The transaction are sent from a [python web scraper](https://github.com/eshaffer321/boa-web-scraper). 
This api is capable of creating new sheets each month from a template and inserting transactions, account balances, 
and income. 

## Getting Started
Start the project by running:
```
npm install
```
You will need a google service account with an authorization the private key in email must be placed in the `.env` file.
This service account must be granted access to the spreadsheet for it to edit.

## Environment Variables
This project uses a `.env` file for environment variables. This requires a spreadsheet id which can be found in the url 
of a google sheet. It also requires a sheet id, which is a template sheet that will be copied each month. 
Here is an example of the `.env` file:
```
SPREADSHEET_ID=
SHEET_ID=
PORT=
NODE_ENV=
CLIENT_EMAIL=
PRIVATE_KEY=
```
## How it works
There are 2 important files that help the api insert transcation into the sheet. 
The first is called [rules.json](https://github.com/eshaffer321/boa-spreadsheet-api/blob/master/static/rules.json). 
This use regular expressions to match properties of a transaction, and re-categorize based on the item. 
This allows custom rules to be implemented for categorizations. 
The second file is [ranges.json](https://github.com/eshaffer321/boa-spreadsheet-api/blob/master/static/ranges.json). 
This defines what the column numbers are for each of the category types. 

# Testing
To run the test run:
```
npm test
```
