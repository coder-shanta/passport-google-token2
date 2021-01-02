# passport-google-token2

[Passport](http://passportjs.org/) strategy for authenticating with [Google](http://www.google.com/)
using the OAuth 2.0 API.

This module lets you authenticate using Google ```access_token``` in your Node.js applications.
By plugging into Passport, Google authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).


[![npm](https://img.shields.io/npm/v/passport-google-oauth20.svg)](https://www.npmjs.com/package/passport-google-token2)

## Install

```bash
$ npm install passport-google-token2
```

## Usage


#### Configure Strategy

```javascript
var GoogleTokenStrategy = require('passport-google-token2');

passport.use(new GoogleTokenStrategy(
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));
```

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'google-access-token'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

```javascript
app.get('/auth/google/token', passport.authenticate('google-access-token'), (req, res) => {
    res.end(res.user);
});
```

## License

[The MIT License](http://opensource.org/licenses/MIT)