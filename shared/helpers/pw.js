const bcrypt = require('bcrypt');

module.exports = {
  compare(encryptedPassword, userInput) {
    return bcrypt.compare(userInput, encryptedPassword);
  },
  
  hash(password) {
    return bcrypt.hash(password, 10);
  },
}