const mongoose = require('mongoose');

const dbURI = "mongodb+srv://admin:admin@colyfdb-uwxlb.mongodb.net/colyf_db?retryWrites=true";

const options = {
    type: 'mongodb',
    ssl: true,
    authsource: "admin",
    replicaSet: "colyfdb-shard-0",
    reconnectTries: Number.MAX_VALUE,
    useNewUrlParser: true,
    debug: true
};

mongoose.connect(dbURI, options).then(
    () => {
        console.log("Database connection established!");
    },
    err => {
        console.log("Error connecting Database instance due to: ", err);
    }
);