var express = require('express');
const task_router = express.Router();
const mongoose = require("mongoose");
const Home = require('./../models/Home');
const Person = require('./../models/Person');
const Task = require('./../models/Task');
const TaskAssignment = require('./../models/TaskAssignment');

const _ = require('lodash');

// const TaskSchema = new Schema({
//     name: String,
//     createdby_id: { type: Schema.Types.ObjectId, ref: 'Person' },
//     homeId: { type: Schema.Types.ObjectId, ref: 'Home' },
//     rotationType: String,
//     start: Date,
//     rotationDay: String,
//     people: [String],
// }, { timestamps: true });

// gets tasks associated with a home
task_router.get('/', async (req, res) => {
    console.log('Ing get ');
    let homeId = req.query.homeId;
    let rotationType = req.query.rotationType;
    let tasks = [];
    if (rotationType !== "ALL") {
        console.log('Got home id ', homeId);
        tasks = await Task.find({
            rotationType: rotationType,
            homeId: homeId
        })
    } else {
        tasks = await Task.find({
            homeId: homeId
        })
    }


    let tasks_data = await Promise.all(tasks.map(async (task) => {
        let task_data = _.pick(task, ['name', 'homeId', 'rotationType', 'id']);


        const task_people_rows = await Person.find({
            '_id': { $in: task.people }
        });

        task_data['people'] = "";
        for (var i = 0; i < task_people_rows.length; i++) {
            var task_person = task_people_rows[i];
            if (i < task_people_rows.length - 1) {
                task_data['people'] = task_data['people'] + task_person.name + ", ";
            } else {
                task_data['people'] = task_data['people'] + task_person.name;

            }

        }

        return task_data;

    }));

    // get daily, weekly and monthly tasks, and their info
    res.status(200).send(tasks_data);
});





// creates a new task
task_router.post('/create', async (req, res) => {
    console.log('IN post of task');

    let task_name = req.body.task_name;
    let person_ids = req.body.person_ids;
    let rotation_type = req.body.rotation_type; // DAILY, WEEKLY, MONTHLY
    let homeId = req.body.homeId;
    let startDate = req.body.startDate;
    let start_date = null;
    console.log(req.body);
    // rotation
    let rotation_day = null;
    if (rotation_type === "WEEKLY") {
        rotation_day = req.body.rotation_day; //MONDAY, TUESDAY, WEDNESDAY,...
    }

    if (rotation_day === "MONTHLY") {
        rotation_day = req.body.rotation_day;  // 1,2,3,....30,31
    }

    if (startDate.toUpperCase() === "NOW") {
        start_date = new Date();
        // create Task assignments now
    } else {
        start_date = startDate;
    }

    let task = new Task({
        homeId: homeId,
        name: task_name,
        rotationType: rotation_type,
        rotation_day: rotation_day,
        people: person_ids,
        start: start_date,
    });


    console.log('Created New Task');

    const task_people_rows = await Person.find({
        '_id': { $in: task.people }
    });


    for (var i = 0; i < task_people_rows.length; i++) {
        var task_person = task_people_rows[i];

        let taskHistory = task_person.taskHistory;
        let update = {};
        // add a key of task id in the task History, the value will store the completion count for the task
        update[task.id] = 0;
        taskHistory = Object.assign({}, taskHistory, update);
        task_person.taskHistory = taskHistory;
        task_person.save();
    }
    await task.save();
    if (startDate.toUpperCase() === "NOW") {
        assignTasks(task);
        // create Task assignments now
    }


    res.status(200).send('Success');
});


function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}


task_router.post('/assign', async (req, res) => {
    let taskId = req.body.taskId;

    console.log('Got task id ', taskId);

    let task = await Task.findById(taskId);
    console.log('Task is ', task.name);
    await assignTasks(task);
    console.log('After assign tasks ');
    res.status(200).send('Success');
});


task_router.post('/clearAll', async (req, res) => {
    console.log('Clear all');
    let homeId = req.body.homeId;
    let persons = await Person.find({
        house_id: homeId
    });

    for (var i = 0; i < persons.length; i++) {
        let update = {
            'dailyCount': 0,
            'monthlyCount': 0,
            'yearlyCount': 0.
        }

        persons[i].taskHistory = Object.assign({}, update);
        await persons[i].save();
    }

    res.status(200).send('Success');
})

assignTasks = async (task) => {
    // for the task, 
    // depending on the type

    const people_ids = [];
    console.log('Task peope ', task.people);
    let task_people_array = task.people;
    for (var i = 0; i < task.people.length; i++) {
        people_ids.push(mongoose.Types.ObjectId((task.people)[i]));
    }

    console.log('People ids ', people_ids);

    const task_people_rows = await Person.find({
        '_id': { $in: task.people }
    });

    console.log(' Task people total ', task_people_rows.length);

    let all_people = task_people_rows.map(task_person => {
        return _.pick(task_person, ['id', 'name', 'taskHistory'])
    })

    console.log('All task people ', all_people);


    let taskWisePersonsData = getTaskCountBasedData(task, all_people);
    let personsOrderedByLowestTaskCount = taskWisePersonsData.personsOrderedByLowestTaskCount;
    let no_of_people_with_lowest_task_count = taskWisePersonsData.no_of_people_with_lowest_task_count;


    if (no_of_people_with_lowest_task_count === 1) {
        let personWithLowestTaskCount = personsOrderedByLowestTaskCount[0];
        console.log('Assign task to person with lowest task count ', personWithLowestTaskCount);
        // assign the task to this person
        assignTaskToPerson(task, personWithLowestTaskCount);
    } else if (no_of_people_with_lowest_task_count > 1) {
        let people_with_lowest_count_of_this_task = personsOrderedByLowestTaskCount.slice(0, no_of_people_with_lowest_task_count);
        console.log('\nPeople with lowest count of this task ', people_with_lowest_count_of_this_task);

        let weeklyPersonsData = getRotationPeriodCountBasedData(task.rotationType, people_with_lowest_count_of_this_task);
        let personsOrderedByRotationPeriodCount = weeklyPersonsData.personsOrderedByRotationPeriodCount;
        let no_of_people_with_lowest_count_of_rotation_period = weeklyPersonsData.no_of_people_with_lowest_count_of_rotation_period;

        // console.log('People ordered with rotation period data ', personsOrderedByRotationPeriodCount);

        // console.log('No of people with lowest count of rotation perid ', no_of_people_with_lowest_count_of_rotation_period);
        if (no_of_people_with_lowest_count_of_rotation_period === 1) {

            // findPersonHavingTheLowestCount(task.rotationType, personsOrderedByRotationPeriodCount, lowestCount);
            let personWithLowestRotationPeriodCount = personsOrderedByRotationPeriodCount[0];
            console.log('Person with lowest rotation period count ', personWithLowestRotationPeriodCount);
            // assign task to this person
            assignTaskToPerson(task, personWithLowestRotationPeriodCount);

        } else if (no_of_people_with_lowest_count_of_rotation_period > 1) {
            // get the people with this count 
            people_with_lowest_count_of_rotation_period = personsOrderedByRotationPeriodCount.slice(0, no_of_people_with_lowest_count_of_rotation_period);
            // could have simply written as a = b[c] ;-)

            console.log('\nPeople with lowest count of rotation period :');
            console.log(people_with_lowest_count_of_rotation_period);
            //randomly select a person to assign the task

            let random_index = getRandomInt(no_of_people_with_lowest_count_of_rotation_period - 1);

            let person_selected_for_task = people_with_lowest_count_of_rotation_period[random_index];
            assignTaskToPerson(task, person_selected_for_task);

        }
    }

}

assignTaskToPerson = async (task, person_data) => {
    console.log('Assigning ', person_data.name, ' to task ', task.name, ' task');

    let assignedTask = new TaskAssignment({
        taskId: task.id,
        personId: person_data.id,
        taskName: task.name,
        personName: person_data.name,
        rotationType: task.rotationType,
        homeId: task.homeId
    });

    let person = await Person.findById(person_data.id);

    if (task.rotationType === 'DAILY') {
        // increase the daily count of the person
        person.taskHistory = Object.assign({}, person.taskHistory, { dailyCount: person.taskHistory.dailyCount + 1 });
    }

    if (task.rotationType === 'WEEKLY') {
        // increase the weekly count of the person
        person.taskHistory = Object.assign({}, person.taskHistory, { weeklyCount: person.taskHistory.weeklyCount + 1 })
    }

    if (task.rotationType === 'MONTHLY') {
        // increase the monthly count of the person
        person.taskHistory = Object.assign({}, person.taskHistory, { monthlyCount: person.taskHistory.monthlyCount + 1 })
    }

    person.save();
    assignedTask.save();



}

getTaskCountBasedData = (task, people) => {

    // Among these people find the person(s) with lowest taskCount for this task
    let taskString = `taskHistory.${task.id}`;
    console.log('\n\nTask string ', taskString);
    // order the people by their task count ascending 
    let personsOrderedByLowestTaskCount = _.orderBy(people, [taskString]);
    console.log('Persons ordered by low task count ', personsOrderedByLowestTaskCount);
    // get aggregate by task count { 'task count' : 'no of people having this task count'}

    let countByTaskCount = _.countBy(personsOrderedByLowestTaskCount, (o) => { return o.taskHistory[task.id] });
    console.log('Aggregate results by task count ', countByTaskCount);

    let taskcounts = Object.keys(countByTaskCount);

    let lowestTaskCount = taskcounts[0];
    let no_of_people_with_lowest_task_count = countByTaskCount[lowestTaskCount];

    console.log('Lowest task count ', lowestTaskCount);
    console.log('nO of pppl with lowest taks count ', no_of_people_with_lowest_task_count);

    return {
        'personsOrderedByLowestTaskCount': personsOrderedByLowestTaskCount,
        'no_of_people_with_lowest_task_count': no_of_people_with_lowest_task_count
    }

}

getRotationPeriodCountBasedData = (rotationType, people) => {
    console.log('All task people ', people);
    let countByRotationPeriodCount;
    var personsOrderedByRotationPeriodCount;
    if (rotationType === 'WEEKLY') {
        // order people by their weekly count
        personsOrderedByRotationPeriodCount = _.orderBy(people, ['taskHistory.weeklyCount']);
        // get an aggregate of { 'weekly count' : 'no of people having this count'}
        countByRotationPeriodCount = _.countBy(people, (o) => { return o.taskHistory.weeklyCount });
    } else if (rotationType === 'DAILY') {
        // order people by their weekly count
        personsOrderedByRotationPeriodCount = _.orderBy(people, ['taskHistory.dailyCount']);
        // get an aggregate of { 'weekly count' : 'no of people having this count'}
        countByRotationPeriodCount = _.countBy(people, (o) => { return o.taskHistory.dailyCount });
    } else if (rotationType === 'MONTHLY') {
        // order people by their weekly count
        personsOrderedByRotationPeriodCount = _.orderBy(people, ['taskHistory.monthlyCount']);
        // get an aggregate of { 'weekly count' : 'no of people having this count'}
        countByRotationPeriodCount = _.countBy(people, (o) => { return o.taskHistory.monthlyCount });
    }

    console.log('COUNT BY RESULT ', countByRotationPeriodCount);
    let counts = Object.keys(countByRotationPeriodCount);
    let lowestCount = counts[0];
    let no_of_people_with_lowest_count_of_rotation_period = countByRotationPeriodCount[lowestCount];
    console.log('Lowest count ', lowestCount);
    console.log('no of people with this count ', countByRotationPeriodCount[lowestCount]);

    return {
        'personsOrderedByRotationPeriodCount': personsOrderedByRotationPeriodCount,
        'lowestCount': lowestCount,
        'no_of_people_with_lowest_count_of_rotation_period': no_of_people_with_lowest_count_of_rotation_period
    }

}


function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

module.exports = task_router;