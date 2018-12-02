batch-rename-by-function
========================

[![npm package](https://nodei.co/npm/batch-rename-by-function.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/batch-rename-by-function/)

[![NPM version][npm-version-badge]][npm-url]
[![License][license-badge]][license-url]
[![NPM downloads][npm-downloads-badge]][npm-url]
[![Dependency Status][dependency-status-badge]](https://david-dm.org/papb/batch-rename-by-function)
[![Dev Dependency Status][dev-dependency-status-badge]](https://david-dm.org/papb/batch-rename-by-function)
[![Open Issues][open-issues-badge]](https://github.com/papb/batch-rename-by-function/issues)
[![Closed Issues][closed-issues-badge]](https://github.com/papb/batch-rename-by-function/issues?q=is%3Aissue+is%3Aclosed)
[![contributions welcome][contrib-welcome-badge]](https://github.com/papb/batch-rename-by-function/issues)

Batch rename files and folders by providing a JS function.

# How to use

```
npm install -g batch-rename-by-function
```

Navigate to the folder you want, and create a JS file there, `my-renamer.js`, like this:

```javascript
module.exports = filename => filename.replace("Season 1 - ", "Season 01 - ");
```

And then execute

```
batch-rename-by-function my-renamer.js --dry-run
```

to see all the changes that would be made (without actually renaming anything, hence `dry-run`), and if that's really what you want, execute

```
batch-rename-by-function my-renamer.js
```

to perform the actual renaming. Note that `batch-rename-by-function` acts on every file/folder in the current working directory.

The file `my-renamer.js` doesn't have to be in the same folder as the renames (just give the relative path for it). Also, `batch-rename-by-function` will automatically skip your JS file (in this example, `my-renamer.js`) if it is present in the current directory (instead of trying to rename it as well).

The renaming function also receives a second boolean parameter, `isDirectory`, that can be useful:

```javascript
module.exports = (filename, isDirectory) => {
    // Skip folders
    if (isDirectory) return filename;

    // ...
};
```

The commands `batch-rename-by-function --help` and `batch-rename-by-function --version` are also available:

```
Usage: batch-rename-by-function path/to/my/renamer/file.js

  Applies the function exported by the given JS file on every file present in
  the current folder, except the given JS file (if present), including folders.

  The renaming function receives two parameters. The first is the name of the
  object (file/directory), and the second is a boolean which is true iff it is a
  directory. This way directories can be easily skipped, if desired.

Options:
  --help     Show help                                                 [boolean]
  --version  Show version number                                       [boolean]
  --dry-run  Show which renames would happen without actually performing them
                                                      [boolean] [default: false]

Examples:
  batch-rename-by-function myRenamer.js
```

# Why `batch-rename-by-function`?

A comparison with [`renamer`](https://github.com/75lb/renamer), a more known module for batch renaming:

* `batch-rename-by-function` allows you to write arbitrarily complicated javascript to calculate the new names for your files in a very straightforward way, while to do this with `renamer` you would have to develop a custom plugin.
* `renamer` has support for renaming nested files, while `batch-rename-by-function` does have it yet (see [#2](https://github.com/papb/batch-rename-by-function/issues/2)).
* You don't have to know JavaScript to use `renamer`, but you must know it to use `batch-rename-by-function`.

# Acknowledgements

Thanks Rubens Mariuzzo for [this great guide on creating CLI utilities in NodeJS](https://x-team.com/blog/a-guide-to-creating-a-nodejs-command/).

# Contributing

Any contribution is very welcome. Feel free to open an issue about anything: questions, suggestions, feature requests, bugs, improvements, mistakes, whatever. I will be always looking.

# Changelog

The changelog is available in [CHANGELOG.md](CHANGELOG.md).

# License

MIT (c) Pedro Augusto de Paula Barbosa

[npm-url]: https://npmjs.org/package/batch-rename-by-function
[npm-version-badge]: https://badgen.net/npm/v/batch-rename-by-function
[dependency-status-badge]: https://badgen.net/david/dep/papb/batch-rename-by-function
[dev-dependency-status-badge]: https://badgen.net/david/dev/papb/batch-rename-by-function
[npm-downloads-badge]: https://badgen.net/npm/dt/batch-rename-by-function
[open-issues-badge]: https://badgen.net/github/open-issues/papb/batch-rename-by-function
[closed-issues-badge]: https://badgen.net/github/closed-issues/papb/batch-rename-by-function
[contrib-welcome-badge]: https://badgen.net/badge/contributions/welcome/green
[license-badge]: https://badgen.net/npm/license/batch-rename-by-function
[license-url]: LICENSE
