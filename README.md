batch-rename-by-function
=============

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

v0.0.1: Initial commit stuff, not ready to use yet


Acknowledgements
--------------------------------------

Thanks Rubens Mariuzzo for [this great guide on creating CLI utilities in NodeJS](https://x-team.com/blog/a-guide-to-creating-a-nodejs-command/).

Thanks Sindre Sorhus, Josh Junon and all other contributors for [`chalk`](https://github.com/chalk/chalk).

Thanks Sindre Sorhus for [`slash`](https://github.com/sindresorhus/slash).


License
--------------------------------------

MIT