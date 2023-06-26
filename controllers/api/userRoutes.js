const router = require('express').Router();
// import our db connection for the SQL literals
const sequelize = require('../../config/connection');
const { User, Post, Comment } = require('../../models');

/***** CREATE ******/

// Route to sign up a new user
// POST method with endpoint '/api/users/'
// test with: {"username": "testUser", "email": "testUser@email.com", "password": "Password123"}
router.post('/', async (req, res) => {
    try{ 
        const newUser = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        });
        // TODO: modify session to include user information and logggedIn boolean
        res.status(201).json(newUser); // 201 - Created
    } catch (error) {
        console.log(error);
        res.status(500).json(error); // 500 - internal server error
    }
});

/***** READ - optional ******/

// Route to retireve all users
// GET method with endpoint '/api/users/'
// TODO: Autienticate - Only admin can view all users
router.get('/', async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: {
                exclude: ['password'],
                include: [
                    // use plain SQL to get a count on number of posts made by a user
                    [
                        sequelize.literal('(SELECT COUNT(*) FROM post WHERE post.userId = user.id)'), 
                        'postsCount'
                    ],
                    // use plain SQL to get a count on number of comments made by a user
                    [
                        sequelize.literal('(SELECT COUNT (*) FROM comment WHERE comment.userID = user.id)'),
                        'commentsCount'
                    ]
                ]
            }
        });
        res.status(200).json(users); // 200 - OK
    } catch (error) {
        console.log(error);
        res.status(500).json(error); // 500 - internal server error
    };
});

// Route to retrieve a single user by ID
// GET method with endpoint '/api/users/:userId'
// TODO: Authenticate - Only account owner can view a single user
router.get('/:userId', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.userId, {
            include: [
                { model: Post }, 
                { model: Comment, include: {
                    model: Post, 
                    attributes: ['title']
                }}
            ],
            attributes: {
                exclude: ['password'],
                include: [
                    // use plain SQL to get a count on number of posts made by a user
                    [
                        sequelize.literal('(SELECT COUNT(*) FROM post WHERE post.userId = user.id)'), 
                        'postsCount'
                    ],
                    // use plain SQL to get a count on number of comments made by a user
                    [
                        sequelize.literal('(SELECT COUNT (*) FROM comment WHERE comment.userID = user.id)'),
                        'commentsCount'
                    ]
                ]
            }
        });
        if (!user) return res.status(404).json({ message: 'No user found.' }); // 404 - Not found
        res.status(200).json(user); // 200 - OK
    } catch (error) {
        console.log(error);
        res.status(500).json(error); // 500 - internal server error
    }
})

/***** UPDATE - optional ******/

// Route to update a user by id
// PUT method with endpoint '/api/users/:userId'
// test with any and all of: {"username": "updatedTestUser", "email": "updatedTestUser@email.com", "password": "updatedPassword123"}
// TODO: Authenticate - Only admin or account owners can update an account
router.put('/:userId', async (req, res) => {
    try {
        // Pass in req.body to only update what's sent over by the client
        const updatedUser = await User.update(req.body, {
            where: {
                id: req.params.userId
            },
            individualHooks: true
        });
        if (!updatedUser[0]) return res.status(404).json({ message: 'No user found.' }); // 404 - Not Found
        res.status(202).json(updatedUser); // 202 - Accepted
    } catch (error) {
        console.log(error);
        res.status(500).json(error); // 500 - internal server error
    } 
});

/***** DELETE - optional ******/

// Route to delete a user by id
// DELETE method with the endpoint '/api/users/:userId'
// TODO: Authenticate - Only admin or account owners can delete an account
router.delete('/:userId', async (req, res) => {
    try {
        const deletedUser = await User.destroy({
            where: {
                id: req.params.userId
            }
        });
        console.log(deletedUser);
        if (!deletedUser) return res.status(404).json({ message: 'No user found.' }); // 404 - Not Found
        res.status(202).json(deletedUser); // 202 - Accepted
    } catch (error) {
        console.log(error);
        res.status(500).json(error); // 500 - internal server error
    }
});

// TODO: add login route
// TODO: add logout route

module.exports = router;