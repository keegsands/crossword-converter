const converter = require('./crossword-converter.js');

// Grab the arguments
let myArgs = process.argv.slice(2);

if (myArgs.length > 0) { // If there is an argument then use it
    converter.convertCrossword(myArgs[0]);
} else { // If not arg then use the default file name
    converter.convertCrossword('./sample-data/default-crossword.json');
}
console.log('Crossword puzzle conversion complete');

