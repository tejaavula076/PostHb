const express = require("express");
const app = express();
let port = process.env.PORT || 9081;
const { faker, da } = require('@faker-js/faker');

const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"))

app.use(express.static(path.join(__dirname, 'public')))

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

var methodOverride = require('method-override')
app.use(methodOverride('_method'))

app.listen(port, () => { console.log("port is listening") });

const mysql = require("mysql2");
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'insta',
    password: '$1Krishna'
})
// Created table here

// let q = `create table userinfo (userId varchar(100), username varchar(100), avatar varchar(100), content varchar(100))`;
// connection.query(q, (err, res) => {
//     console.log(res)
// })

//Added data into the table
// let post = []
// let dataforpost = () => {
//     return [
//         faker.string.uuid(),
//         faker.internet.username(),
//         faker.image.avatar(),
//         faker.hacker.phrase()
//     ]
// }
// for (let i = 0; i < 100; i++) {
//     post.push(dataforpost())
// }
// let q = `insert into userinfo (userId,username,avatar,content) values ?`;
// let data = post;
// connection.query(q, [data], (err, res) => {
//     console.log(res);
//     console.log("data inserted successfully")
// })


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
    let posts = `select * from userInfo`;
    connection.query(posts, (err, resp) => {
        res.render("index.ejs", { resp })
    })

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
    console.log("entered")
    let postbody = req.params.id;
    console.log(postbody)
    let q = `select * from userinfo where userId='${postbody}'`;
    connection.query(q, (err, response) => {
        let resp = response[0];
        res.render("edit.ejs", {resp})
    })
})
app.patch("/posts/:id", (req, res) => {
    let postbody = req.params.id;
    let {username,content} = req.body;
    let q = `update userinfo set username = '${username}' , content = '${content}' where userId = '${postbody}'`;
    connection.query(q, (err, resp) => {
        console.log(resp)
        res.redirect("/posts")
    })

})
app.delete("/posts/:id", (req, res) => {
    const id = req.params.id;
    posts = posts.filter((check) => check.userId !== id);
    res.redirect('/posts');
})