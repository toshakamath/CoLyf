var express = require('express');
const orders_router = express.Router();
const Orders = require('./../models/Orders');
const mongoose = require("mongoose");

const _ = require('lodash');

// creates a new list

// orders_router.post('/create', (req, res) => {
//     console.log('req.body ', req.body);     //home_id, list_title
//     Orders.create({
//         _id: new mongoose.Types.ObjectId(),
//         home_id: req.body.home_id,
//         list_title: req.body.list_title
//     })
//     .then(row=>{
//         console.log("data inserted into the database", row);
//         res.status(200).send(row);
//     })
//     .catch(err=>{
//         console.log("error in query", err);
//         res.status(400);
//     })
// });

//creates items in a list.. where list_id=list_id

orders_router.post('/item/add', (req, res) => {
    console.log('req.body ', req.body); //home_id, list_id

    let new_item={
        _id:new mongoose.Types.ObjectId(),
        item_name: req.body.item_name,
        item_qty:req.body.item_qty,
        item_sharedby:req.body.item_sharedby,
        date:Date.now()
    }
    console.log("new_item: ",new_item);

    Orders.findOneAndUpdate({
        _id:req.body.list_id
    },{
        $push:{
            order_details:new_item
        }
    })
    .then(row=>{
        console.log("data inserted into the database", row);
        res.status(200).send(row);
    })
    .catch(err=>{
        console.log("error in query", err);
        res.status(400);
    })
});

//create list + items

orders_router.post('/create', (req, res) => {
    console.log('req.body ', req.body); //home_id, list_id

//     { home_id: '5ccd0f8ed0879970a0d4615a',
//   list_title: 'list 101',
//   order_details:
//    [ { item_name: 'apple', item_qty: '10', item_sharedby: [Array] } ] }

    for(let i=0; i<req.body.order_details.length; i++){
        req.body.order_details[i].date=Date.now();
    }
    Orders.create(
        req.body
    )
        .then(row => {
            console.log("data inserted into the database", row);
            res.status(200).send(row);
        })
        .catch(err => {
            console.log("error in query", err);
            res.status(400);
        })
});

//displays all lists where home_id=home_id

orders_router.get('/display/:home_id', (req, res) => {
    console.log('req.body ', req.params); //home_id, list_id
//req.query
   Orders.find({
       home_id:req.params.home_id
   })
    .then(row=>{
        console.log("data response", row);
        res.status(200).send(row);
    })
    .catch(err=>{
        console.log("error in query", err);
        res.status(400);
    })
});

//edit a list item

orders_router.post('/item/edit', (req, res) => {
    console.log('req.body ', req.body); //home_id, list_id, _id is item_id

    Orders.findOne({
        "order_details._id":req.body._id
    })
    .then(row=>{
        console.log("data fetched1: ", row);
        console.log("length ",row.order_details.length);

        for(let i=0; i< row.order_details.length; i++){
            console.log("inside for: ", typeof row.order_details[i]._id, " | ", typeof req.body._id );
            if(row.order_details[i]._id.toString() === req.body._id)
            {
                console.log("inside if");
                row.order_details[i].item_name=req.body.item_name;
                row.order_details[i].item_qty=req.body.item_qty;
                row.order_details[i].item_sharedby=req.body.item_sharedby;
                row.order_details[i].date=Date.now();
            }
        }

        console.log("data fetched2: ", row);

        Orders.replaceOne({
            "order_details._id":req.body._id
        },row)
        .then(row=>{
            console.log("data fetcheddd", row);
            res.status(200).send(row);
        })
        .catch(err=>{
            console.log("error in query", err);
        res.status(400);
        })
    })
    .catch(err=>{
        console.log("error in query", err);
        res.status(400);
    })
});

//delete item in a list

orders_router.post('/item/delete', (req, res) => {
    console.log('req.body ', req.body); //home_id, list_id

    Orders.findOne({
        "order_details._id":req.body.item_id
    })
    .then(row=>{
        console.log("data fetched1: ", row);
        console.log("length ",row.order_details.length);
        
        for(let i=0; i< row.order_details.length; i++){
            console.log("inside for: ", typeof row.order_details[i]._id, " | ", typeof req.body.item_id );
            if(row.order_details[i]._id.toString() === req.body.item_id)
            {
                console.log("inside if");
                row.order_details.splice(i,1);
                // var removed = myFish.splice(3, 1);
            }
        }

        console.log("data fetched2: ", row);

        Orders.replaceOne({
            "order_details._id":req.body.item_id
        },row)
        .then(row=>{
            console.log("data fetcheddd", row);
            res.status(200).send(row);
        })
        .catch(err=>{
            console.log("error in query", err);
        res.status(400);
        })
    })
    .catch(err=>{
        console.log("error in query", err);
        res.status(400);
    })
});

//delete list

orders_router.post('/delete', (req, res)=>{
    console.log("req.body ", req.body);
    Orders.remove({
        _id:req.body.list_id
    })
    .then(row=>{
        console.log("data deleted", row);
            res.status(200).send(row);
    })
    .catch(err=>{
        console.log("error in query", err);
    res.status(400);
    })
})


//displays all items where list_id=list_id and home_id=home_id

// orders_router.post('/item/display', (req, res) => {
//     console.log('req.body ', req.body); //home_id, list_id

//     Orders.findById({
//        _id:req.body.list_id
//    })
//     .then(row=>{
//         console.log("data response", row);
//         res.status(200).send(row);
//     })
//     .catch(err=>{
//         console.log("error in query", err);
//         res.status(400);
//     })
// });

module.exports = orders_router;