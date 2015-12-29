module.exports = {
    less: {
        options: {
            compress: true,
            yuicompress: true,
            optimization: 2
        },
        files: {
            "public/assets/css/main.css"    : "public/assets/less/main.less",
            "public/assets/css/homepage.css": "public/assets/less/homepage.less"
        }
    }
};
