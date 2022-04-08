import dgram from 'dgram';
import { Buffer } from 'buffer';

const myArgs = process.argv.slice(2);
const message = myArgs.length <= 0 ? Buffer.from('Hello World') : myArgs.join(' ');
const client = dgram.createSocket('udp4');
client.send(message, 8888, 'localhost', (err) => {
  client.close();
});
