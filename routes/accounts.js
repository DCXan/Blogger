const express = require("express");
const accountRouter = express.Router();

const bcrypt = require("bcryptjs");

// Display log in and register pages

accountRouter.get("/login", (req, res) => {
  let isRegistered = req.query.success;
  if (isRegistered) {
    res.render("login", { message: "Account created successfully." });
  } else {
    res.render("login");
  }
});

accountRouter.get("/register", (req, res) => {
  res.render("register");
});

// Allow user to register by submitting a desired username and password

accountRouter.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check database to see if username already exists. If username exists return user to registration page and display error message

  db.oneOrNone("SELECT id FROM users WHERE username = $1", [username]).then(
    (user) => {
      if (user) {
        res.render("register", {
          message: "Username is taken. Please choose a different username.",
        });
      } else {
        // If username is available (doesn't already exist in DB, then take the desired password and hash it before creating DB entry)

        bcrypt.genSalt(10).then((salt) => {
          bcrypt.hash(password, salt).then((hash) => {
            db.none("INSERT INTO users (username, password) VALUES ($1, $2)", [
              username,
              hash,
            ]).then(() => {
              res.redirect("/account/login?success=true");
            });
          });
        });
      }
    }
  );
});

// Allow user to log in with valid credentials in users DB.

accountRouter.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Search users DB for an existing username/pw combo. If combo doesn't exist, return to login and display message.

  if (username.length == 0 || password.length == 0) {
    return;
  } else {
    db.oneOrNone(
      "SELECT id, username, password FROM users WHERE username = $1",
      [username]
    ).then((user) => {
      if (!user) {
        res.render("login", {
          errorMessage: "Invalid username and/or password.",
        });
      } else {
        bcrypt
          .compare(password, user.password)
          .then((passwordsEqual) => {
            if (passwordsEqual) {
              if (req.session) {
                req.session.userID = user.id;
                req.session.username = user.username
              }
              res.redirect("/posts");
            } else {
              res.render("login", {
                errorMessage: "Invalid username and/or password.",
              });
            }
          })
          .catch((error) => {
            res.render("login", {
              errorMessage: "Invalid username and/or password.",
            });
          });
      }
    });
  }
});

accountRouter.post("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy();
  }
  res.render("login", { logoutMessage: "You have been logged out." });
});

module.exports = accountRouter;
