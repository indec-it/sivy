#!/usr/bin/env node
const logger = require('../src/helpers/logger');
const path = require('path');
const {spawn} = require('child_process');
const {keys, forEach} = require('lodash');
const pkg = require(path.resolve('./package.json'));

if (pkg.peerDependencies) {
    forEach(keys(pkg.peerDependencies), dependency => {
        try {
            // When 'npm link' is used it checks the clone location. Not the project.
            require.resolve(dependency);
        } catch (err) {
            logger.warn(`The module '${dependency}' was not found. Next.js requires that you include it in 'dependencies' of your 'package.json'. To add it, run 'npm install --save ${dependency}'`);
        }
    });
}

const defaultCommand = 'dev';
const commands = new Set([
    'start',
    defaultCommand
]);

let cmd = process.argv[2];
let args = [];
const nodeArgs = [];

if (new Set(['--version', '-v']).has(cmd)) {
    logger.info(`sivy v${pkg.version}`);
    process.exit(0);
}

if (new Set(process.argv).has('--inspect')) {
    nodeArgs.push('--inspect');
}

if (new Set(['--help', '-h']).has(cmd)) {
    logger.info(`
    Usage
      $ sivy <command>

    Available commands
      ${Array.from(commands).join(', ')}

    For more information run a command with the --help flag
      $ sivy init --help
  `);
    process.exit(0);
}

if (commands.has(cmd)) {
    args = process.argv.slice(3);
} else {
    cmd = defaultCommand;
    args = process.argv.slice(2);
}

const defaultEnv = cmd === 'dev' ? 'development' : 'production';
process.env.NODE_ENV = process.env.NODE_ENV || defaultEnv;

const bin = path.join(__dirname, `sivy-${cmd}`);

const startProcess = () => {
    const proc = spawn('node', [...nodeArgs, ...[bin], ...args], {stdio: 'inherit', customFds: [0, 1, 2]});
    proc.on('close', (code, signal) => {
        if (code !== null) {
            process.exit(code);
        }
        if (signal) {
            if (signal === 'SIGKILL') {
                process.exit(137);
            }
            logger.info(`got signal ${signal}, exiting`);
            process.exit(1);
        }
        process.exit(0);
    });
    proc.on('error', (err) => {
        logger.error(err);
        process.exit(1);
    });
    return proc;
};

let proc = startProcess();

if (cmd === 'dev') {
    const {watchFile} = require('fs');
    const watch = folder => watchFile(`${process.cwd()}/${folder}`, {recursive: true}, (cur, prev) => {
        if (cur.size === 0 && prev.size === 0) {
            // Folder does not exists
            return;
        }
        logger.info(`\n> Found a change in ${folder} restarting the server...`);
        // Don't listen to 'close' now since otherwise parent gets killed by listener
        proc.removeAllListeners('close');
        proc.kill();
        proc = startProcess();
    });

    watch('model');
    watch('receiveSurveys');
    watch('preSaveSurvey');
    watch('getSurveys');
    watch('preSaveSyncLog');
}
