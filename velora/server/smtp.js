import net from 'node:net';
import tls from 'node:tls';

const waitFor = (socket, test) =>
  new Promise((resolve, reject) => {
    let buffer = '';

    const onData = (chunk) => {
      buffer += chunk.toString('utf8');
      if (test(buffer)) {
        cleanup();
        resolve(buffer);
      }
    };

    const onError = (error) => {
      cleanup();
      reject(error);
    };

    const onTimeout = () => {
      cleanup();
      reject(new Error('SMTP timeout.'));
    };

    const cleanup = () => {
      socket.off('data', onData);
      socket.off('error', onError);
      socket.off('timeout', onTimeout);
    };

    socket.setTimeout(25000);
    socket.on('data', onData);
    socket.on('error', onError);
    socket.on('timeout', onTimeout);
  });

const lastLineOk = (code) => (buffer) => {
  const lines = buffer.split(/\r?\n/).filter(Boolean);
  const last = lines[lines.length - 1] || '';
  return last.startsWith(`${code} `);
};

const write = (socket, line) => {
  socket.write(`${line}\r\n`);
};

const envelope = (from) => {
  const match = String(from).match(/<([^>]+)>/);
  return match ? match[1] : String(from).trim();
};

export const sendGmail = async ({ user, pass, from, to, subject, text }) => {
  const mailFrom = envelope(from || user);
  const raw = [
    `From: ${from || user}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=utf-8',
    '',
    text.replace(/\r?\n/g, '\r\n'),
    '',
  ].join('\r\n');

  const socket = net.connect({ host: 'smtp.gmail.com', port: 587 });
  await waitFor(socket, lastLineOk(220));
  write(socket, 'EHLO velora.local');
  await waitFor(socket, lastLineOk(250));
  write(socket, 'STARTTLS');
  await waitFor(socket, lastLineOk(220));

  const secure = tls.connect({ socket, servername: 'smtp.gmail.com' });
  await new Promise((resolve, reject) => {
    secure.once('secureConnect', resolve);
    secure.once('error', reject);
  });

  write(secure, 'EHLO velora.local');
  await waitFor(secure, lastLineOk(250));
  write(secure, 'AUTH LOGIN');
  await waitFor(secure, lastLineOk(334));
  write(secure, Buffer.from(user).toString('base64'));
  await waitFor(secure, lastLineOk(334));
  write(secure, Buffer.from(pass).toString('base64'));
  await waitFor(secure, lastLineOk(235));
  write(secure, `MAIL FROM:<${mailFrom}>`);
  await waitFor(secure, lastLineOk(250));
  write(secure, `RCPT TO:<${to}>`);
  await waitFor(secure, lastLineOk(250));
  write(secure, 'DATA');
  await waitFor(secure, lastLineOk(354));
  secure.write(`${raw}\r\n.\r\n`);
  await waitFor(secure, lastLineOk(250));
  write(secure, 'QUIT');

  secure.end();
};
