const os = require('os');
const uuid = require('uuid');
const fs = require('fs-promise');

const prompt = require('./prompt');
const upload = require('./upload');
const download = require('./download');
const edit = require('./edit');

module.exports = async function reencrypt(s3Path) {
  let oldPassword = await prompt('Old Password:');
  let newPassword = await prompt('New Password:');

  if ((await prompt('Confirm New Password:')) !== newPassword) {
    console.error('Confirmation did not match new password!');
    return reencrypt(s3Path);
  }

  const contents = await download(s3Path, oldPassword);
  try {
    const tempFilePath = await edit(contents);
    await upload(tempFilePath, s3Path, newPassword);
  } finally {
    await fs.unlink(tempFilePath);
  }
}
