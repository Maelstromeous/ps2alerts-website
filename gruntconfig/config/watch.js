module.exports = {
    watch: {
        files: ['public/assets/less/**/*.less'], // which files to watch
        tasks: ['less'],
        options: {
            nospawn: true
        }
    }
};
