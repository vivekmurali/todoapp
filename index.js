const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const TodoTask = require('./models/TodoTask');


dotenv.config();

const app = express();

app.use('/static', express.static('public'));

app.use(express.urlencoded({
    extended: true
}));

mongoose.set("useFindAndModify", false);

mongoose.connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => {
    console.log('Connected to DB!');
    app.listen(3000, () => {
        console.log("Server is up and running!");
    });
});




app.get('/', (req, res) => {
    TodoTask.find({}, (err, tasks) => {
        res.render('todo.ejs', {
            todoTasks: tasks
        });
    });
});

app.post('/', async (req, res) => {
    const todoTask = new TodoTask({
        content: req.body.content
    });

    try {
        await todoTask.save();
        res.redirect('/');
    } catch (err) {
        res.redirect('/');
    }
});

app.set("view engine", "ejs");

app.route("/remove/:id")
    .get((req, res) => {
        const id = req.params.id;
        TodoTask.findByIdAndRemove(id, err => {
            if (err){ return res.send(500, err);}
            res.redirect("/");
            console.log('ddelete');
        });
    });

app
    .route('/edit/:id')
    .get((req, res) => {
        const id = req.params.id;
        //console.log('trus');
        TodoTask.find({}, (err, tasks) => {
            res.render('todoEdit.ejs', {
                todoTasks: tasks,
                idTask: id
            });
        });
    })
    .post((req, res) => {
        const id = req.params.id;
       // console.log('trust');
        TodoTask.findByIdAndUpdate(id, {
            content: req.body.content
        }, err => {
            if (err) return res.send(500, err);
            res.redirect("/");
        });
    });




