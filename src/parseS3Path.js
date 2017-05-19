module.exports = function parseS3Path(s3Path) {
  const bucketIndex = s3Path.indexOf('/');
  const Bucket = s3Path.slice(0, bucketIndex);
  const Key = s3Path.slice(bucketIndex + 1);
  return {Bucket, Key};
}

