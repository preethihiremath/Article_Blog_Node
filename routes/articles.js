const express = require('express')
const Article = require('./../models/article')
const Comment = require('./../models/comment')
const router = express.Router()



router.get('/new', (req, res) => {
  res.render('articles/new', { article: new Article() })
})

router.get('/edit/:id', async (req, res) => {
  const article = await Article.findById(req.params.id)
  res.render('articles/edit', { article: article })
})


router.get('/:id', async (req, res) => {
  const articleId = req.params.id;
  const article = await Article.findOne({ _id: req.params.id });
  const comments = await Comment.find({ articleId });
  if (article == null) res.redirect('/')
  res.render('articles/show', { article : article, comments:comments })
})

router.post('/', async (req, res, next) => {
  req.article = new Article()
  next()
}, saveArticleAndRedirect('new'))

router.put('/:id', async (req, res, next) => {
  const articleId = req.params.id;
  req.article = await Article.findById(req.params.id)
  const comments = await Comment.find({ articleId });
  next()
}, saveArticleAndRedirect('edit'))

router.delete('/:id', async (req, res) => {
  await Article.findByIdAndDelete(req.params.id)
  res.redirect('/')
})

function saveArticleAndRedirect(path) {
  return async (req, res) => {
    let article = req.article
    article.title = req.body.title
    article.description = req.body.description
    article.markdown = req.body.markdown
    try {
      article = await article.save()
      res.redirect(`/articles/${article.slug}`)
    } catch (e) {
      res.render(`articles/${path}`, { article: article })
    }
  }
}

// Create a new comment
router.post('/:id/comments', async (req, res) => {
  try {
    const articleId = req.params.id; // Get article ID from URL parameter
    const { author, content } = req.body; // Get comment data from request body

    const comment = new Comment({
      articleId,
      author,
      content
    });
    await comment.save();

  const article = await Article.findOne({ _id: req.params.id });
  const comments = await Comment.find({ articleId });
  if (article == null) res.redirect('/')
  res.render('articles/show', { article : article, comments:comments })
   // Redirect to the article page
  } catch (err) {
    console.error(err);
    res.status(500).send('Error adding comment'); // Handle error
  }
});

// Get comments for a specific article
router.get('/:articleId/comments', (req, res) => {
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



module.exports = router