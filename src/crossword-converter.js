
const fs = require('fs');

/** 
Main conversion function that reads in the file and then outputs a new
text puzzle file */
exports.convertCrossword = function (filename) {
    console.log('Converting the file: ' + filename);
    // Read in the contents of the file
    const crossword = readCrosswordFile(filename);

    // Generate the new crossword format
    const convertedCrossword = generateNewCrosswordFormat(crossword);

    // Write the new file just switch the extension
    fs.writeFileSync(filename.replace('.json', '.txt'), convertedCrossword);
};

/** Read the contents of the file and parse to JSON */
function readCrosswordFile(filename) {
    const contents = fs.readFileSync(filename, 'utf8');
    return JSON.parse(contents);
}

/**
 * Take the existing crossword object and generate the string for the
 * new format
 * @param {*} crossword 
 */
function generateNewCrosswordFormat(crossword) {
    // Start building the parts of the file
    let output = '<ACROSS PUZZLE>\n';
    output += buildSimpleEntry('TITLE', crossword.metaData.title);
    output += buildSimpleEntry('AUTHOR', crossword.metaData.author);
    output += buildSimpleEntry('COPYRIGHT', crossword.metaData.instructionSecondary);
    output += buildSimpleEntry('SIZE', crossword.data.gridCol + 'x' + crossword.data.gridRow);
    output += buildGridEntry(crossword);
    output += buildClueEntries(crossword);
    return output;
}

/**
 * 
 * @param {string} key The key of the puzzle file entry
 * @param {string} value The value of the puzzle file entry
 */
function buildSimpleEntry(key, value) {
    return buildKeyRowString(key) + buildValueRowString(value);
}

/**
 * Build a simple key row string
 * @param {string} key The puzzle file key
 */
function buildKeyRowString(key) {
    return '<' + key + '>\n';
}

/**
 * Build a simple value row string
 * @param {string} value The value for the puzzle file
 */
function buildValueRowString(value) {
    return '\t' + value + '\n';
}

/**
 * Build the grid entry which is based on the individual cells
 * @param {*} crossword The main crossword object
 */
function buildGridEntry(crossword) {
    let returnValue = buildKeyRowString('GRID');
    const cols = crossword.data.gridCol;

    let currentRow = '\t';
    for (const [i, v] of crossword.data.gCells.entries()) {
        if (i > 0 && i % cols == 0) {
            returnValue = returnValue + currentRow + '\n';
            currentRow = '\t';
        }
        currentRow = currentRow + getCellValue(v.cellChar);
    }
    returnValue = returnValue + currentRow + '\n';

    return returnValue;
}

/**
 * Build the across and down entries
 * @param {*} crossword 
 */
function buildClueEntries(crossword) {
    let returnValue = '';
    // Find all the clues
    const clues = findClues(crossword);
    // Add the across clues to the result
    returnValue += buildKeyRowString('ACROSS') + clues[0];
    // Add the down clues to the result
    returnValue += buildKeyRowString('DOWN') + clues[1];
    return returnValue;
}

/**
 * Generate individual entries for each of the clues and put them
 * in an array.  First entry are the across clues and second entry
 * is for the down clues
 * @param {*} crossword 
 */
function findClues(crossword) {
    let across = '';
    let down = '';
    for (let clue of crossword.data.clues) {
        if (clue.clueType === 'across') {
            across = across + '\t' + clue.text + '\n';
        } else if (clue.clueType === 'down') {
            down = down + '\t' + clue.text + '\n';
        }
    }
    return [across, down];
}

/**
 * Get the appropriate grid value for the current cell
 * @param {string} charToTest 
 */
function getCellValue(charToTest) {
    let returnValue;
    if (charToTest) { // If there is value then use it
        returnValue = charToTest;
    } else { // If no value then insert a period
        returnValue = '.';
    }
    return returnValue;
}


