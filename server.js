const express = require('express')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()

const Article = require('./models/article')

const articleRouter = require('./routes/articles')
const commentRouter = require('./routes/comments')

app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use(cors());


app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))

app.get('/', async (req, res) => {
  const articles = await Article.find().sort({ createdAt: 'desc' })
  
  res.render('articles/index', { articles: articles })
})

app.use('/articles', articleRouter)
app.use('/comment', commentRouter)

//MongoDB Atlas connection
const CONNECTION_URL ='mongodb+srv://preethivhiremath:preethivhiremath@cluster0.srtwx.mongodb.net/iwritz';
const PORT =process.env.PORT || 3000;


mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
       console.log("Successfully connected to database");
})
.catch((error) => {
      console.log("database connection failed. exiting now...");
      console.error(error);
      process.exit(1);
});


app.listen(PORT, () => console.log(`Server Running on Port: http://localhost:${PORT}`))
