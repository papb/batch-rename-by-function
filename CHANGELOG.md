# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

<!-- ## [Unreleased] -->

## [2.0.0] - 2019-01-09
### Changed
- Major refactor, modularizing everything
- Attempts to rename two files to the same name now fail safely ([#4](https://github.com/papb/batch-rename-by-function/issues/4))
- Nested renaming is now supported ([#2](https://github.com/papb/batch-rename-by-function/issues/2))
- Swapping file names is now supported ([#5](https://github.com/papb/batch-rename-by-function/issues/5))
- The second parameter of the renamer function is no longer the `isDirectory` boolean, but now is an object containing three fields: `isDirectory`, `depth` and `parentFolder`

## [1.2.1] - 2018-12-01
### Changed
- Fix minor mistake README.md

## [1.2.0] - 2018-12-01
### Added
- Skip rename if function returns `null` or `undefined` ([#3](https://github.com/papb/batch-rename-by-function/issues/3))
- Modernize code & update dependencies
- Improve README.md

## [1.1.0] - 2018-04-07
### Added
- Receive a second boolean parameter `isDirectory` ([#1](https://github.com/papb/batch-rename-by-function/issues/1))
- (dev) Start using ESLint
- Updated dependency `slash` to 2.0.0

## 1.0.1 - 2017-12-08

- Initial version.

[Unreleased]: https://github.com/papb/jsonify-error/compare/v2.0.0...HEAD
[2.0.0]: https://github.com/papb/jsonify-error/compare/v1.2.1...v2.0.0
[1.2.1]: https://github.com/papb/jsonify-error/compare/v1.2.0...v1.2.1
[1.2.0]: https://github.com/papb/jsonify-error/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/papb/jsonify-error/compare/v1.0.1...v1.1.0