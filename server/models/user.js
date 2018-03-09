"use strict";
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define("User", {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: DataTypes.STRING,
    balance: {
      type: DataTypes.DECIMAL,
      defaultValue: 0,
      set(val) {
        this.setDataValue("balance", val);
      }
    }
  });

  User.associate = function(models) {
    // associations can be defined here
  };
  var bCrypt = require("bcrypt-nodejs");

  User.generateHash = function(password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
  };

  User.deleteAccount = function(username, res) {
    User.findOne({ where: { username: username } })
      .then(project => {
        return project.destroy();

        // project will be the first entry of the Projects table with the title 'aProject' || null
      })
      .then(() => {
        res.json("Close Successful");
      });
  };
  User.deposit = function(username, amount, res) {
    User.findOne({ where: { username: username } }).then(project => {
      var totalAmount = parseFloat(project.balance) + parseFloat(amount);
      return project.update({ balance: totalAmount }).then(() => {
        res.json("Deposit Successful");
      });
    });
  };
  User.withdraw = function(username, amount, res) {
    User.findOne({ where: { username: username } }).then(project => {
      var remainder = project.balance - amount;
      if (remainder >= 0) {
        return project.update({ balance: remainder }).then(() => {
          res.json("Withdrawl Successful");
        });
      } else {
        res.json("Insufficient Funds");
      }
    });
  };
  User.getBalance = function(username, res) {
    User.findOne({ where: { username: username } }).then(project => {
      res.json("balance = " + project.balance);
      // project will be the first entry of the Projects table with the title 'aProject' || null
    });
  };
  User.setBalance = function(username, val) {
    User.findOne({ where: { username: username } }).then(project => {
      balance: val;
      // project will be the first entry of the Projects table with the title 'aProject' || null
    });
  };
  User.existsForUsername = function(username) {
    return User.count({ where: { username: username } }).then(count => {
      return count != 0;
    });
  };

  User.prototype.validPassword = function(password) {
    return bCrypt.compareSync(password, this.password);
  };

  sequelize
    .sync()
    .then(() =>
      console.log("tables have been successfully created, if one doesn't exist")
    )
    .catch(error => console.log("This error occured", error));
  // User.getBalance() {
  //   const bal = this.getDataValue(balance);
  //   return bal;
  // };
  // User.setBalance(val) {
  //   this.setDataValue("balance", val);
  // };
  return User;
};
