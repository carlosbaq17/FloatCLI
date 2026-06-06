const fs = require('fs');
const os = require('os');
const pty = require('node-pty');

const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';
const ptys = new Map();

function sendMessage(msg) {
  const buffer = Buffer.from(JSON.stringify(msg));
  const lengthBuffer = Buffer.alloc(4);
  lengthBuffer.writeUInt32LE(buffer.length, 0);
  process.stdout.write(lengthBuffer);
  process.stdout.write(buffer);
}

let chunks = Buffer.alloc(0);
process.stdin.on('data', (chunk) => {
  chunks = Buffer.concat([chunks, chunk]);
  while (chunks.length >= 4) {
    const msgLen = chunks.readUInt32LE(0);
    if (chunks.length >= 4 + msgLen) {
      const msgBuffer = chunks.slice(4, 4 + msgLen);
      chunks = chunks.slice(4 + msgLen);
      try {
        const msg = JSON.parse(msgBuffer.toString('utf8'));
        handleMessage(msg);
      } catch (e) {
        // Ignorar fallos de parseo
      }
    } else {
      break;
    }
  }
});

// Multiplexador de PTY independiente por UUID
function handleMessage(msg) {
  const { id, action, payload } = msg;

  if (action === 'create') {
    const ptyProcess = pty.spawn(shell, [], {
      name: 'xterm-color',
      cols: payload.cols || 80,
      rows: payload.rows || 24,
      cwd: process.env.HOME || process.env.USERPROFILE,
      env: process.env
    });

    ptyProcess.onData((data) => {
      sendMessage({ id, action: 'data', payload: data });
    });

    ptys.set(id, ptyProcess);
  } else if (action === 'data') {
    const ptyProcess = ptys.get(id);
    if (ptyProcess) {
      ptyProcess.write(payload);
    }
  } else if (action === 'resize') {
    const ptyProcess = ptys.get(id);
    if (ptyProcess) {
      try {
        ptyProcess.resize(payload.cols, payload.rows);
      } catch (e) {}
    }
  } else if (action === 'kill') {
    const ptyProcess = ptys.get(id);
    if (ptyProcess) {
      ptyProcess.kill();
      ptys.delete(id);
    }
  }
}
