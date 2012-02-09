({
    appDir: "../",
    baseUrl: "js/",

    priority: ['jquery'],

    dir: "../../webapp-build",
    //Comment out the optimize line if you want
    //the code minified by UglifyJS
    optimize: "none",

    paths: {
        "jquery": "jquery-1.7.1.min.js"
    }
})