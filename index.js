#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const diff = require('diff');
const readline = require('readline'); // Add this line to import readline

// URL of the reference JSON file
const referenceUrl = 'https://raw.githubusercontent.com/blockchainbird/spec-up-t/master/src/install-from-boilerplate/boilerplate/specs.json';

// Fetch the reference JSON from a URL
function fetchReferenceJson() {
    return new Promise((resolve, reject) => {
        https
            .get(referenceUrl, (res) => {
                let data = '';
                res.on('data', (chunk) => (data += chunk));
                res.on('end', () => resolve(data));
            })
            .on('error', (err) => reject(err));
    });
}

// Sort object keys recursively
function sortObject(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }
    if (Array.isArray(obj)) {
        return obj.map(sortObject);
    }
    return Object.keys(obj)
        .sort()
        .reduce((acc, key) => {
            acc[key] = sortObject(obj[key]);
            return acc;
        }, {});
}

// Function to wait for the user to press Enter
function waitForEnter() {
    return new Promise((resolve) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question('Press Enter to continue...\n\n', () => {
            rl.close();
            resolve();
        });
    });
}

// Main comparison function
async function main() {
    console.log(`



╭━━━╮╱╱╱╱╱╱╱╱╱╱╭╮╱╭╮╱╱╱╱╭━━━━╮╱╱╭┳━━━┳━━━┳━╮╱╭╮
┃╭━╮┃╱╱╱╱╱╱╱╱╱╱┃┃╱┃┃╱╱╱╱┃╭╮╭╮┃╱╱┃┃╭━╮┃╭━╮┃┃╰╮┃┃
┃╰━━┳━━┳━━┳━━╮╱┃┃╱┃┣━━╮╱╰╯┃┃╰╯╱╱┃┃╰━━┫┃╱┃┃╭╮╰╯┃
╰━━╮┃╭╮┃┃━┫╭┳┻━┫┃╱┃┃╭╮┣━━╮┃┃╱╱╭╮┃┣━━╮┃┃╱┃┃┃╰╮┃┃
┃╰━╯┃╰╯┃┃━┫╰┻┳━┫╰━╯┃╰╯┣━━╯┃┃╱╱┃╰╯┃╰━╯┃╰━╯┃┃╱┃┃┃
╰━━━┫╭━┻━━┻━━╯╱╰━━━┫╭━╯╱╱╱╰╯╱╱╰━━┻━━━┻━━━┻╯╱╰━╯
╱╱╱╱┃┃╱╱╱╱╱╱╱╱╱╱╱╱╱┃┃
╱╱╱╱╰╯╱╱╱╱╱╱╱╱╱╱╱╱╱╰╯
╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╭╮╱╱╱╱╱╱╭╮
╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╭╯╰╮╱╱╱╱╱┃┃
╭━━┳━━┳╮╭┳━━┳━━┳━┳┳━━┳━━┳━╮╱╰╮╭╋━━┳━━┫┃
┃╭━┫╭╮┃╰╯┃╭╮┃╭╮┃╭╋┫━━┫╭╮┃╭╮╮╱┃┃┃╭╮┃╭╮┃┃
┃╰━┫╰╯┃┃┃┃╰╯┃╭╮┃┃┃┣━━┃╰╯┃┃┃┃╱┃╰┫╰╯┃╰╯┃╰╮
╰━━┻━━┻┻┻┫╭━┻╯╰┻╯╰┻━━┻━━┻╯╰╯╱╰━┻━━┻━━┻━╯
╱╱╱╱╱╱╱╱╱┃┃
╱╱╱╱╱╱╱╱╱╰╯


Welcome to the JSON comparison tool!

This script compares your local 'specs.json' file with the reference JSON file: https://github.com/blockchainbird/spec-up-t/blob/master/src/install-from-boilerplate/boilerplate/specs.json

The differences are displayed with the following indicators:

- Red (-) lines: These are parts present in the reference file but missing in your local file.
- Green (+) lines: These are parts present in your local file but missing in the reference file.

Please note that JSON objects are unordered, so the order of keys does not affect the comparison.
The script normalizes the JSON by sorting the keys to ensure that only actual content differences are highlighted.
However, if your JSON contains arrays, which are ordered, differences in array order will be shown.

Keys that are green are not present in the reference file, which means they are not part of the spec.
`);

    // Wait for the user to press Enter before proceeding
    await waitForEnter();

    try {
        // Fetch and parse the reference JSON
        const referenceJsonString = await fetchReferenceJson();
        const referenceJson = JSON.parse(referenceJsonString);

        // Read and parse the local JSON
        const localJsonString = fs.readFileSync('specs.json', 'utf8');
        const localJson = JSON.parse(localJsonString);

        // Normalize both objects
        const sortedReference = sortObject(referenceJson);
        const sortedLocal = sortObject(localJson);

        // Stringify with consistent formatting
        const referenceFormatted = JSON.stringify(sortedReference, null, 2);
        const localFormatted = JSON.stringify(sortedLocal, null, 2);

        // Compute differences
        const differences = diff.diffLines(referenceFormatted, localFormatted);
        const hasDifferences = differences.some((part) => part.added || part.removed);

        if (!hasDifferences) {
            console.log('No differences found.');
        } else {
            // Display differences with colors
            differences.forEach((part) => {
                if (part.added) {
                    part.value.split('\n').forEach((line) => {
                        if (line) console.log('\x1b[32m+ ' + line + '\x1b[0m');
                    });
                } else if (part.removed) {
                    part.value.split('\n').forEach((line) => {
                        if (line) console.log('\x1b[31m- ' + line + '\x1b[0m');
                    });
                } else {
                    part.value.split('\n').forEach((line) => {
                        if (line) console.log('  ' + line);
                    });
                }
            });
        }

        console.log(`

***************************
- Red (-) lines: These are parts present in the reference file but missing in your local file.
- Green (+) lines: These are parts present in your local file but missing in the reference file.
***************************
`);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

main();