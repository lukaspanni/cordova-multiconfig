import path from 'path';
import fs from 'fs';
import commandLineArgs from 'command-line-args';
import commandLineUsage from 'command-line-usage';
const packageData = require('../package.json');

const optionDefinitions = [
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
  }
];

const main = (callArguments: commandLineArgs.CommandLineOptions): void => {
  const continueExecution = handleMetaOptions(callArguments);
  if (!continueExecution) return;

  const configRoot = getCordovaProjectRoot(callArguments['root']);
  const mainConfig = path.join(configRoot, 'config.xml');
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
      console.error(`Error: the config file ${configFilename} already exists. To force creation use -f`);
      return;
    }
    fs.copyFileSync(mainConfig, path.join(configRoot, configFilename));
    console.log(`Successfully created config file ${configFilename}`);
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
