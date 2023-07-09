const express = require('express');
const { Post } = require('../models');
const router = express.Router();

// GET /posts
router.get('/', (req, res) => {
    Post.find({})
        .then((posts) => {
            if (posts) {
                res.json({ posts: posts });
            } else {
                res.json({ message: 'No Posts Found' });
            }
        })
        .catch(error => {
            console.log('error', error);
            res.json({ message: 'There was an issue, please try again' });
        });
});

// Get /posts/:id (used for editing comments)
router.get('/:id', (req, res) => {
    Post.findById(req.params.id)
        .then(post => {
            if (post) {
                res.json({ post: post });
            } else {
                res.json({ message: 'No Post Found' });
            }
        })
        .catch(error => {
            console.log('error', error);
            res.json({ message: 'There was an issue, please try again' });
        });
});

// GET /comments by comment Id
router.get('/:id/comments/:commentId', (req, res) => {
    Post.findById(req.params.id)
        .then(post => {
            if (!post) {
                console.log('post cannot be found');
                return res.json({ message: 'Post cannot be found' });
            }
            // find comment by id
            const comment = post.comments.id(req.params.commentId);
            console.log('--- find comment ---', comment);
            if (!comment) {
                console.log('comment cannot be found');
                return res.json({ message: 'Comment cannot be found' });
            }
            return res.json({ comment });
        })
        .catch(err => {
            console.log('error', err);
            return req.json({ message: 'Comment was not found try again...' });
        });
});

// POST /posts (create a new post)
router.post('/new', (req, res) => {
    const newPost = {
        username: req.body.username,
        caption: req.body.caption,
        photo: req.body.photo,
        likes: 0
    };
    Post.create(newPost)
        .then((post) => {
            return res.json({ post: post });
        })
        .catch(error => {
            console.log('error', error);
            res.json({ message: 'There was an issue, please try again' });
        });
});

// POST /posts/:id/comments/new (create a new comment)
router.post('/:id/comments/new', (req, res) => {
    const newComment = {
        username: req.body.username,
        comment: req.body.comment,
        likes: 0
    };
    Post.findById(req.params.id)
        .then(post => {
            if (!post) {
                console.log('post cannot be found');
                return res.json({ message: 'Post cannot be found' });
            } else {
                post.comments.push(newComment);
                post.save()
                    .then((result) => {
                        return res.json({ post: result });
                    })
                    .catch(err => {
                        console.log('error', err);
                        return res.json({ message: 'Comment was not saved try again...' });
                    });
            }
        })
        .catch(err => {
            console.log('error', err);
            return res.json({ message: 'Comment was not saved try again...' });
        });
});

// PUT /posts/:id (update a post)
router.put('/:id', (req, res) => {
    Post.findById(req.params.id)
        .then(post => {
            if (!post) {
                console.log('post cannot be found');
                return res.json({ message: 'Post cannot be found' });
            } else {
                post.set(req.body);
                post.save()
                    .then((result) => {
                        return res.json({ post });
                    })
                    .catch(err => {
                        console.log('error', err);
                        return res.json({ message: 'Post was not updated try again...' });
                    });
            }
        })
        .catch(err => {
            console.log('error', err);
            return res.json({ message: 'Post was not updated try again...' });
        });
});

// Delete /posts/:id (delete a post)
router.delete('/:id', (req, res) => {
    Post.findByIdAndDelete(req.params.id)
        .then(post => {
            if (!post) {

                console.log('post cannot be found');
                return res.json({ message: 'Post cannot be found' });
            } else {
                return res.json({ message: `post at ${req.params.id} was deleted` }, { post: post });
            }
        })
        .catch(err => {
            console.log('error', err);
            return res.json({ message: 'Post was not deleted try again...' });
        });
});


module.exports = router;