const router = require('express').Router();
const sequelize = require('../../config/connection');
const {Post, User, Comment} = require('../../models');

// Render dashboard with all posts ever created by the user logged in
// Endpoint is '/dashboard/:userId'
// TODO: only authenticated users can access their dashboard
// DONE: Once we set up sessions, remove ':userId' from endpoint and get userId from req.sessions
router.get('/', async (req, res) => {
    try {
        const posts = await Post.findAll({
            where: {
                // DONE: get user id from req.sessions
                userId: req.session.userId
            },
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
        const serializedPosts = posts.map(post => post.get({ plain:true }))
        // TODO: modify response with actual VIEW
        res.status(200).send('<h1>DASHBOARD</h1><h2>Render the dashboard view along with all posts from logged in user.</h2>');
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    };
});

// New Post Route
router.get('/new', (req, res) => {
    res.render('newPostHandlebarsPage', {layout: dashboard});
});

// Render dashboard view for a single poat created by the user logged in
// Endpoint is '/dashboard/post/:id'
router.get('/post/:id', async (req, res) => {
    try {
        let post = await Post.findOne({
            where: {
                id: req.params.id
                // TODO: might need to verify that post belomgs to user attempting to view it(userId will come from req.sessions.userId)
            },
            include: [{ model: Comment, include: { model: User, attributes: ['username'] } }],
            attributes: {
                include: [
                    // use plain SQL to retrieve number of comments
                    [
                        sequelize.literal('(SELECT COUNT (*) FROM comment WHERE comment.postId - post.id)'),
                        'commentsCount'
                    ]
                ]
            }
        });
        if (!post) return res.status(404).json({ message: 'No post found.' });
        post = post.get({ plain: true });
        // TODO: modify response with actual VIEW
        res.status(200).send('<h1>DASHBOARD</h1><h2>Render the dashboard view for a single post along with that post retrieved from the database.</h2>');
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    };
});

module.exports = router;