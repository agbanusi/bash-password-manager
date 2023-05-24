var userInput = require('yargs')
    .command('createAccount', 'Creates an account', function (yargs) {
        yargs.options({
            accountName: {
                demand: true,
                description: 'Account name goes here',
                type: 'string',
                alias: 'a'
            },
            username: {
                demand: true,
                description: 'Username goes here',
                type: 'string',
                alias: 'u'
            },
            password: {
                demand: true,
                description: 'Password',
                type: 'string',
                alias: 'p'
            },
            masterPassword: {
                demand: true,
                description: 'You must enter the master password to save an account',
                type: 'string',
                alias: 'm'
            }
        }).help('help');
    })
    .command('getAccount', 'Retrieves an account', function (yargs) {
        yargs.options({
            accountName: {
                demand: true,
                alias: 'a',
                description: 'Account name goes here',
                type: 'string'
            },
            masterPassword: {
                demand: true,
                alias: 'm',
                description: 'You must enter the master password to retrieve an account',
                type: 's'
            }
        }).help('help');
    })
    .help('help')
    .argv;


module.exports.userInput = function() {return userInput};
module.exports.userInput.command = function() {return userInput._[0]};
