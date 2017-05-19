const AWS = require('aws-sdk');
const S3 = new AWS.S3();
const parseS3Path = require('./parseS3Path');

module.exports = async function(s3Path) {
  const {Bucket, Key} = parseS3Path(s3Path);
  
  const options = {
    Bucket, Prefix: Key
  }
  let objects = await S3.listObjects(options).promise();

  objects = objects.Contents.map(({Key}) => { return Key; });
    
  console.log(objects.join('\n'));
}
