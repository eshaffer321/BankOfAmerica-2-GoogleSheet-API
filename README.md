# Bank Of America Spreadsheet API
[![CircleCI](https://circleci.com/gh/eshaffer321/boa-spreadsheet-api.svg?style=svg)](https://circleci.com/gh/eshaffer321/boa-spreadsheet-api)
Bank transcation categorized and inserted into a google sheet.
## About
The motivation of this api is to input bank of america transactions into a categorized google sheet. The transcations are sent from a [https://github.com/eshaffer321/boa-web-scraper](python web scraper). This api is capable of creating new sheets each month from a template and inserting transactions, account balances, and income. 

## Getting Started
Start the project by running:
```
npm install
```
You will need a google service account with an authorization json file placed in `auth/private.json` This service account must be granted access to the spreadsheet for it to edit.

## Environment Variables
This project uses a `.env` file for environment variables. This requires a spreadsheet id which can be found in the url of a google sheet. It also requires a sheet id, which is a template sheet that will be copied each month. Here is an example of the `.env` file:
```
SPREADSHEET_ID=
SHEET_ID=
PORT=3000
NODE_ENV=
```
## How it works
There are 2 important files that help the api insert transcation into the sheet. The first is called `rules.json`. This use regular expressions to match properties of a transcation, and recategorize based on the item. This allows custom rules to be implemented for categorizations. The second file is `ranges.json`. This defines what the column numbers are for each of the category types. 

# Testing
To run the test run:
```
npm test
```
