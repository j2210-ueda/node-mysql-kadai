const passport = require("passport");
const LocalStrategy = require("passport-local");
const knex = require("../db/knex");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const cookieSession = require("cookie-session");
const secret = "secretCuisine123";

module.exports = function (app) {
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id); // ← awaitを追加
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

  passport.use(new LocalStrategy({
      usernameField: "username",
      passwordField: "password",
    }, function (username, password, done) {
      knex("users")
        .where({
          name: username,
        })
        .select("*")
        .then(async function (results) {
          if (results.length === 0) {
            return done(null, false, {message: "Invalid User"});
          } 
          const user = results[0];
          if (await bcrypt.compare(password, user.password)) {
            return done(null, user);
          } else {
            return done(null, false, {message: "Invalid User"});
          }
        })
        .catch(function (err) {
          console.error(err);
          return done(null, false, {message: err.toString()})
        });
    }
  ));

  app.use(
    cookieSession({
      name: "session",
      keys: [secret],

      // Cookie Options
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    })
  );

  app.use(passport.session());
};
