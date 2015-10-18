module.exports = function(grunt) {

    // grunt commandline options and defaults
    var repo = grunt.option('repo') || 'acoulon99/github-test-server';
    var branch = grunt.option('branch') || 'master';

    grunt.initConfig({
        exec: {
            runTest: {
                command: 'bash ./bin/launch-test.sh ' + repo + ' ' + branch,
                stdout: true
            }
        },
        watch: {
            files: [
                '/vagrant/'
            ],
            tasks: ['rsync:dev']
        },
        rsync: {
        	dev: {
                options: {
                    src: "/vagrant/",
                    dest: "/home/vagrant",
                    recursive: true,
                    delete: true,
                    exclude: ["node_modules", ".*"],
                    include: [".bowerrc"],
                    event: ['changed', 'added', 'deleted']             
                }
        	},
            host: {
                options: {
                    src: "/home/vagrant/",
                    dest: "/vagrant",
                    recursive: true,
                    delete: true,
                    exclude: ["node_modules", ".*"],
                    include: [".bowerrc"],
                    event: ['changed', 'added', 'deleted']
                }
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-rsync");
    grunt.loadNpmTasks("grunt-exec");

    grunt.registerTask('default', ['rsync:dev']);
    grunt.registerTask('update-host', ['rsync:host']);
    grunt.registerTask('test', ['exec:runTest']);
};