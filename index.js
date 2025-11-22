const express = require("express");
const app = express();
let port = 9081;
const { faker } = require('@faker-js/faker');

const path = require("path");
app.set("view engine", "views");
app.set("views", path.join(__dirname, "/views"))

app.use(express.static(path.join(__dirname, 'public')))

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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
console.log(posts)

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
    console.log(posts)
    res.redirect("/posts")
})