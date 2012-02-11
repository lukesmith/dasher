define(function(require, exports, module) {

    var dash = require('../dash');
    require("goog!visualization,1,packages:[corechart]");

    exports.defaults = {
        reloadInterval: 60000
    };

    exports.initialize = function(opts) {
        this.query = opts.query;
        this.chartType = opts.chartType;
        this.chartOptions = opts.chartOptions;
    };

    exports.build = {
        update: function(success) {
            var wrapper = new google.visualization.ChartWrapper({
              chartType: this.chartType,
              dataSourceUrl: this.dataSource,
              query: this.query,
              options: this.chartOptions,
              containerId: this.getElementId()
            });

            success(wrapper);
        },
        render: function(data) {
            data.draw();
        }
    };

});