const {User} = require('../models')

exports.getUsers = (req, res, next) => {
    User.find()
    .then((users) => {
        res.status(200).send({users})
    })

}


exports.getUserByName = (req, res, next) => {
    const {user_name} = req.params;
    
    User.findOne({username: user_name})
    .then(user => {
        if (!user) {
            return Promise.reject({status: 404, msg: `There is no User for username "${user_name}"`})
        }
        res.status(200).send({user});
    })
    .catch(next)
}


// exports.getUserById = (req, res, next) => {
//     const {user_id} = req.params;
    
//     User.findById(user_id)
    
//     .then((user) => {
//         if (!user) {
//             return Promise.reject({status: 404, msg: `User not found for ${user_id}`})
//         }
//         res.status(200).send({user});
//     })
//     .catch(next)

// }