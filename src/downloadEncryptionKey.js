const homeDir = process.env.HOME;
const configPath = `${homeDir}/.cloudcrypt`;
const YML = require('js-yaml');
const fs = require('fs-promise');

const prompt = require('./prompt');
const download = require('./download');

module.exports = async function downloadEncryptionKey({password}) {
  const config = await fs.readFile(configPath);
  const {s3KeyPath} = YML.safeLoad(config);

  password = password || await prompt('Password:');
  const encryptionKey = await download(s3KeyPath, password);

  if(!encryptionKey.toString().startsWith('cloudcryptencryptionkey:')) {
    console.error('could not decipher encryption key');
    process.exit(1);
  }
  return encryptionKey;
};
