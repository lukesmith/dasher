define(function(require, exports, module) {

    var dash = require('../dash');
    require("goog!visualization,1,packages:[corechart]");

    dash.initialize(Exception);
    
    function Exception(opts) {
        this.name = opts.name;
        this.element = opts.element;
        this.datasource = opts.datasource;
        this.reload_interval = 5000;
    }

    Exception.prototype.render = function(data) {
        var minNumberOfExceptions = 0;
        var maxNumberOfExceptions = 0;
        var dataTable = new google.visualization.DataTable();
        dataTable.addColumn('string', 'Date');
        dataTable.addColumn('number', 'Exceptions');

        var formatterDate = new google.visualization.DateFormat({ pattern: 'dd.MM.yyyy HH:mm:ss' });

        for (var i = 0; i < data.length; i++) {
            var item = data[i];

            var date = new Date(parseInt(item.Time.replace("/Date(", "").replace(")/", ""), 10));

            dataTable.addRow([formatterDate.formatValue(date), item.NumberOfExceptions]);

            if (item.NumberOfExceptions > maxNumberOfExceptions) {
                maxNumberOfExceptions = item.NumberOfExceptions;
            }
        }

        var options = {
            width: '100%', height: 200,
            title: this.name,
            colors: ['#8064A2'],
            pointSize: 3,
            vAxis: { gridlines: { color: "#000" }, viewWindow: { min: minNumberOfExceptions, max: maxNumberOfExceptions} },
            animation: { duration: 1000, easing: 'out' }
        };

        var chart = new google.visualization.ColumnChart(this.get_element()[0]);
        chart.draw(dataTable, options);
    };

    return dash.exports(Exception);

});