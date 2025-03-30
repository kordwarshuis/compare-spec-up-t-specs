#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const diff = require('diff');

// URL of the reference JSON file
const referenceUrl = 'https://example.com/specs.json';

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

// Main comparison function
async function main() {
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
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

main();