module.exports = {
    less: {
        options: {
            compress: true,
            yuicompress: true,
            optimization: 2
        },
        files: {
            "public/assets/css/compiled/main.css"    : "public/assets/less/main.less",
            "public/assets/css/compiled/homepage.css": "public/assets/less/homepage.less"
        }
    }
};
