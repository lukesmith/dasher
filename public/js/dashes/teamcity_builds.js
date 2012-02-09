define(function(require, exports, module) {

    var dash = require('../dash');
    require('jquery.base64.min');

    dash.initialize(TeamCityBuilds);

    function TeamCityBuilds(opts) {
        this.name = opts.name;
        this.element = opts.element;
        this.datasource = opts.datasource;
    }

    TeamCityBuilds.prototype.render = function() {
        this.get_element().text('TeamCity');
    };

    return dash.exports(TeamCityBuilds);

});