import dgram from 'dgram';
import {execSync} from 'child_process';

const tsRoot = 'TsProj'
const jsRoot = 'Content/JavaScript'

const usage = [
    "Usage: node compile_ts_and_reload.js file commands",
    "Example: node compile_ts_and_reload.js ../../foo.ts RestartFlowEditor",
    "Means compile ../../foo.ts and then send command 'RestartFlowEditor' to ue editor",
].join('\r\n');

function sendEditorCommand(command) {
    const client = dgram.createSocket('udp4');
    client.send(command, 8888, 'localhost', (err) => {
        client.close();
    });
}

function parseCmdLines() {
    const argv = process.argv;
    if (argv <= 4) {
        throw new Error('Command line args is not valid');
    }
    const file = argv[2];
    const command = argv.slice(3).join(' ');
    return {
        file, command
    }
}

/**
 * @param {string} file
 */
function compileScript(file) {
    if (!file.endsWith('.ts') && !file.endsWith('.tsx')) {
        throw new Error(`file [${file}] is not a TypeScript source file`);
    }

    const find = file.indexOf(tsRoot);
    if (find < 0) {
        throw new Error(`file [${file}] not in root [${tsRoot}]`);
    }

    const workDir = file.slice(0, find);
    let jsFile;
    if (file.endsWith('ts')) {
        jsFile = file.slice(find + tsRoot.length + 1).replace('ts', 'js');
    } else {
        jsFile = file.slice(find + tsRoot.length + 1).replace('tsx', 'js');
    }
    const destinationJs = `${workDir}${jsRoot}/${jsFile}`
    execSync(`tsc -out ${destinationJs} ${file}`);
}

function main() {
    try {
        let file, command;
        ({file, command} = parseCmdLines());
        compileScript(file);
        sendEditorCommand(command);
    } catch (error) {
        console.warn(error);
        console.log('')
        console.log(usage);
    }
}

main();
