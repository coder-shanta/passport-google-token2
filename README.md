# passport-google-token2

[Passport](http://passportjs.org/) strategy for authenticating with `Google AccessToken`
using the OAuth 2.0 API.


This module lets you authenticate using Google ```access_token``` in your Node.js applications.
By plugging into Passport, Google authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).


[![npm](https://img.shields.io/npm/v/passport-google-oauth20.svg)](https://www.npmjs.com/package/passport-google-token2)


## Recommended
### ~~`passport-google-token`~~ :x:
### `passport-google-token2` :heavy_check_mark:


## Why i use passport-google-token2 ?
Because [passport-google-token](https://github.com/sebastiangugpassport-google-token) is Archived. It's don't maintained anymore.

## Install

```bash
$ npm install passport-google-token2
```

## Usage


### Configure Strategy

#### Default options 
```javascript
{
    session: false
}
```

`Note:` GoogleTokenStrategy 'options' are optional so just pass `{}`

```javascript
passport.use(new GoogleTokenStrategy({},
    async (accessToken, refreshToken, profile, done) => {
        try {
            const user = await User.findOne({ google_id: profile.id });

            if (user !== null) {
                done(null, user);
            } else {
                const newUser = await User.create({ ...profile._json, google_id: profile.id });
                done(null, newUser);
            }
        } catch (error) {
            done(error);
        }
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
    // TODO:: Do something with user
    res.send(req.user? 200 : 401);
});
```

### Error Handler for Express
```javascript
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development

  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // TODO:: use "err.oauthError" 
  console.log(err.oauthError);

  // render the error page
  res.status(err.status || err.oauthError.statusCode || 500);
  res.render('error');
});
```



### Client Requests

Clients can send requests to routes that use `google-access-token` authentication using query params, body, or HTTP headers.
Clients will need to transmit the `access_token` and optionally the `refresh_token` that are received from google after login.

### Sending access_token as a Query parameter

```shell
GET /auth/google/token?access_token=<TOKEN_HERE>
```

### Sending access token as an HTTP header

Clients can choose to send the access token `http-header`.

```shell
GET /resource HTTP/1.1
Host: server.example.com
access_token: <TOKEN_HERE>
```
### Sending access token as an HTTP body

Clients can choose to send the access token using the `Content-Type: application/json` format.

`Note: ` When you send access_token via `HTTP body` your server must need a `body-parser`.

```shell
POST /resource HTTP/1.1
Host: server.example.com

access_token=<TOKEN_HERE>
```

## Inspired By
[Passport-Google-Token](https://github.com/sebastiangugpassport-google-token)

[Passport-Facebook-Token](https://github.com/sebastiangug/passport-google-token)


## License

Copyright (c) 2021 Shanto Miah

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.