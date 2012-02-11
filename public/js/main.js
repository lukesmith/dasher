require.config({
    paths : {
        //create alias to plugins (not needed if plugins are on the baseUrl)
        async: '/js/requirejs-plugins/async',
        goog: '/js/requirejs-plugins/goog',
        propertyParser : '/js/requirejs-plugins/propertyParser'
    }
});

require(["dasher"]);