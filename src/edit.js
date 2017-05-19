const {spawn} = require('child_process');
const fs = require('fs-promise');
const uuid = require('uuid');
const os = require('os');

const editor = process.env.EDITOR || 'vim';

module.exports = async function(contents) {
  const tempFilePath = `${os.tmpdir()}/${uuid.v4()}`;

  await fs.writeFile(tempFilePath, contents);
  
  return new Promise((resolve, reject) => {
    const editorProcess = spawn(editor, [tempFilePath], {stdio: 'inherit'});

    editorProcess.on('exit', (code) => {
      if (code === 0) { resolve(tempFilePath); }
      reject(new Error('editor error'));
    });
  });
};
