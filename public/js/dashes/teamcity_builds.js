define(function(require, exports, module) {

    var dash = require('../dash');
    require('jquery.base64.min');

    exports.build = {
        render: function(data) {
            var projects = buildProjectsList(data);

            this.getElement().empty();
            projects.appendTo(this.getElement());
        }
    };

    function buildProjectsList(projects) {
        var list = $("<ul class='builds'></ul>");

        for (var i = 0; i < projects.length; i++) {
            var project = projects[i];
            var item = $("<li>" + project.name + "</li>");
            buildBuildsList(project.builds).appendTo(item);
            list.append(item);
        }

        return list;
    }

    function buildBuildsList(builds) {
        var list = $("<ul></ul>");

        for (var i = 0; i < builds.length; i++) {
            var build = builds[i];
            var item = $("<li>" + build.name + "</li>");
            item.addClass(build.status);
            
            list.append(item);
        }

        return list;
    }

});