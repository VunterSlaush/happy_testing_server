var bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports =
{
  encrypt: function (someString)
  {
    var salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(someString, saltRounds);
  },

  compare: function (encrypted, notEncrypted)
  {
      return bcrypt.compareSync(notEncrypted,encrypted);
  }
}
