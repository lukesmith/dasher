define(function(require, exports, module) {

    var dash = require('../dash');
    require("goog!visualization,1,packages:[corechart]");

    exports.defaults = {
        reloadInterval: 4000
    };

    exports.initialize = function(opts) {
        this.xaxis = opts.xaxis;
        this.yaxis = opts.yaxis;
    };

    exports.build = {
        render: function(data) {
            var minY = 0;
            var maxY = 0;
            var dataTable = new google.visualization.DataTable();
            dataTable.addColumn('string', this.yaxis);
            dataTable.addColumn('number', this.yaxis);

            for (var i = 0; i < data.length; i++) {
                var item = data[i];

                dataTable.addRow([item[this.xaxis], item[this.yaxis]]);

                if (item[this.yaxis] > maxY) {
                    maxY = item[this.yaxis];
                }
            }

            if (maxY === minY) {
                maxY = maxY + 1;
            }

            var options = {
                width: '100%', height: "100%",
                title: this.name,
                colors: ['#8064A2'],
                pointSize: 3,
                vAxis: { gridlines: { color: "#000" }, viewWindow: { min: minY, max: maxY} },
                animation: { duration: 1000, easing: 'out' }
            };

            var chart = new google.visualization.ColumnChart(this.getElement()[0]);
            chart.draw(dataTable, options);
        }
    };

});