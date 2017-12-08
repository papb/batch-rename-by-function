batch-rename-by-function
========================

[![npm package](https://nodei.co/npm/batch-rename-by-function.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/batch-rename-by-function/)

[![NPM version][npm-version-image]][npm-url]
[![Dependency Status](https://david-dm.org/papb/batch-rename-by-function.svg)](https://david-dm.org/papb/batch-rename-by-function)
[![MIT License][license-image]][license-url]
[![NPM downloads][npm-downloads-image]][npm-url]
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)](https://github.com/papb/batch-rename-by-function/issues)

Batch rename files and folders by providing a JS function.

DISCLAIMER: I wrote this mostly to improve my own NodeJS skills. Don't forget to consider the more known module, [`renamer`](https://github.com/75lb/renamer). Brief comparison:

* `renamer` has support for renaming nested files, while `batch-rename-by-function` does not.
* `batch-rename-by-function` allows you to write arbitrarily complicated javascript to calculate the new names for your files, while `renamer` does not support accepting a custom transform function yet (at the time of this writing, 2017-12-08, since apparently it will be added in the future).
* You don't have to know javascript to use `renamer`, but you must know it to use `batch-rename-by-function`.

How to use
----------

```
npm install -g batch-rename-by-function
```

Navigate to the folder you want, and create a JS file there, `foo.js`, like this:

```javascript
module.exports = filename => filename.replace("Season 1 - ", "Season 01 - ");
```

And then execute

```
batch-rename-by-function foo.js
```

to see all the changes that would be made, and if that's really what you want, execute

```
batch-rename-by-function foo.js --force
```

to force the actual renaming.

Should work in Windows and Linux.

The file `foo.js` doesn't really have to be in the same folder as the renames (just give the relative path for it). Also, `batch-rename-by-function` will automatically skip your JS file (in this example, `foo.js`) if it is present in the current directory (instead of trying to rename it as well).

The commands `batch-rename-by-function --help` and `batch-rename-by-function --version` are also available.

Changelog
---------

v1.0.0: Initial release


Acknowledgements
--------------------------------------

Thanks Rubens Mariuzzo for [this great guide on creating CLI utilities in NodeJS](https://x-team.com/blog/a-guide-to-creating-a-nodejs-command/).

Thanks Sindre Sorhus, Josh Junon and all other contributors for [`chalk`](https://github.com/chalk/chalk).

Thanks Sindre Sorhus for [`slash`](https://github.com/sindresorhus/slash).


License
--------------------------------------

MIT

[npm-url]: https://npmjs.org/package/batch-rename-by-function
[npm-version-image]: https://img.shields.io/npm/v/batch-rename-by-function.svg
[npm-downloads-image]: https://img.shields.io/npm/dt/batch-rename-by-function.svg

[license-image]: http://img.shields.io/badge/license-MIT-blue.svg
[license-url]: LICENSE