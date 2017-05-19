module.exports = function prompt(question) {
  return new Promise((resolve, reject) => {
    const {stdin, stdout} = process;

    stdin.resume();
    stdout.write(question);

    stdin.once('data', function (data) {
      console.log({data});
      stdin.pause();
      resolve(data.toString());
    });
  });
}
