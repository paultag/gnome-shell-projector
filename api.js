const Lang = imports.lang;
const Soup = imports.gi.Soup;
const Params = imports.misc.params;

const BASE_URL = 'http://192.168.1.50/projector';
const USER_AGENT = 'GNOME Shell Projector';

const API = new Lang.Class({
    Name: 'API',

    _init: function() {},

    get: function(path, callback) {
        query_url = BASE_URL + "/" + path;

        let request = Soup.Message.new('GET', query_url);
        _get_soup_session().queue_message(request,
            Lang.bind(this, function(http_session, message) {
                if(message.status_code !== Soup.KnownStatusCode.OK) {
                    let error_message = "HTTP: Error code: %s".format(
                        message.status_code
                    );
                    callback(error_message, null);
                    return;
                }
                callback(null, request.response_body.data);
            })
        );
    },

    destroy: function() {
        _get_soup_session().run_dispose();
        _SESSION = null;
    },
});

let _SESSION = null;

function _get_soup_session() {
    if(_SESSION === null) {
        _SESSION = new Soup.SessionAsync();
        Soup.Session.prototype.add_feature.call(
            _SESSION,
            new Soup.ProxyResolverDefault()
        );
        _SESSION.user_agent = USER_AGENT;
    }

    return _SESSION;
}
