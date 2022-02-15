#! /usr/bin/env node
import path from 'path';
import fs from 'fs';
import commandLineArgs from 'command-line-args';
import commandLineUsage from 'command-line-usage';
const packageData = require('../package.json');

//option definition with description for commandLineUsage
type OptionDefinition = commandLineArgs.OptionDefinition & { description: string };

const backupExtension = '.bak';

const optionDefinitions: OptionDefinition[] = [
  {
    name: 'help',
    description: 'Display this usage guide',
    alias: 'h',
    type: Boolean
  },
  {
    name: 'version',
    description: 'Display the version of this command',
    alias: 'v',
    type: Boolean
  },
  {
    name: 'force',
    description: 'Force execution of a command',
    alias: 'f',
    type: Boolean
  },
  {
    name: 'root',
    description: 'The root directory of the cordova-project',
    alias: 'r',
    type: String
  },
  {
    name: 'create',
    description: 'Create a new config with specified name based on the default cordova.config',
    alias: 'c',
    type: String
  },
  {
    name: 'list',
    description: 'List all detected config files in the cordova-project',
    alias: 'l',
    type: Boolean
  },
  {
    name: 'activate',
    description: 'Activate a config file',
    alias: 'a',
    type: String
  },
  {
    name: 'deactivate',
    description: 'Deactivate config and activate backed-up default config',
    alias: 'd',
    type: String
  }
];

const main = (callArguments: commandLineArgs.CommandLineOptions): void => {
  const continueExecution = handleMetaOptions(callArguments);
  if (!continueExecution) return;

  const configRoot = getCordovaProjectRoot(callArguments['root']);
  const mainConfigFilename = path.join(configRoot, 'config.xml');
  // get all configFiles (config*.xml)
  const configFiles = fs.readdirSync(configRoot).filter((file) => file.startsWith('config') && file.endsWith('.xml'));

  if (callArguments['list']) {
    console.log(`Found ${configFiles.length} config file[s]:`);
    configFiles.forEach((file) => console.log(`- ${file}`));
    return;
  }

  if (callArguments['create'] !== undefined && callArguments['create'].length !== 0) {
    const configFilename = 'config.' + callArguments['create'] + '.xml';
    if (!callArguments['force'] && configFiles.includes(configFilename)) {
      console.error(`Error: the config file '${configFilename}' already exists. To force creation use -f`);
      return;
    }
    fs.copyFileSync(mainConfigFilename, path.join(configRoot, configFilename));
    console.log(`Successfully created config file '${configFilename}'`);
    return;
  }

  if (callArguments['activate'] !== undefined && callArguments['activate'].length !== 0) {
    const configFilename = 'config.' + callArguments['activate'] + '.xml';
    if (!configFiles.includes(configFilename)) {
      console.error(`Error: the config file '${configFilename}' could not be found`);
      return;
    }
    const backupFilename = mainConfigFilename + backupExtension;
    if (!callArguments['force'] && fs.existsSync(backupFilename)) {
      console.error(
        `Error: could not backup current config to '${backupFilename}' because the file exists. To overwrite use -f`
      );
    }
    fs.renameSync(mainConfigFilename, backupFilename);
    fs.renameSync(configFilename, mainConfigFilename);
    console.log(
      `Successfully activated config '${callArguments['activate']}'\nBacked up previously activated config at ${backupFilename}`
    );
    return;
  }

  if (callArguments['deactivate'] !== undefined && callArguments['deactivate'].length !== 0) {
    const backupFilename = mainConfigFilename + backupExtension;
    if (!fs.existsSync(backupFilename)) {
      console.error(`Error: could not find a config backup at '${backupFilename}'`);
      return;
    }

    const configFilename = 'config.' + callArguments['deactivate'] + '.xml';
    if (!callArguments['force'] && configFiles.includes(configFilename)) {
      console.error(`Error: the config file '${configFilename}' already exists. To force deactivate use -f`);
      return;
    }

    fs.renameSync(mainConfigFilename, configFilename);
    fs.renameSync(backupFilename, mainConfigFilename);
    console.log(
      `Successfully deactivated config '${callArguments['deactivate']}' and stored at '${configFilename}'.\nRestored previously activated config from backup.`
    );
    return;
  }
};

const handleMetaOptions = (callArguments: commandLineArgs.CommandLineOptions): boolean => {
  if (callArguments['help'] || Object.keys(callArguments).length == 0) {
    console.log(
      commandLineUsage([
        {
          header: 'Options',
          optionList: optionDefinitions
        }
      ])
    );
    return false;
  }

  if (callArguments['version']) {
    console.log(packageData.name + ' ' + packageData.version);
    return false;
  }

  return true;
};

const getCordovaProjectRoot = (root?: string): string => {
  if (root && fs.existsSync(path.join(root, 'config.xml'))) return root;
  const projectDir = process.cwd();
  if (fs.existsSync(path.join(projectDir, 'config.xml'))) return projectDir;
  else throw new Error('Could not find a cordova-project in current directory or provided path');
};

main(commandLineArgs(optionDefinitions));
