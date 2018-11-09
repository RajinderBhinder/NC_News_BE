const userRouter = require('express').Router();
const {getUsers, getUserById, getUserByName} = require('../controllers/user')

userRouter.route('').get(getUsers)
//userRouter.route('/:user_id').get(getUserById)
userRouter.route('/:user_name').get(getUserByName);

module.exports = userRouter;