# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [4.0.0] - 2021-12-12

### [4.0.0] Release

- Upgrades to `strapi@4.0.0`
- Upgrades to `postmark@2.7.8`

## [3.5.1] - 2021-03-17

### Fixed

- Only add `TemplateModel` to the message when we are using `templateId` or `templateAlias`, fixes https://github.com/ijsto/strapi-provider-email-postmark/issues/7

### [3.4.1] Release

- Updates version to latest Strapi core version
- Implements 3.0.6, 3.0.7

## [3.0.7] - 2020-12-16

### Added

- settings.defaultVariables

## [3.0.6] - 2020-12-01

### Added

- settings.messageStream

## [3.0.5] - 2020-09-03

### Added

- setting `templateId` or `templateAlias` will send the email via `sendEmailWithTemplate`

## [3.0.4] - 2020-06-21

### Added

- settings.defaultTo

### Updated

- strapi-utils

### Fixed

- package version

## [3.0.1] - 2020-06-09

### Added

- props docs
- CHANGELOG

### Fixed

- apiKey variable name

## [3.0.0] - 2020-06-09

### Added

- Changelog file
- ignore no-array-index-key
- ignore require-default-props
- ignore no-unescaped-entities
