router.get('/post/:id', async (req, res) => {
	try {
		let post = await Post.findByPk(req.params.id, {
			include: [
				{ model: User, attributes: ['username'] },
				{ model: Comment, include: { model: User, attributes: ['username'] } },
			],
			attributes: {
				include: [
					// Use plain SQL to get a count of the number of comments for each post
					[
						sequelize.literal(
							'(SELECT COUNT(*) FROM comment WHERE comment.postId = post.id)'
						),
						'commentsCount',
					],
				],
			},
		});

		if (!post) return res.status(404).json({ message: 'No post found.' });

		post = post.get({ plain: true });
		console.log(post);

		// TODO: modify response with actual VIEW|template
		res
			.status(200)
			.send(
				'<h1>SINGLE POST PAGE</h1><h2>Render the view for a single post along with the post retrieved.</h2>'
			);
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
});