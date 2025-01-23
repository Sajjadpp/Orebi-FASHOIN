const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WalletSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
      required: true,
    },
    balance: {
      type: Number,
      default: 0,
      min: 0, // Balance cannot be negative
    },
    transactions: [
      {
        transactionId: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          enum: ['credit', 'debit'], // Type of transaction
          required: true,
        },
        amount: {
          type: Number,
          required: true,
          min: 0,
        },
        description: {
          type: String,
          default: 'No description',
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

module.exports = mongoose.model('Wallet', WalletSchema);
