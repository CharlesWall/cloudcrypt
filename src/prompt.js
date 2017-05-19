const readline = require('readline');
const {Writable} = require('stream');


module.exports = function prompt(question) {
  process.stdout.write(question);

  return new Promise((resolve, reject) => {
    const outputStream = new Writable({
      write: function(chunk, encoding, callback) {
        callback();
      }
    });

    const interface = readline.createInterface({
      input: process.stdin,
      output: outputStream,
      terminal: true
    });

    interface.question(question, (answer) => {
      interface.close();
      console.log('');
      answer ? resolve(answer) : resolve(prompt(question));
    });
  });
}
