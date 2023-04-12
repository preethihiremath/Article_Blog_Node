const express = require('express');
const router = express.Router();
const Comment = require('./../models/comment');

// Create a new comment
router.post('/articles/:id/comments', async (req, res) => {
    try {
      const articleId = req.params.id; // Get article ID from URL parameter
      const { author, content } = req.body; // Get comment data from request body
  
      const comment = new Comment({
        articleId,
        author,
        content
      });
      await comment.save();
    //   res.redirect(`/articles/show`); // Redirect to the article page
    } catch (err) {
      console.error(err);
      res.status(500).send('Error adding comment'); // Handle error
    }
  });

// Get comments for a specific article
router.get('/articles/:articleId/comments', (req, res) => {
  const articleId = req.params.articleId;
  Comment.find({ articleId })
    .then(comments => {
      res.json(comments);
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to retrieve comments' });
    });
});

// Update a comment
router.put('/comments/:commentId', (req, res) => {
  const commentId = req.params.commentId;
  const { author, content } = req.body;
  Comment.findByIdAndUpdate(commentId, { author, content }, { new: true })
    .then(comment => {
      res.json(comment);
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to update comment' });
    });
});

// Delete a comment
router.delete('/comments/:commentId', (req, res) => {
  const commentId = req.params.commentId;
  Comment.findByIdAndDelete(commentId)
    .then(comment => {
      res.json({ message: 'Comment deleted successfully' });
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to delete comment' });
    });
});

module.exports = router;
