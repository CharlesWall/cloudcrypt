const parseS3Path = require('./parseS3Path');
const fs = require('fs-promise');
const crypto = require('crypto');
const AWS = require('aws-sdk');
const S3 = new AWS.S3();

module.exports = async function(
  filePath, 
  s3Path, 
  encryptionKey,
  algorithm = 'aes-256-ctr'
) {
  const {Bucket, Key} = parseS3Path(s3Path);

  //read file
  const file = await fs.readFile(filePath);

  //encrypt file
  const cipher = crypto.createCipher(algorithm, encryptionKey);
  let Body = Buffer.concat([
    cipher.update(file),
    cipher.final()
  ]);

  //upload file to s3
  const options = { Body, Bucket, Key };

  await S3.putObject(options).promise();
}
