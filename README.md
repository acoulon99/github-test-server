# GitHub Integrated Test Server

## Getting Started (development)

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