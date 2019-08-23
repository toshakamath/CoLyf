const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrdersSchema = new Schema(
  {
    // _id: mongoose.Schema.Types.ObjectId,    //listid
    home_id: { type: Schema.Types.ObjectId, ref: "Home" },
    list_title: { type: String },
    order_details: [
      {
        // _id: mongoose.Schema.Types.ObjectId,    //itemid - needed only in case of item edit request
        item_name: { type: String },
        item_qty: { type: String },
        item_sharedby: [
          {
            user_id: { type: Schema.Types.ObjectId, ref: "Person" },
            user_name: { type: String }
          }
        ],
        date: Date
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Orders", OrdersSchema);
