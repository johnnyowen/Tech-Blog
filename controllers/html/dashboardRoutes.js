const router = require('express').Router();
const sequelize = require('../../config/connection');
const {Post, User, Comment} = require('../../models');
const withAuth = require('../../utils/auth');

// Render dashboard with all posts ever created by the user logged in
// Endpoint is '/dashboard/:userId'
router.get('/:userId', async (req, res) => {
    try {
        const posts = await Post.findAll({
            where: {
                userId: req.params.userId
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
        const serializedPosts = posts.map(post => post.get({ plain:true }));
        res.status(200).render('dashboard', {
            serializedPosts,
            loggedIn: req.session.loggedIn
        });
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    };
});

// New Post Route
// Endpoint is '/dashboard/new'
router.get('/new', (req, res) => {
    res.render('newPost');
});

// Render dashboard view for a single post created by the user logged in
// Endpoint is '/dashboard/post/:id'
router.get('/post/:id', async (req, res) => {
    try {
        let post = await Post.findOne({
            where: {
                id: req.params.id,
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
        res.status(200).render('singlePost', {
            ...post, 
            loggedIn: req.session.loggedIn
        });
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    };
});

// Render dashboard view for a single post created by the user logged in
// Endpoint is '/dashboard/post/edit/:id'
router.get('/post/edit/:id', async (req, res) => {
    try {
        let post = await Post.findOne({
            where: {
                id: req.params.id,
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
        res.status(200).render('editPost', {
            ...post, 
            loggedIn: req.session.loggedIn
        });
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    };
});



module.exports = router;