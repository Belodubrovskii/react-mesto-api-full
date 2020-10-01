const router = require('express').Router();
const {
  createUser, getAllUsers, getUser, updateProfile, updateAvatar,
} = require('../controllers/users.js');

router.get('/users/:userId', getUser);

router.get('/users', getAllUsers);

router.post('/users', createUser);

router.patch('/users/me', updateProfile);

router.patch('/users/me/avatar', updateAvatar);

module.exports = router;
