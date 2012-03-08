var talk = {
  say: function (line) {
    console.log(line);
  },
  shout: function (line) {
    console.log(line.toUpperCase());
  }
};
module.exports = talk;