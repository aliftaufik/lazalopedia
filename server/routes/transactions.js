const transactions = require('express').Router()
const { TransactionController } = require('../controllers')
const { authorizeTransaction } = require('../middlewares/auth')

transactions.use('/:id', authorizeTransaction)
transactions.get('/:id', TransactionController.getOneTransaction)
transactions.patch('/:id', TransactionController.updateTransactionStatus)

module.exports = transactions
