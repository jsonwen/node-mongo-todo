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

# Using app to view mongo data in GUI
https://robomongo.org/

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

# Create MongoLab instance through Heroku
``` bash
heroku addons:create mongolab:sandbox

heroku config
# Copy and paste MongoLab Url to server/db/mongoose.js @ mongoose.connect()
```