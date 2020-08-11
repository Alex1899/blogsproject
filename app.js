const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Blog = require('./models/blogs');


const app = express();

const dbURL = "mongodb+srv://alex1899:akoako99@blogs-cluster.lysyo.mongodb.net/blogsdb?retryWrites=true&w=majority"
mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((res) => {
        console.log('Connected to DataBase');
        app.listen(3000);
    })
    .catch((err)=>{
        console.log(err);
    });


// set ejs; by default it looks for ejs files in the folder named views
app.set('view engine', 'ejs');

// middlewares
app.use(express.static('public'));
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true}));


app.get('/', (req, res) => {
    Blog.find().sort({ createdAt: -1})
        .then((result) => {
            res.render('index', { title: 'All Blogs', blogs: result})
        }).catch((err) => {console.log(err);
})});

app.get('/about', (req, res) => {
    res.render('about.ejs');
});

app.get('/addblog', (req, res) => {
    res.render('addblog.ejs');
});

app.get('/blogs/:id', (req, res) => {
    const id = req.params.id;
    Blog.findById(id)
        .then((result) => {res.render('blogPost', { blog: result})})
        .catch(err => console.log(err));
})

app.post('/blogs', (req, res) => {
    console.log(req.body);
    const blog = new Blog(req.body);
    blog.save()
        .then((result) => {
            console.log('Saved blog');
            res.redirect('/');
        })
        .catch((err) => {console.log(err)})
});

app.delete('/blogs/:id', (req, res) => {
    const id = req.params.id;
    Blog.findByIdAndDelete(id)
        .then((result) => {
            res.json({ redirect: '/'});
        })
        .catch((err) => console.log(err));
  
})