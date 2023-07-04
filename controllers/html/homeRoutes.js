const router = require('express').Router();
const sequelize = require('../../config/connection');
const {Post, User, Comment} = require('../../models');

// render homepage with all existing posts
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
        const serializedPosts = posts.map(post => post.get({ plain:true }))
        res.status(200).render('homepage', {
            serializedPosts,
            loggedIn: req.session.loggedIn
        });
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    };
});

// Route to render a single Post with selected post from homepage
router.get('/post/:id', async (req, res) => {
    try {
        let post = await Post.findByPk(req.params.id, {
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
        if (!post) return res.status(404).json({ message: 'No post found.' });
        post = post.get({ plain:true });
        console.log(post);
        res.status(200).render('singlePost', {
            ...post, 
            loggedIn: req.session.loggedIn
        });
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    };
});

// Render signup/login page 
router.get('/signupLogin', async (req, res) => {
    if (req.session.loggedIn) return res.redirect('/dashboard');
    res.status(200).render('signupLogin');
});

module.exports = router;