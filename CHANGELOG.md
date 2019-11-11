# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]
### Added
### Changed
### Deprecated
### Removed
### Fixed
### Security
- Fixed several security issues identified by 'npm audit' by updating
  all NPM dependencies to latest available versions as of 2019-11-11. 

## [1.1.3] - 2019-11-06
### Added
- Text direction for source and target sentences can now be explicitly
  set to left-to-right or right-to-left with the `config_obj`
  parameters `src_text_dir` and `tar_text_dir`.

### Changed
- The default values for the Translation Quality sliders has been
  changed from 3 to 50 (on a scale of 1-100)

### Fixed
- Additional data now saved to CSV column `additionalData`, matching
  documentation

## [1.1.2] - 2019-08-27
- Initial public release
