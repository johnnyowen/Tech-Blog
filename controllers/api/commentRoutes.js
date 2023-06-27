const router = require('express').Router();
// import our db connection for the SQL literals
// const sequelize = require('sequelize');
const {Post, User, Comment} = require('../../models');

/***** CREATE ******/

// Route to create a new comment
// POST method with endpoint '/api/comments/'
// test with: {"text": "This is the text for a new comment", "userId": 12, "postId": 23}
// TODO: Only authenticated users can comment
router.post('/', async (req, res) => {
    try {
        const newComment = await Comment.create({
            text: req.body.text,
            postId: req.body.postId,
            // TODO: the userId will come from req.session once we have set up our sessions
            userId: req.body.userId
        });
        res.status(201).json(newComment);
    } catch (error) {
        console.log(error);
        res.status(500).json(error); // 500 - internal server error 
    };
});

/***** READ ******/

// Route to retrieve all comments
// GET method with endpoint '/api/comments/'
router.get('/', async (req, res) => {
    try {
        const comments = await Comment.findAll({
            include: [{ 
                model: User, attributes: ['username'] }, 
                { model: Post, include: { model: User, attributes: ['username'] } 
            }]
        });
        res.status(200).json(comments);
    } catch (error) {
        console.log(error);
        res.status(500).json(error); // 500 - internal server error 
    };
});

// Route to retrieve one comment by id
// GET method with endpoint '/api/comments/:commentId'
router.get('/:commentId', async (req, res) => {
    try {
        const comment = await Comment.findByPk(req.params.commentId, {
            include: [{ 
                model: User, attributes: ['username'] }, 
                { model: Post, include: { model: User, attributes: ['username'] } 
            }]
        });
        res.status(200).json(comment);
    } catch (error) {
        console.log(error);
        res.status(500).json(error); // 500 - internal server error 
    };
});

/***** UPDATE ******/

// Route to update a comment by id
// POST method with endpoint '/api/comments/:commentId'
// test with: {"text": "This is the UPDATED text for an existing comment"}
// TODO: Only admin or authenticated users can update their comment
router.put('/:commentId', async (req, res) => {
    try {
        const updatedComment = await Comment.update(req.body, {
            where: {
                id: req.params.commentId
                // TODO: verify that comment belongs to user attempting to update it (userId will come from req.session once we set up our sessions)
            }
        });
        if (!updatedComment[0]) return res.status(406).json({ message: 'This request cannot be completed.' });
        res.status(202).json(updatedComment);
    } catch (error) {
        console.log(error);
        res.status(500).json(error); // 500 - internal server error   
    };
});

/***** DELETE ******/

// Route to DELETE one comment by id
// GET method with endpoint '/api/comments/:commentId'
// TODO: Only admin or authenticated users can delete their comment
router.delete('/:commentId', async (req, res) => {
    try {
        const deletedComment = await Comment.destroy({
            where: {
                id: req.params.commentId
                // TODO: verify that comment belongs to user attempting to update it (userId will come from req.session once we set up our sessions)
            }
        });
        if (!deletedComment) return res.status(406).json({ message: 'This request cannot be completed.' });
        res.status(202).json(deletedComment);
    } catch (error) {
        console.log(error);
        res.status(500).json(error); // 500 - internal server error    
    };
});

module.exports = router;