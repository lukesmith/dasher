define(function(require, exports, module) {

    var $ = require('jquery');

    function kickoff_timer() {
        var dash = this;
        setTimeout(function() {
            refresh.call(dash);
        }, this.reload_interval);
    }

    function refresh() {
        var dash = this;
        var element = this.get_element();
        element.addClass('updating');
        this.update(function(result) {
            result = result || {};
            dash.render(result);
            element.removeClass('updating');
            addTemporaryClass(element, 'updated', 500);
            kickoff_timer.call(dash);
        }, function() {
            element.removeClass('updating');
            addTemporaryClass(element, 'error', 500);
            kickoff_timer.call(dash);
        });
    }

    function Dash(element, opts) {
        var defaults = {
            reload_interval: 10000
        };

        opts = $.extend(defaults, opts);

        this.name = opts.name;
        this.element = element;
        this.reload_interval = opts.reload_interval;
        this.datasource = opts.datasource;

        this.disable = function() {
            this.disabled = true;
            this.get_element().addClass("disabled");
        };
        this.enable = function() {
            this.disabled = false;
            this.get_element().removeClass("disabled");
            refresh.call(this);
        }
    }
    Dash.prototype.get_element = function() {
        return $('#' + this.element);
    };
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
    Dash.prototype.update = function(callback, failed) {
        $.ajax({
            url: this.datasource,
            dataType: 'json',
            success: function (d) {
                callback(d);
            },
            error: function() {
                failed();
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

        function getOptions(defaults) {
            var opts = getDashOptions();

            if (typeof(defaults) !== "undefined") {
                opts = $.extend($.extend({}, defaults), opts);
            }

            return opts;
        }

        require(['dashes/' + dashType], function(dash) {
            var opts = getOptions(dash.defaults);

            DashType.prototype = new Dash(element.attr("id"), opts);
            DashType.prototype.constructor = dashType;
            function DashType(opts) {
                if (typeof(dash.initialize) !== "undefined") {
                    dash.initialize.call(this, opts);
                }
            }

            if (typeof(dash.build) === "undefined") {
                DashType = dash(DashType);
            } else {
                DashType = dash.build(DashType);
            }

            inst = new DashType(opts);
            inst.load();
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