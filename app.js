var crypto = require("crypto-js");
var storage = require("node-persist");
var argv = require("./argv-config.js");
require("dotenv").config();
var actualMasterPassword = process.env.PASSWORD_MANAGER_MASTER_PASSWORD;

function getAccounts(guessedMasterPassword) {
  var accounts = [];

  if (guessedMasterPassword === actualMasterPassword) {
    var encryptedAccounts = storage.getItemSync("accounts");

    if (encryptedAccounts) {
      var bytes = crypto.AES.decrypt(encryptedAccounts, guessedMasterPassword);
      accounts = JSON.parse(bytes.toString(crypto.enc.Utf8));
    }
  } else {
    console.log("Incorrect master password. Please try again");
  }
  return accounts;
}

function saveAccounts(accounts, guessedMasterPassword) {
  if (guessedMasterPassword === actualMasterPassword) {
    var encryptedAccounts = crypto.AES.encrypt(
      JSON.stringify(accounts),
      guessedMasterPassword
    );
    storage.setItemSync("accounts", encryptedAccounts.toString());
  } else {
    console.log("Incorrect master password. Please try again");
  }
}

function createAccount(account, masterPassword) {
  var accounts = getAccounts(masterPassword);

  if (typeof accounts === "undefined") {
    accounts = [];
  }
  accounts.push(account);
  saveAccounts(accounts, masterPassword);
}

function getAccount(accountName, masterPassword) {
  var accounts = getAccounts(masterPassword);
  var matchedAccount;

  try {
    accounts.forEach(function (account) {
      if (account.accountName === accountName) {
        matchedAccount = account;
      }
    });
    console.log("Found account: " + JSON.stringify(matchedAccount));
    return matchedAccount;
  } catch (err) {
    console.log("No accounts exits: " + err);
  }
}

function run() {
  storage.initSync();
  console.log("Starting Password Manager");

  if (argv.userInput.command() === "getAccount") {
    getAccount(argv.userInput().accountName, argv.userInput().masterPassword);
  }

  if (argv.userInput.command() === "createAccount") {
    var account = {
      accountName: argv.userInput().accountName,
      username: argv.userInput().username,
      password: argv.userInput().password,
    };
    createAccount(account, argv.userInput().masterPassword);
    console.log("Saved account: " + JSON.stringify(account));
  }
}

run();
