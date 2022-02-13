#! /usr/bin/env node
import path from 'path';
import fs from 'fs';
import commandLineArgs from 'command-line-args';
import commandLineUsage from 'command-line-usage';
import packageData from '../package.json';

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
    name: 'root',
    description: 'The root directory of the cordova-project',
    alias: 'r',
    type: String
  }
];

const main = (callArguments: commandLineArgs.CommandLineOptions): void => {
  const continueExecution = handleMetaOptions(callArguments);
  if (!continueExecution) return;
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

const getCordovaProjectRoot = (): string | undefined => {
  const projectDir = process.cwd();
  if (fs.existsSync(path.join(projectDir, 'config.xml'))) return projectDir;
  else return undefined;
};

main(commandLineArgs(optionDefinitions));
