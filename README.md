# Compare Spec-Up-T-Specs

A command-line tool that compares your local `specs.json` file with a reference `specs.json` file from the spec-up-t GitHub repository.

## Overview

This tool helps you identify differences between your local `specs.json` configuration and the [reference configuration](https://github.com/blockchainbird/spec-up-t/blob/master/src/install-from-boilerplate/boilerplate/specs.json). It's particularly useful for:

- Ensuring your specs configuration adheres to the reference standard
- Identifying custom configurations you've added
- Finding missing required configurations

## Installation

You can install this tool globally:

```bash
npm install -g compare-spec-up-t-specs
```

Or locally in your project:

```bash
npm install compare-spec-up-t-specs --save-dev
```

## Usage

### Global Installation

If you've installed the tool globally, you can run it from any directory containing a `specs.json` file:

```bash
compare-spec-up-t-specs
```

### Local Installation

If you've installed it locally, you can run it using npx:

```bash
npx compare-spec-up-t-specs
```

### Direct Usage with npx (No Installation)

You can run the tool directly without installing it by using npx:

```bash
npx compare-spec-up-t-specs
```

This will download and execute the package in a single command, which is convenient for one-time use or when you want to try the package without installing it.

### As a Script in package.json

Add it to your package.json scripts:

```json
"scripts": {
  "compare-specs": "compare-spec-up-t-specs"
}
```

Then run:

```bash
npm run compare-specs
```

## How It Works

1. The tool fetches the reference `specs.json` file from: 
   `https://raw.githubusercontent.com/blockchainbird/spec-up-t/master/src/install-from-boilerplate/boilerplate/specs.json`

2. It reads your local `specs.json` file from the current directory

3. Both JSON objects are normalized by sorting their keys to ensure the comparison focuses on content differences rather than key ordering

4. The tool displays a diff between the two files with:
   - Red (-) lines: Parts present in the reference file but missing in your local file
   - Green (+) lines: Parts present in your local file but missing in the reference file

## Notes

- JSON objects are unordered, so the order of keys does not affect the comparison
- If your JSON contains arrays, differences in array order will be shown as those are ordered collections
- Keys that appear in green are not present in the reference file, which means they are not part of the standard spec

## Dependencies

- [diff](https://www.npmjs.com/package/diff): For generating text differences
- [readline](https://nodejs.org/api/readline.html): For interactive command line interface

## License

MIT

## Related Projects

- [spec-up-t](https://github.com/blockchainbird/spec-up-t): The reference project for specs.json
- [KERI](https://github.com/Blockchain-Bird/KERI): Key Event Receipt Infrastructure
