var express = require('express');
const task_assignment_router = express.Router();
const Home = require('./../models/Home');
const Person = require('./../models/Person');
const Task = require('./../models/Task');
const TaskAssignment = require('./../models/TaskAssignment');

const _ = require('lodash');


task_assignment_router.post('/mark_complete', async (req, res) => {
    let task_assignment_id = req.body.taskAssignmentId;

    let task_assignment = await TaskAssignment.findById(task_assignment_id);
    let person = await Person.findById(task_assignment.personId);

    // mark the task complete and update the count for task by 1 for that person
    task_assignment.done = true;

    let update = {};
    update[`${task_assignment.taskId}`] = person.taskHistory[`${task_assignment.taskId}`] + 1;
    console.log('Update ', update);
    person.taskHistory = Object.assign({}, person.taskHistory, update)
    console.log(person.taskHistory);
    person.save();
    task_assignment.save();
    res.status(200).send('Success');
});



task_assignment_router.get('/all', async (req, res) => {
    let homeId = req.query.homeId;
    // Get all daily incomplete tasks
    console.log('In get all assignments');
    let daily_task_assignments = await TaskAssignment.find({
        done: false,
        homeId: homeId
    });

    let daily_incomplete_tasks = daily_task_assignments.map((daily_task_assignment) => {
        return _.pick(daily_task_assignment, ['id', 'personName', 'taskName', 'rotationType', 'personId', 'done']);
    })


    res.status(200).send(daily_incomplete_tasks);

});


task_assignment_router.get('/daily', async (req, res) => {
    // Get all daily incomplete tasks
    let homeId = req.query.homeId;
    console.log('In get daily assignments');
    let daily_task_assignments = await TaskAssignment.find({
        homeId: homeId,
        rotationType: 'DAILY',
        done: false
    });

    let daily_incomplete_tasks = daily_task_assignments.map((daily_task_assignment) => {
        return _.pick(daily_task_assignment, ['id', 'personName', 'taskName', 'rotationType', 'personId', 'done']);
    })


    res.status(200).send(daily_incomplete_tasks);

});

task_assignment_router.get('/weekly', async (req, res) => {
    let homeId = req.query.homeId;
    // Get all daily incomplete tasks
    console.log('In get weekly task assignment');
    let weekly_task_assignments = await TaskAssignment.find({
        rotationType: 'WEEKLY',
        homeId: homeId,
        done: false
    });

    console.log('get Weekly assignment s ', weekly_task_assignments);

    let weekly_incomplete_tasks = weekly_task_assignments.map((weekly_task_assignment) => {
        return _.pick(weekly_task_assignment, ['id', 'personName', 'taskName', 'rotationType', 'personId', 'done']);
    });

    res.status(200).send(weekly_incomplete_tasks);

});


task_assignment_router.get('/monthly', async (req, res) => {
    let homeId = req.query.homeId;
    // Get all daily incomplete tasks
    console.log('In get weekly');
    let monthly_task_assignments = await TaskAssignment.find({
        rotationType: 'MONTHLY',
        homeId: homeId,
        done: false
    });

    console.log('Weekly assignment s ', monthly_task_assignments);

    let monthly_incomplete_tasks = monthly_task_assignments.map((monthly_task_assignment) => {
        return _.pick(monthly_task_assignment, ['id', 'personName', 'taskName', 'rotationType', 'personId', 'done']);
    })


    res.status(200).send(monthly_incomplete_tasks);

});


function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

module.exports = task_assignment_router;