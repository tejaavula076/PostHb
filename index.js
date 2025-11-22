const express = require("express");
const app = express();
let port = process.env.PORT || 9081;
const { faker } = require('@faker-js/faker');

const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"))

app.use(express.static(path.join(__dirname, 'public')))

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

var methodOverride = require('method-override')
app.use(methodOverride('_method'))

app.listen(port, () => { console.log("port is listening") })

let posts = []
for (let i = 0; i < 4; i++) {
    posts.push({
        userId: faker.string.uuid(),
        username: faker.internet.username(),
        avatar: faker.image.avatar(),
        content: faker.hacker.phrase()
    })
}
app.get("/posts", (req, res) => {
    res.render("index.ejs", { posts })
})

app.get("/new/posts", (req, res) => {
    res.render("new.ejs")
})
app.post("/posts", (req, res) => {
    let { username, content } = req.body;
    let userId = faker.string.uuid()
    let avatar = faker.image.avatar()
    let newPost = { username, content, userId, avatar }
    posts.push(newPost);
    res.redirect("/posts")
})
app.get("/posts/:id", (req, res) => {
    let postbody = req.params.id;
    let currentPost = posts.find((check) => check.userId === postbody)
    if (currentPost) {
        res.render("edit.ejs", { currentPost })
    }
})
app.patch("/posts/:id", (req, res) => {
    let postbody = req.params.id;
    let currentPost = posts.find((check) => check.userId === postbody)
    let { username, content } = req.body;
    currentPost.username = username;
    currentPost.content = content;
    res.redirect("/posts")
})
app.delete("/posts/:id", (req, res) => {
    const id = req.params.id;
    posts = posts.filter((check) => check.userId !== id);
    res.redirect('/posts');
})