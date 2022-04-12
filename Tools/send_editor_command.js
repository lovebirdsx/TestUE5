import dgram from 'dgram';

/**
 * 
 * @param {string} command 
 */
function sendCommand(command) {
  const client = dgram.createSocket('udp4');
  client.send(command, 8888, 'localhost', (err) => {
    if (err) {
      console.error(err.message, err.stack);
    }
    client.close();
  });
}

/**
 * 
 * @param {number} timeout 
 * @param {string} command 
 */
function run(timeout, command) {
  setTimeout(() => {
    sendCommand(command);
  }, timeout);
}


function main() {
  const argv = process.argv;
  if (argv.length <= 3) {
    console.log('Usage: node send_editor_command.js [timeout (ms)] [command]');
    console.log('Example: node send_editor_command.js 1000 RestartFlowEditor');
    return;
  }

  const timeout = parseInt(process.argv[2]);
  const command = process.argv.slice(3).join(' ');
  run(timeout, command);
}

main();
