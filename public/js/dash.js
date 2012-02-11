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
            reloadInterval: 10000
        };

        opts = $.extend(defaults, opts);

        this.name = opts.name;
        this.elementId = element;
        this.reloadInterval = opts.reloadInterval;
        this.dataSource = opts.dataSource;

        this.disable = function() {
            this.disabled = true;
            this.getElement().addClass("disabled");
        };
        this.enable = function() {
            this.disabled = false;
            this.getElement().removeClass("disabled");
            refresh.call(this);
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
        $.ajax({
            url: this.dataSource,
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