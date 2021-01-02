const { OAuth2Strategy } = require('passport-oauth');

module.exports = class GoogleTokenStrategy extends OAuth2Strategy {

    constructor(_options, _verify) {
        const options = _options || {};
        const verify = _verify;

        options.authorizationURL = options.authorizationURL || 'https://accounts.google.com/o/oauth2/auth';
        options.tokenURL = options.tokenURL || `https://accounts.google.com/o/oauth2/token`;

        super(options, verify);

        this.name = 'google-access-token';
    }

    /**
     * Authenticate request by delegating to a service provider using OAuth 2.0.
     * @param {Object} req 
     * @param {Object} options 
     */
    authenticate(req, options) {
        options = options || {};
        var self = this;

        if (req.query && req.query.error) {
            // TODO: Error information pertaining to OAuth 2.0 flows is encoded in the
            //       query parameters, and should be propagated to the application.
            return this.fail();
        }

        if (!req.body) {
            return this.fail();
        }

        var accessToken = req.body.access_token || req.query.access_token || req.headers.access_token;
        var refreshToken = req.body.refresh_token || req.query.refresh_token || req.headers.refresh_token;

        self._loadUserProfile(accessToken, function (err, profile) {
            if (err) { return self.error(err); };

            function verified(err, user, info) {
                if (err) { return self.error(err); }
                if (!user) { return self.fail(info); }
                self.success(user, info);
            }

            if (self._passReqToCallback) {
                self._verify(req, accessToken, refreshToken, profile, verified);
            } else {
                self._verify(accessToken, refreshToken, profile, verified);
            }
        });
    }

    userProfile(accessToken, done) {
        this._oauth2.get('https://www.googleapis.com/oauth2/v1/userinfo', accessToken, function (err, body, res) {
            if (err) { return done(new InternalOAuthError('failed to fetch user profile', err)); }

            try {
                var json = JSON.parse(body);

                var profile = { provider: 'google' };
                profile.id = json.id;
                profile.displayName = json.name;
                profile.name = {
                    familyName: json.family_name,
                    givenName: json.given_name
                };
                profile.emails = [{ value: json.email }];

                profile._raw = body;
                profile._json = json;

                done(null, profile);
            } catch (e) {
                done(e);
            }
        });
    }
}