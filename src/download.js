const parseS3Path = require('./parseS3Path');
const crypto = require('crypto');
const AWS = require('aws-sdk');
const S3 = new AWS.S3();

module.exports = async function(
  s3Path, 
  encryptionKey,
  algorithm = 'aes-256-ctr'
) {
  const {Bucket, Key} = parseS3Path(s3Path);
  
  //download encrypted file
  const options = { Bucket, Key };

  let encrypted = (await S3.getObject(options).promise()).Body;

  //decypt file
  const decipher = crypto.createDecipher(algorithm, encryptionKey);
  const decrypted = Buffer.concat([ 
    decipher.update(encrypted),
    decipher.final() 
  ]);

  return decrypted;
}

  
