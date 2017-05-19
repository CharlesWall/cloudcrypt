#!/usr/bin/env node

const args = process.argv.slice(2);
const fs = require('fs-promise');

const tokens = [];
const options = {
  promptPassword: false,
  chain: false,
  password: null,
  keyPath: null,
  algorithm: 'aes-256-ctr'
};

const upload = require('./src/upload');
const download = require('./src/download');
const downloadEncryptionKey = require('./src/downloadEncryptionKey');
const edit = require('./src/edit');
const prompt = require('./src/prompt');
const outputUsage = require('./src/outputUsage');
const list = require('./src/list');
const reencrypt = require('./src/reencrypt');
const init = require('./src/init');

//get arguments
//brb writting better version of argly
for(let i = 0; i < args.length; i++){
  let arg = args[i];

  if (arg === '--password') {
    options.password = args[++i];
  } else {
    tokens.push(arg);
  }
}

(async function() {
  const command = tokens.shift();
  if (!command) outputUsage({error: true});

  try {
    if(command === 'init') {
      const [s3KeyPath] = tokens;
      return init(s3KeyPath);
    }
    //read encryption key
    const encryptionKey = await downloadEncryptionKey(options);

    if (command === 'encrypt') {
      let [source, s3Path] = tokens;
      source || outputUsage({error:true});
      if (!s3Path) {
        s3Path = source;
        const tempFilePath = await edit('');
        await upload(tempFilePath, s3Path, encryptionKey);
        await fs.unlink(tempFilePath);
      } else {
        await upload(source, s3Path, encryptionKey);
      }
    } else if (command === 'decrypt') {
      const [s3Path, destination] = tokens;
      s3Path || outputUsage({error:true});
      const decrypted = await download(s3Path, encryptionKey);
      destination ? 
        //output file to local path
        await fs.writeFile(destination, decrypted)
        :
        //output file to console
        process.stdout.write(decrypted);
    } else if (command === 'edit') {
      const [s3Path] = tokens;
      s3Path || outputUsage({error:true});
      const contents = await download(s3Path, encryptionKey);
      const tempFilePath = await edit(contents);
      await upload(tempFilePath, s3Path, encryptionKey);
      await fs.unlink(tempFilePath);
    } else if (command === 'list') {
      const [s3Path] = tokens;
      await list(s3Path);
    }
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
