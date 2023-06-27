const router = require('express').Router();
// import our db connection for the SQL literals
const sequelize = require('sequelize');
const {Post, User, Comment} = require('../../models');

/***** CREATE ******/

// Route to create a new post
// POST method with endpoint '/api/posts/'
// test with: {"title": "Test Title for a new post", "text": "This is the text for the new post", "userId": 12}
// TODO: Only authenticated users can create a post
router.post('/', async (req, res) => {
    try {
        const newPost = await Post.create({
            title: req.body.title,
            text: req.body.text,
            // TODO userId will come from req.session once we have set up our sessions
            userId: req.body.userId
        });
        res.status(201).json(newPost);
    } catch (error) {
        console.log(error);
        res.status(500).json(error); // 500 - internal server error
    };
})

/***** READ - optional ******/

// Route to read all posts
// POST method with endpoint '/api/posts/'
router.get('/', async (req, res) => {
    try {
        const posts = await Post.findAll({
            include: [{ model: User, attributes: ['username'] }],
            attributes: {
                include: [
                    // use plain SQL to get a count of the number of comments for each post
                    [
                        sequelize.literal('(SELECT COUNT (*) FROM comment WHERE comment.postId = post.id)'),
                        'commentsCount'
                    ]
                ]
            }
        });
        res.status(200).json(posts);
    } catch (error) {
        console.log(error);
        res.status(500).json(error); // 500 - internal server error 
    };
});

// Route to read one post by id
// POST method with endpoint '/api/posts/:postId'
router.get('/:postId', async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.postId, {
            include: [
                { model: User, attributes: ['username'] }, 
                { model: Comment, include: { model: User, attributes: ['username'] } }
            ],
            attributes: {
                include: [
                    // use plain SQL to get a count of the number of comments for each post
                    [
                        sequelize.literal('(SELECT COUNT (*) FROM comment WHERE comment.postId = post.id)'),
                        'commentsCount'
                    ]
                ]
            }
        });
        res.status(200).json(post);
    } catch (error) {
        console.log(error);
        res.status(500).json(error); // 500 - internal server error 
    };
});

/***** UPDATE ******/

// Route to update a post by od
// PUT method with endpoint '/api/posts/:postId'
// test  with any and all of: {"title": "Updated Test Title for a new post", "text": "This is the UPDATED text for the new post", "userId": 12}
// TODO: a user can update a post only if authenticated  and the creater of the post
router.put('/:postId', async (req, res) => {
    try {
        const updatedPost = await Post.update(req.body, {
            where: {
                id: req.params.postId,
                // verify that post belongs to user attempting to update it
                // TODO: userId will come from req.session once we have our sessions
                userId: req.body.userId
            }
        });
        console.log(updatedPost);
        if (!updatedPost[0]) return res.status(406).json({ message: 'This request cannot be completed.' }); // 406 - not accceptable
        res.status(202).json(updatedPost);
    } catch (error) {
        console.log(error);
        res.status(500).json(error); // 500 - internal server error 
    };
});

/***** DELETE ******/

// Route to delete a post by id
// DELETE method with endpoint '/api/posts/:postId'
// TODO: Only authenticated users can delete their own posts
router.delete('/:postId', async (req, res) => {
    try {
        const deletedPost = await Post.destroy({
            where: {
                id: req.params.postId
                // verify that post belongs to user attempting to update it
                // TODO: userId will come from req.session once we have our sessions
                // userId: req.session.userId
            }
        });
        if (!deletedPost) return res.status(406).json({ message: 'This request cannot be completed.' }); // 406 - not accceptable
        res.status(202).json(deletedPost);
    } catch (error) {
        console.log(error);
        res.status(500).json(error); // 500 - internal server error 
    };
});

module.exports = router;