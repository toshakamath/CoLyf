var express = require('express');
const auth_router = express.Router();
const Home = require('./../models/Home');
const Person = require('./../models/Person');

const _ = require('lodash');

// gets a home and it's data
auth_router.post('/', async (req, res) => {
    console.log('Ing auth login ');

    let account_name = req.body.account_name;
    let passcode = req.body.passcode;

    let home = await Home.find({
        account_name: account_name
    });

    console.log('Got home', home, ' ', typeof home);

    if (home === null || home.length === 0) {
        console.log('Returning');
        return res.status(400).send('Could not find home');
    }

    home = home[0];

    if (passcode !== home.passcode) {
        console.log('Passcode matches ', passcode, home.passcode);
        return res.status(400).send('Incorrect password');
    }

    let home_people = await Person.find({
        house_id: home.id
    });

    let persons_data = [];
    for (var i = 0; i < home_people.length; i++) {
        console.log('Getting person ', home_people[i].name, ' ', home_people[i].email);

        persons_data.push({
            name: home_people[i].name,
            id: home_people[i].id,
            email: home_people[i].email
        })
    }

    console.log('Persons data ', persons_data);

    res.status(200).send({
        "message": "Success",
        "homeId": home.id,
        "homeName": home.name,
        "personData": persons_data
    });


    console.log('Not returning ');



});

module.exports = auth_router;