const User = require("../models").User;

module.exports = {
  create(req, res) {
    User.existsForUsername(req.body.username).then(isUnique => {
      if (isUnique) {
        return res.status(401).send("Booo");
      } else {
        return User.create({
          username: req.body.username,
          balance: User.setBalance(req.body.username, 0),
          password: User.generateHash(req.body.password)
        })
          .then(
            users =>
              res.status(201).send({
                users: users.username,
                status: "OK"
              })
            //res.redirect("/profile")
          )
          .catch(error => res.status(400).send(error));
      }
    });
  }
};
