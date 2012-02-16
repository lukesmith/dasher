define(function(require, exports, module) {

    var $ = require('jquery');

    function kickoffTimer() {
        var dash = this;
        setTimeout(function() {
            refresh.call(dash);
        }, this.reloadInterval);
    }

    function refresh() {
        var dash = this;
        var element = this.getElement();
        element.addClass('updating');
        this.update(function(result) {
            result = result || {};
            dash.render(result);
            element.removeClass('updating');
            addTemporaryClass(element, 'updated', 500);
            kickoffTimer.call(dash);
        }, function() {
            element.removeClass('updating');
            addTemporaryClass(element, 'error', 500);
            kickoffTimer.call(dash);
        });
    }

    function Dash(element, opts) {
        var defaults = {
            reloadInterval: 10000,
            useProxy: false
        };

        opts = $.extend(defaults, opts);

        this.name = opts.name;
        this.elementId = element;
        this.reloadInterval = opts.reloadInterval;
        this.dataSource = opts.dataSource;
        this.useProxy = opts.useProxy;

        var dash = this;

        this.disable = function() {
            dash.disabled = true;
            dash.getElement().addClass("disabled");
        };
        this.enable = function() {
            dash.disabled = false;
            dash.getElement().removeClass("disabled");
            refresh.call(dash);
        }
    }
    Dash.prototype.getElement = function() {
        return $('#' + this.elementId);
    };
    Dash.prototype.getElementId = function() {
        return this.elementId;
    };
    Dash.prototype.render = function() {
        this.displayError('No renderer defined');
    };
    Dash.prototype.update = function(callback, failed) {
        var dataSource = this.useProxy ? '/proxy' : this.dataSource;
        var data = {};
        if (this.useProxy === true) {
            data['url'] = this.dataSource;
        }

        $.ajax({
            url: dataSource,
            data: data,
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
        this.getElement().text(error);
    };
    
    function addTemporaryClass(element, className, duration) {
        element.addClass(className);
        setTimeout(function() {
            element.removeClass(className);
        }, duration);
    }

    return Dash;

});