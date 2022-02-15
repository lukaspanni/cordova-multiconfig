# cordova-multiconfig

[![npm version](https://badge.fury.io/js/cordova-multiconfig.svg)](https://badge.fury.io/js/cordova-multiconfig)

Small tool to support using multiple cordova configs inside one repository.

Use-Cases:

- different configs for beta releases
- different configs for paid/free versions
- ...

## Install

```bash
  npm i -g cordova-multiconfig
```

## Example usage

### Create

```bash
  # creates a new cordova config 'config.beta.xml' based upon the current config.xml
  cordova-multiconfig --create beta
```

### Activate

The current config.xml is backed up to be restored later.
The specified config-file is renamed to 'config.xml' and will then be used by cordova.

```bash
  # activate the beta-config and backup the current config to be restored later
  cordova-multiconfig --activate beta
```

### Deactivate

The current config.xml will be renamed to config.[NAME].xml
The config backup will be restored to config.xml and will then be used by cordova.

```bash
  # deactivate the beta-config and restore the config backup
  cordova-multiconfig --deactivate beta
```

### Help

To get a usage description use:

```bash
  cordova-multiconfig --help
```

## Options

All options are optional, use --help (-h) to get more information.

| Alias | Argument     | Description                                             |
| ----- | ------------ | ------------------------------------------------------- |
| -h    | --help       | Display a usage guide                                   |
| -v    | --version    | Display the version of this package                     |
| -f    | --force      | Force the execution of this command                     |
| -l    | --list       | List all config files                                   |
| -c    | --create     | Creates a new config based upon the default             |
| -a    | --activate   | Activate a config file                                  |
| -d    | --deactivate | Deactivate config and activate backed-up default config |
