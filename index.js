#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const diff = require('diff');

// URL of the reference specs.json file
const referenceUrl = 'https://raw.githubusercontent.com/blockchainbird/spec-up-t/master/src/install-from-boilerplate/boilerplate/specs.json';

// Function to fetch the reference JSON from GitHub
function fetchReferenceJson() {
    return new Promise((resolve, reject) => {
        https.get(referenceUrl, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                resolve(data);
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
}

// Main async function to compare the JSON files
async function main() {
    try {
        // Fetch the reference JSON
        const referenceJsonString = await fetchReferenceJson();

        // Read the local specs.json from the current directory
        const localJsonString = fs.readFileSync('specs.json', 'utf8');

        // Parse both JSON strings into objects
        const referenceJson = JSON.parse(referenceJsonString);
        const localJson = JSON.parse(localJsonString);

        // Normalize formatting by stringifying with 2-space indentation
        const referenceFormatted = JSON.stringify(referenceJson, null, 2);
        const localFormatted = JSON.stringify(localJson, null, 2);

        // Compute line-by-line differences
        const differences = diff.diffLines(referenceFormatted, localFormatted);

        // Check if there are any differences
        const hasDifferences = differences.some(part => part.added || part.removed);

        if (!hasDifferences) {
            console.log('No differences found.');
        } else {
            // Display differences with colors and prefixes
            differences.forEach((part) => {
                if (part.added) {
                    part.value.split('\n').forEach(line => {
                        if (line !== '') {
                            process.stdout.write('\x1b[32m+ ' + line + '\x1b[0m\n');
                        }
                    });
                } else if (part.removed) {
                    part.value.split('\n').forEach(line => {
                        if (line !== '') {
                            process.stdout.write('\x1b[31m- ' + line + '\x1b[0m\n');
                        }
                    });
                } else {
                    part.value.split('\n').forEach(line => {
                        if (line !== '') {
                            process.stdout.write('  ' + line + '\n');
                        }
                    });
                }
            });
        }
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

// Execute the main function
main();