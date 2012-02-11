define(function(require, exports, module) {

    var $ = require('jquery');

    function Dash(element, opts) {
        var defaults = {
            reload_interval: 1000
        };

        opts = $.extend(defaults, opts);

        this.name = opts.name;
        this.element = element;
        this.reload_interval = opts.reload_interval;
        this.datasource = opts.datasource;
        
        this.kickoff_timer = function() {
            var dash = this;
            setTimeout(function() {
                dash.refresh.call(dash);
            }, this.reload_interval);
        };

        this.disable = function() {
            this.disabled = true;
            this.get_element().addClass("disabled");
        };
        this.enable = function() {
            this.disabled = false;
            this.get_element().removeClass("disabled");
            this.refresh();
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
    Dash.prototype.refresh = function() {
        var dash = this;
        var element = this.get_element();
        element.addClass('updating');
        this.update(function(result) {
            result = result || {};
            dash.render(result);
            element.removeClass('updating');
            addTemporaryClass(element, 'updated', 500);
            dash.kickoff_timer();
        }, function() {
            element.removeClass('updating');
            addTemporaryClass(element, 'error', 500);
            dash.kickoff_timer();
        });
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

        require(['dashes/' + dashType], function(dash) {
            var opts = getDashOptions();

            DashType.prototype = new Dash(element.attr("id"), opts);
            DashType.prototype.constructor = dashType;
            function DashType(opts) {
                if (typeof(this.construct) !== "undefined") {
                    this.construct.call(this, opts);
                }
            }

            DashType = dash(DashType);
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