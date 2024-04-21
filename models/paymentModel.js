const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
  number: String,
  amount: Number,
  trnx_id: String
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
