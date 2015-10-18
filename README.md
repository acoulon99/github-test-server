# GitHub Integrated Test Server
The goal of this project is to create an open source, GitHub integrated test server agnostic to the machine that it is run on. Currently it has the ability to run tests on any [Node.js](https://nodejs.org/en/) project hosted on GitHub assuming the commands `npm install` and `npm test` succeed from the project's root. It also has the beginnings of a service which listens to GitHub webhooks. Eventually you'll be able to point your repository to this server, and it will run tests and report back the results to your GitHub repository.

## Requirements (for projects you wish to test)

1. Currently the project you wish to test must be a Node.js project with `package.json` located in the root.

2. Commands `npm install` and `npm test` should execute successfully from the project root.

## Getting Started
Prerequiresites: [Vagrant](https://www.vagrantup.com/) and [VirtualBox](https://www.virtualbox.org/wiki/Download_Old_Builds_4_3) v4.3

1. Add your GitHub keys to your SSH agent

  OSX:

  ```
  eval `ssh-agent`
  ssh-add ~/.ssh/id_rsa (or the location of your GitHub key)
  ```

2. Clone the repository and enter the project directory

3. start the virtual machine

  ```
  $ vagrant up
  ```

4. SSH into the virtual machine 

  ```
  $ vagrant ssh
  ```

At this point the virtual machine will be up with the server and file watchers running and can be visited locally at `192.168.33.10:3000`

5. Launch tests for a project
 
  ```
  $ grunt test --repo="owner/repo-name" --branch="master"
  ```

This will clone the repository and specified branch, install dependencies and run tests in the project root using `npm`.


## For development on this project
Let me know! :)
Feel free to create issues, forkes, and pull requests and definitely don't hesitate to reach out to me with any questions.

### Vagrant (recommended)
Prerequiresites: [Vagrant](https://www.vagrantup.com/) and [VirtualBox](https://www.virtualbox.org/wiki/Download_Old_Builds_4_3) v4.3

1. Clone the repository and enter the project directory

2. start the virtual machine

  ```
  $ vagrant up
  ```

3. SSH into the virtual machine 

  ```
  $ vagrant ssh
  ```

At this point the virtual machine will be up with the server and file watchers running and can be visited locally at `192.168.33.10:3000`

### Local
Prerequiresites: [Node.js](https://nodejs.org)

1. Clone the repository and enter the project directory

2. Install dependencies

  ```
  $ npm install
  ```
  
3. Start the server

  ```
  $ node server.js
  ```

Now the server will be hosted locally on port 3000.

## Stack
- [Node.js](https://nodejs.org) - Javascript runtime
- [Express.js](http://expressjs.com/) - web framework
- [Mongo](https://www.mongodb.org/) - database

## Additional Tools
- [Vagrant](https://www.vagrantup.com/) - standard development environment
- [PM2](http://pm2.keymetrics.io/) - server management (file watching, auto restart, etc)
- [Grunt](http://gruntjs.com/) - commandline task manager
- [Mongoose](http://mongoosejs.com/index.html) - object resource management for MongoDB