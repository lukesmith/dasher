define(function(require, exports, module) {

    var $ = require('jquery');
    var Dash = require('dash');

    function instantiate(dashType, element) {
        function isDashOption(name) {
            return name.substring(0, 4) === 'dash' && name.length > 4;
        }

        function getOptionName(dataName) {
            function capitaliseFirstLetter(string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            }

            var opt_name = dataName.substring(4, dataName.length);
            var parts = opt_name.split('_');
            var name = parts[0].toLowerCase();
            for (var i=1; i<parts.length; i++) {
                name += capitaliseFirstLetter(parts[i]);
            }

            return name;
        }

        function getDashOptions() {
            var data = element.data();
            var opts = {};
            for (var dataName in data) {
                if (isDashOption(dataName)) {
                    var name = getOptionName(dataName);
                    opts[name] = data[dataName];
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

        function createType(dash, opts) {
            DashType.prototype = new Dash(element.attr("id"), opts);
            DashType.prototype.constructor = dashType;
            function DashType(opts) {
                if (typeof(dash.initialize) !== "undefined") {
                    dash.initialize.call(this, opts);
                }
            }

            var methods = dash.build;
            for (var m in methods) {
                DashType.prototype[m] = methods[m];
            }

            return DashType;
        }

        function load() {
            this.getElement().addClass('dash');

            var disabled = this.getElement().data('dash-disabled');
            if (typeof(disabled) === 'undefined') {
                this.enable();
            } else {
                this.disable();
            }
        }

        require(['dashes/' + dashType], function(dash) {
            var opts = getOptions(dash.defaults);
            var Type = createType(dash, opts);

            load.call(new Type(opts));
        });
    }

    $(function() {

        $("[data-dash]").each(function() {
            var element = $(this);
            var dashType = element.data('dash');

            instantiate(dashType, element);
        });

    });
    
});