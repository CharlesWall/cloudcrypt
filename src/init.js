const homeDir = process.env.HOME;
const configPath = `${homeDir}/.cloudcrypt`;
const YML = require('js-yaml');
const fs = require('fs-promise');
const uuid = require('uuid');

const edit = require('./edit');
const prompt = require('./prompt');
const upload = require('./upload');

module.exports = async function init(s3KeyPath) {
  const encryptionKey = 'cloudcryptencryptionkey:' + uuid.v4() + uuid.v4() + uuid.v4() + uuid.v4();
  const password = await prompt('Password:');
  const tempFilePath = await edit(encryptionKey);
  await upload(tempFilePath, s3KeyPath, password);
  await fs.unlink(tempFilePath);
  const config = YML.safeDump({s3KeyPath});
  console.log({configPath, config});
  await fs.writeFile(configPath, config);
}

