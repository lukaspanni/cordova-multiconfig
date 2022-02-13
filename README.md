# cordova-multiconfig

[![npm version](https://badge.fury.io/js/cordova-multiconfig.svg)](https://badge.fury.io/js/cordova-multiconfig)

Small tool to support using multiple cordova configs inside one repository.

Use-Cases:

- different configs for beta releases
- different configs for paid/free versions
- ...

### Install

```
  npm i -g cordova-multiconfig
```

### Usage

```
  cordova-multiconfig --create beta
  cordova-multiconfig --help
```

### Options

All options are optional, use --help (-h) to get more information.

| Alias | Argument  | Description                                 |
| ----- | --------- | ------------------------------------------- |
| -h    | --help    | Display this usage guide.                   |
| -v    | --version | Display the version of this package         |
| -f    | --force   | Force the execution of this command         |
| -l    | --list    | List all config files                       |
| -c    | --create  | Creates a new config based upon the default |
