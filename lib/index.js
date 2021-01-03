const { OAuth2Strategy, InternalOAuthError } = require('passport-oauth');

module.exports = class GoogleTokenStrategy extends OAuth2Strategy {

    /**
     * Creates an instance of `GoogleTokenStrategy`.
     *
     * Examples:
     *
     *     passport.use(new GoogleTokenStrategy(
     *       function(accessToken, refreshToken, profile, done) {
     *         User.findOrCreate(..., function (err, user) {
     *           done(err, user);
     *         });
     *       }
     *     ));
     *
     * @constructor
     * @param {Function} verify
     * @api public
     */
    constructor(_options, _verify) {
        const options = _options || {};
        const verify = _verify;

        options.session = _options.session || false;
        options.clientID = "not-undefiled";
        options.authorizationURL = options.authorizationURL || 'https://accounts.google.com/o/oauth2/auth';
        options.tokenURL = options.tokenURL || `https://accounts.google.com/o/oauth2/token`;

        super(options, verify);

        this.name = 'google-access-token';
    }

    /**
     * Authenticate request by delegating to a service provider using OAuth 2.0.
     * @param {Object} req 
     * @param {Object} options 
     * @api protected
     */
    authenticate(req, options) {
        options = options || {};
        var self = this;
        
        if (!req.body) {
            req.body = {}
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

            self._verify(accessToken, refreshToken, profile, verified);
        });
    }

    /**
 * Retrieve user profile from service provider.
 *
 * OAuth 2.0-based authentication strategies can overrride this function in
 * order to load the user's profile from the service provider.  This assists
 * applications (and users of those applications) in the initial registration
 * process by automatically submitting required information.
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
    userProfile(accessToken, done) {
        this._oauth2.get('https://www.googleapis.com/oauth2/v3/userinfo', accessToken, function (err, body, res) {
            if (err) { return done(new InternalOAuthError('Failed to fetch user profile', err)); }

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