# GitHub Integrated Test Server
The goal of this project is to create an open source, GitHub integrated test server agnostic to the machine that it is run on. Currently it has the ability to run tests on any [Node.js](https://nodejs.org/en/) project hosted on GitHub assuming the commands `npm install` and `npm test` succeed from the project's root. It also has the beginnings of a service which listens to GitHub webhooks. Eventually you'll be able to point your repository to this server, and it will run tests and report back the results to your GitHub repository.

## Requirements (for projects you wish to test)

1. Currently the project you wish to test must be a Node.js project with `package.json` located in the root.

2. Commands `npm install` and `npm test` should execute successfully from the project root.

## Getting Started
Prerequiresites: [Vagrant](https://www.vagrantup.com/) and [VirtualBox](https://www.virtualbox.org/wiki/Download_Old_Builds_4_3) v4.3

1. If necessary, [create / add an SSH key to your GitHub account](https://help.github.com/articles/generating-ssh-keys/).

2. On *NON*-Macs, start the `ssh-agent`:

   ```
   eval `ssh-agent -s`
   ```
   On Macs ([after 10.5.1](http://www-uxsup.csx.cam.ac.uk/~aia21/osx/leopard-ssh.html)), the `ssh-agent` is auto-launched as needed.

3. Add your GitHub registered SSH key to your `ssh-agent':

  ```
  ssh-add <path-to-key>
  ```

4. Clone the repository and enter the project directory

5. start the virtual machine

  ```
  $ vagrant up
  ```

6. SSH into the virtual machine 

  ```
  $ vagrant ssh
  ```

  At this point the virtual machine will be up with the server and file watchers running and can be visited locally at `192.168.33.10:3000`

7. Launch tests for a project
 
  ```
  $ grunt test --repo="owner/repo-name" --branch="master"
  ```

  This will clone the repository and specified branch, install dependencies and run tests in the project root using `npm`.

## For contributing to this project..
Let me know!
Feel free to create issues, forks, and pull requests and definitely don't hesitate to reach out to me with any questions.

## Stack
- [Node.js](https://nodejs.org) - Javascript runtime
- [Express.js](http://expressjs.com/) - web framework
- [Mongo](https://www.mongodb.org/) - database

## Additional Tools
- [Vagrant](https://www.vagrantup.com/) - standard development environment
- [PM2](http://pm2.keymetrics.io/) - server management (file watching, auto restart, etc)
- [Grunt](http://gruntjs.com/) - commandline task manager
- [Mongoose](http://mongoosejs.com/index.html) - object resource management for MongoDB
