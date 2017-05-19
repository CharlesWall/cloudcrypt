module.exports = function outputUsage({error}) {
  console.error(
    ["cc encrypt [-i encryptionKeyFile] <sourceFile> <s3Path>",
    "cc decrypt [-i encryptionKeyFile] <s3Path> [destinationFile]",
    "cc edit [-i encryptionKeyFile] <s3Path>"].join('\n')
  );
  
  process.exit(error);
};
