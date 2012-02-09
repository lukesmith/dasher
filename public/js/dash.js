define(function(require, exports, module) {

    var $ = require('jquery');

    function Dash() {
        this.reload_interval = 10000;
        this.kickoff_timer = function() {
            var dash = this;
            setTimeout(function() {
                dash.update.call(dash);
            }, this.reload_interval);
        };

        this.get_element = function() {
            return $('#' + this.element);
        };

        this.disable = function() {
            this.disabled = true;
            this.get_element().addClass("disabled");
        };
        this.enable = function() {
            this.disabled = false;
            this.get_element().removeClass("disabled");
            this.update();
        }
    }
    Dash.prototype.render = function() {
        this.displayError('No renderer defined');
    };
    Dash.prototype.load = function() {
        this.get_element().addClass('dash');

        var disabled = this.get_element().data('dash-disabled');
        if (typeof(disabled) === 'undefined') {
            this.enable();
        } else {
            this.disable();
        }
    };
    Dash.prototype.update = function() {
        var dash = this;
        var element = this.get_element();
        element.addClass('updating');

        $.ajax({
            url: this.datasource,
            dataType: 'json',
            success: function (d) {
                dash.render(d);
                element.removeClass('updating');
                addTemporaryClass(element, 'updated', 500);
                dash.kickoff_timer();
            },
            error: function() {
                element.removeClass('updating');
                addTemporaryClass(element, 'error', 500);
            }
        });
    };
    Dash.prototype.displayError = function(error) {
        this.get_element().text(error);
    };
    
    function addTemporaryClass(element, className, duration) {
        element.addClass(className);
        setTimeout(function() {
            element.removeClass(className);
        }, duration);
    }

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
                exception.load();
                return exception;
            }
        };
    };

    function loadDash(dashType) {
        var element = this;

        function isDashOption(name) {
            return name.substring(0, 4) === 'dash' && name.length > 4;
        }

        function getDashOptions() {
            var data = element.data();
            var opts = {};
            opts.element = element.attr('id');
            for (var data_name in data) {
                if (isDashOption(data_name)) {
                    var opt_name = data_name.substring(4, data_name.length).toLowerCase();
                    opts[opt_name] = data[data_name];
                }
            }
            return opts;
        }

        require(['dashes/' + dashType], function(dash) {
            var opts = getDashOptions();

            dash.display(opts);
        });
    }

    exports.buildDashes = function() {
        $("[data-dash]").each(function() {
            var element = $(this);
            var dashType = element.data('dash');

            loadDash.call(element, dashType);
        });
    };

});