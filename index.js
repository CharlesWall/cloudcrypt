#!/usr/bin/env node


//get arguments
const homeDir = process.env.HOME;
const defaultKeyPath = '~/.ssh/id_rsa'.replace('~', homeDir);
const args = process.argv.slice(2);
const fs = require('fs-promise');

const tokens = [];
const options = {
  promptPassword: false,
  password: '',
  keyPath: '',
  algorithm: 'aes-256-ctr'
};

const upload = require('./src/upload');
const download = require('./src/download');
const edit = require('./src/edit');
const prompt = require('./src/prompt');

function outputUsage({error}) {
  console.error(
    ["cc encrypt [-i encryptionKeyFile] <sourceFile> <s3Path>",
    "cc decrypt [-i encryptionKeyFile] <s3Path> [destinationFile]",
    "cc edit [-i encryptionKeyFile] <s3Path>"].join('\n')
  );
  
  process.exit(error);
}

for(let i = 0; i < args.length; i++){
  let arg = args[i];
  
  if(arg === '-i') {
    options.keyPath = args[++i];
  } else if (arg === '--password') {
    options.password = args[++i];
  } else if (arg === '--prompt') {
    options.promptPassword = true;
  } else {
    tokens.push(arg);
  }
}

(async function() {
  const command = tokens.shift();
  if (!command) outputUsage({error: true});

  try {
    //read encryption key
    const encryptionKey = options.password 
      || options.promptPassword && await prompt('Enter password:') 
      || options.keyPath && await fs.readFile(options.keyPath) 
      || await fs.readFile(defaultKeyPath);

    if (command === 'encrypt') {
      const [source, s3Path] = tokens;
      source && s3Path || outputUsage({error:true});
      await upload(source, s3Path, encryptionKey);
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
    }
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
