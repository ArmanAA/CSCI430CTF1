const User = require("../models").User;

module.exports = {
  create(req, res) {
    User.existsForUsername(req.query.user).then(isUnique => {
      if (isUnique) {
        return res.status(401).send("Username already taken");
      } else {
        return User.create({
          username: req.query.user,
          balance: User.setBalance(req.query.user, 0),
          password: User.generateHash(req.query.pass)
        })
          .then(
            users =>
              res.status(201).send({
                users: users.user,
                status: "OK"
              })
            //res.redirect("/profile")
          )
          .catch(error => res.status(400).send(error));
      }
    });
  }
};
