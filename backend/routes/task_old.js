var express = require('express');
const task_router = express.Router();
const mongoose = require("mongoose");
const Home = require('./../models/Home');
const Person = require('./../models/Person');
const Task = require('./../models/Task');

const _ = require('lodash');

// gets tasks associated with a home
task_router.get('/all', async (req, res) => {
    console.log('Ing get ');


    // get daily, weekly and monthly tasks, and their info
    res.send('Success');
});

// creates a new task
task_router.post('/create', async (req, res) => {
    console.log('IN post of task');

    let task_name = req.body.task_name;
    let person_ids = req.body.person_ids;
    let rotation_type = req.body.rotation_type; // DAILY, WEEKLY, MONTHLY
    let home_id = req.body.home_id;
    let startDate = req.body.startDate;
    console.log(req.body);
    // rotation
    let rotation_day = null;
    if (rotation_type === "WEEKLY") {
        rotation_day = req.body.rotation_day; //MONDAY, TUESDAY, WEDNESDAY,...
    }

    if (rotation_day === "MONTHLY") {
        rotation_day = req.body.rotation_day;  // 1,2,3,....30,31
    }

    if (startDate === "NOW") {
        startDate = new Date();

        // create Task assignments now
    }

    let task = new Task({
        home_id: home_id,
        name: task_name,
        rotationType: rotation_type,
        rotation_day: rotation_day,
        people: person_ids,
        start: startDate
    });

    task.save();
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
        update['weeklyCount'] = 0;
        update['monthlyCount'] = 0;
        update['dailyCount'] = 0;
        taskHistory = Object.assign({}, taskHistory, update);
        task_person.taskHistory = taskHistory;
        task_person.save();
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
});


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

    let weeklyPersonsData = getRotationPeriodCountBasedData(task.rotationType, all_people);

    let personsOrderedByRotationPeriodCount = weeklyPersonsData.personsOrderedByRotationPeriodCount;

    let no_of_people_with_lowest_count_of_rotation_period = weeklyPersonsData.no_of_people_with_lowest_count_of_rotation_period;

    console.log('Sorted ', personsOrderedByRotationPeriodCount);
    // if no of people with lowest count is 1, simply assign the task to this one person,
    if (no_of_people_with_lowest_count_of_rotation_period === 1) {
        console.log('Find this one person and assign the task');
        // findPersonHavingTheLowestCount(task.rotationType, personsOrderedByRotationPeriodCount, lowestCount);
        let lowestRotationPeriodCountPerson = personsOrderedByRotationPeriodCount[0];
    } else if (no_of_people_with_lowest_count_of_rotation_period > 1) {
        // get the people with this count 
        people_with_lowest_count_of_rotation_period = personsOrderedByRotationPeriodCount.slice(0, no_of_people_with_lowest_count_of_rotation_period);
        // could have simply written as a = b[c] ;-)

        console.log('\nPeople with lowest count of rotation period :');
        console.log(people_with_lowest_count_of_rotation_period);


        // Among these people find the person(s) with lowest taskCount for this task
        let taskString = `taskHistory.${task.id}`;
        console.log('\n\nTask string ', taskString);
        // order the people by their task count ascending 
        let personsOrderedByLowestTaskCount = _.orderBy(people_with_lowest_count_of_rotation_period, [taskString]);
        console.log('Persons ordered by low task count ', personsOrderedByLowestTaskCount);
        // get aggregate by task count { 'task count' : 'no of people having this task count'}

        let countByTaskCount = _.countBy(personsOrderedByLowestTaskCount, (o) => { return o.taskHistory[task.id] });
        console.log('Aggregate results by task count ', countByTaskCount);

        let taskcounts = Object.keys(countByTaskCount);

        let lowestTaskCount = taskcounts[0];
        let no_of_people_with_lowest_task_count = countByTaskCount[lowestTaskCount];

        console.log('Lowest task count ', lowestTaskCount);
        console.log('nO of pppl with lowest taks count ', no_of_people_with_lowest_task_count);

        if (no_of_people_with_lowest_task_count === 1) {
            let personWithLowestTaskCount = personsOrderedByLowestTaskCount[0];
            console.log('Person with lowest task count ', personWithLowestTaskCount);
            // assign the task to this person
        } else if (no_of_people_with_lowest_task_count > 1) {
            let people_with_lowest_count_of_this_task = personsOrderedByLowestTaskCount.slice(0, no_of_people_with_lowest_task_count);
            console.log('\nPeople with lowest count of this task ', people_with_lowest_count_of_this_task);
            // randomly select a person to assign the task

            let random_index = getRandomInt(no_of_people_with_lowest_task_count - 1);

            let person_selected_for_task = people_with_lowest_count_of_this_task[random_index];
            assignTaskToPerson(task, person_selected_for_task);
        }
    }
}


assignTaskToPerson = (task, person) => {
    console.log('Assigning ', person.name, ' to task ', task.name);
}

getRotationPeriodCountBasedData = (rotationType, all_people) => {
    console.log('All task people ', all_people);
    let countByRotationPeriodCount;
    var personsOrderedByRotationPeriodCount;
    if (rotationType === 'WEEKLY') {
        // order people by their weekly count
        personsOrderedByRotationPeriodCount = _.orderBy(all_people, ['taskHistory.weeklyCount']);
        // get an aggregate of { 'weekly count' : 'no of people having this count'}
        countByRotationPeriodCount = _.countBy(all_people, (o) => { return o.taskHistory.weeklyCount });
    } else if (rotationType === 'DAILY') {
        // order people by their weekly count
        personsOrderedByRotationPeriodCount = _.orderBy(all_people, ['taskHistory.dailyCount']);
        // get an aggregate of { 'weekly count' : 'no of people having this count'}
        countByRotationPeriodCount = _.countBy(all_people, (o) => { return o.taskHistory.dailyCount });
    } else if (rotationType === 'MONTHLY') {
        // order people by their weekly count
        personsOrderedByRotationPeriodCount = _.orderBy(all_people, ['taskHistory.monthlyCount']);
        // get an aggregate of { 'weekly count' : 'no of people having this count'}
        countByRotationPeriodCount = _.countBy(all_people, (o) => { return o.taskHistory.monthlyCount });
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

findPersonsHavingTheLowestCount = (rotationType, personsOrderedByRotationPeriodCount, lowestCount) => {
    console.log('LOWEST COUNT IS ', lowestCount);
    let findObject = {
        'weeklyCount': lowestCount
    }
    if (rotationType === "WEEKLY") {
        // let lowestCountPerson = _.filter(personsOrderedByRotationPeriodCount, { taskHistory: `${findObject}` });
        // console.log('Lowest count person is ', lowestCountPerson);


        let lowestCountPersons =
            console.log('Lowest coint ', lowestCountPerson);
    }


}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

module.exports = task_router;