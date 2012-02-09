define(function(require, exports, module) {

    var $ = require('jquery');

    function Dash() {
        this.kickoff_timer = function() {
            var dash = this;
            setTimeout(function() {
                dash.refresh.call(dash);
            }, this.reload_interval);
        };

        this.get_element = function() {
            return $('#' + this.element);
        };
    }
    Dash.prototype.render = function() {
        this.get_element().text('No renderer defined');
    };
    Dash.prototype.refresh = function() {
        var dash = this;

        $.ajax({
            url: this.datasource,
            dataType: 'json',
            success: function (d) {
                dash.render(d);
                dash.kickoff_timer();
            },
            error: function() {
            }
        });
    };
    Dash.prototype.displayError = function(error) {
        this.get_element().text(error);
    };

    exports.initialize = function(dash) {
        dash.prototype = new Dash();
        dash.prototype.constructor = dash;
    };

    exports.exports = function(dash) {
        return {
            create: function(opts) {
                return new dash(opts);
            },
            display: function(opts) {
                var exception = new dash(opts);
                exception.refresh();
                return exception;
            }
        };
    };

    exports.buildDashes = function() {
        $("[data-dash]").each(function() {
            var element = $(this);
            var dashType = element.data('dash');
            require(['dashes/' + dashType], function(dash) {
                var data = element.data();
                var opts = {};
                opts.element = element.attr('id');
                for (var data_name in data) {
                    if (data_name.substring(0, 4) === 'dash' && data_name.length > 4) {
                        var opt_name = data_name.substring(4, data_name.length).toLowerCase();
                        opts[opt_name] = data[data_name];
                    }
                }

                dash.display(opts);
            });

        });
    };

});