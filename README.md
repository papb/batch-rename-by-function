my-rename-all
=============

This is a very basic CLI utility written in NodeJS to allow batch renaming all files in the current folder.

I wrote this mostly to improve my own Node skills. Don't forget to consider the module [`renamer`](https://github.com/75lb/renamer) as well.

* `renamer` has support for renaming nested files, while `my-rename-all` does not.
* `my-rename-all` allows you to write arbitrarily complicated javascript to calculate the new names for your files, while `renamer` does not support accepting a custom transform function yet (at the time of this writing, 2017-12-08, since apparently it will be added in the future).
* You don't have to know javascript to use `renamer`, but you must know it to use `my-rename-all`.

How to use
----------

```
npm install -g my-rename-all
```

Navigate to the folder you want, and create a JS file there, `foo.js`, like this:

```javascript
module.exports = filename => filename.replace("Season 1 - ", "Season 01 - ");
```

And then execute

```
my-rename-all foo.js
```

to see all the changes that would be made, and if that's really what you want, execute

```
my-rename-all -F foo.js
```

to force the actual renaming.

Should work in Windows and Linux.

The file `foo.js` doesn't really have to be in the same folder as the renames (just give the relative path to it). Also, `my-rename-all` will automatically skip your JS file (in this example, `foo.js`) if it is present in the current directory (instead of trying to rename it as well).

Changelog
---------

v0.0.1: Initial commit stuff, not ready to use yet


Development
--------------------------------------

Every now and then I might improve this a bit...


Acknowledgements
--------------------------------------

Thanks Rubens Mariuzzo for [this great guide on creating CLI utilities in NodeJS](https://x-team.com/blog/a-guide-to-creating-a-nodejs-command/).

Thanks Sindre Sorhus, Josh Junon and all other contributors for [`chalk`](https://github.com/chalk/chalk).

Thanks Sindre Sorhus for [`slash`](https://github.com/sindresorhus/slash).


License
--------------------------------------

This is released under MIT License. Just include a mention to me (Pedro Augusto de Paula Barbosa) and this library in an 'acknowledgments' section of your software (with a link to [this page on GitHub](https://github.com/papb/my-rename-all)) and you are ready to use it!