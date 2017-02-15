# Learning node.js
An example REST API in node.js app using mongo.

Demo:
https://nodejs-todo-app.herokuapp.com/todos/

# Getting started
``` bash
npm install
```

Download mongo to test locally
https://www.mongodb.com/download-center#community

Install in users root folder (Mac OS X)
``` bash
mkdir mongo
mkdir mongo-data
```

``` bash
# Run MongoDB with mongod in mongo/bin and point to mongo-data folder
./mongod --dbpath ~/mongo-data

# Connecting to local MongoDB in terminal in /bin (optional)
./mongo
```

# Create MongoLab instance through Heroku
``` bash
heroku addons:create mongolab:sandbox

heroku config
# Copy and paste MongoLab Url to server/db/mongoose.js @ mongoose.connect()
```

# Using app to view mongo data in GUI
https://robomongo.org/

If you run "heroku config" you will find the environment variable "MONGODB_URI"

This variable is one string consisting of different parts. Use these parts to login to your Heroku MongoDB production.

The parts exists of the following:
``` bash
mongodb://heroku_3uj1jd41:hj3lk12h333goapjdhyr0j4hj3op@ds151909.mlab.com:51909/heroku_3uj1jd41
```
With each part corresponding to:
``` bash
mongodb://username:password@address:port/database
````

# Testing API requests
https://www.getpostman.com/

# Monitor tests
``` bash
npm run test-watch
```

# Deploying to Heroku
``` bash
heroku create
```

# Configuring environment variable in Heroku
To properly run authentication using JWT

Check current active config environment variables
``` bash
heroku config
```

Set JWT_SECRET
``` bash
heroku config:set NAME=JWT_SECRET
```

Get JWT_SECRET
``` bash
heroku config:get JWT_SECRET
```

Unset JWT_SECRET
``` bash
heroku config:unset JWT_SECRET
```

# Create config.json
Create a config.json to dynamically assign environment variables
``` bash
First create a config.json file in /server/config/ and define the key value pairs below.

Example:
{
  "test": {
    "PORT": 3000,
    "MONGODB_URI": "mongodb://localhost:27017/TodoAppTests",
    "JWT_SECRET": "[RANDOM STRING]"
  },
  "development": {
    "PORT": 3000,
    "MONGODB_URI": "mongodb://localhost:27017/TodoApp",
    "JWT_SECRET": "[RANDOM STRING]"
  }
}

Don't forget to add this file in the .gitignore!
server/config/config.json
```


