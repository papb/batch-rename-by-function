my-rename-all
=============

What is this?
-------------

This is a very basic CLI utility written in NodeJS to allow batch renaming all files in the current folder.

This is done mostly as an exercise for me, but feel free to use it (License is ISC).

If you ended up here, consider a better option instead: [`renamer`](https://github.com/75lb/renamer).

Dependencies
------------

The only dependency is [`chalk`](https://github.com/chalk/chalk) for colorized console output.

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

Changelog
---------

v0.0.1: Initial commit stuff, not ready to use yet


Development
--------------------------------------

Every now and then I might improve this a bit...


Acknowledgements
--------------------------------------

Thanks Rubens Mariuzzo for [https://x-team.com/blog/a-guide-to-creating-a-nodejs-command/](this great guide on creating CLI utilities in NodeJS).

Thanks Sindre Sorhus, Josh Junon and all other contributors for [`chalk`](https://github.com/chalk/chalk).


License
--------------------------------------

This is released under MIT License. Just include a mention to me (Pedro Augusto de Paula Barbosa) and this library in an 'acknowledgments' section of your software (with a link to [this page on GitHub](https://github.com/papb/my-rename-all)) and you are ready to use it!