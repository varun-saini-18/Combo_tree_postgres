const express = require("express");
const app = express();
const cors = require('cors');
const pool = require("./db.js");

app.use(express.json());
app.use(cors());

app.post("/todos", async (req, res) => {
    try {
        const { title } = req.body;
        const { id } = req.body;
        const { isselectable } = req.body;
        const { subs } = req.body;
        const { children_id } = req.body;
        const { is_child } = req.body;
        const newTodo = await pool.query(
            "INSERT into todo (title,id,isselectable,subs,children_id,is_child) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
            [title, id, isselectable, subs, children_id, is_child]
        );

        res.json(newTodo.rows);
    } catch (err) {
        console.log(err.message + "Yes!");
    }
});

app.get('/todos', async (req, res) => {
    try {
        
        const allTodos = await pool.query(
                "SELECT * FROM todo WHERE is_child = false");

        var i;
        for (i = 0; i < allTodos.rows.length; i++) {
            var j;
            for (j = 0; j < allTodos.rows[i].children_id.length; j++) {
                var todo1 = await pool.query("SELECT * FROM todo WHERE id = $1", [allTodos.rows[i].children_id[j]])
                delete todo1.rows[0].subs;
                delete todo1.rows[0].is_child;
                delete todo1.rows[0].children_id;
                delete todo1.rows[0].todo_id;
                allTodos.rows[i].subs.push(todo1.rows[0]);
            }
            if (allTodos.rows[i].subs.length == 0)
                delete allTodos.rows[i].subs;
            delete allTodos.rows[i].is_child;
            delete allTodos.rows[i].children_id;
            delete allTodos.rows[i].todo_id;
        }
        res.json(allTodos.rows);
    } catch (err) {
        console.log("Err: " + err);
    }
});

app.get("/todos/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const todo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [id])
        res.json(todo.rows[0]);
    } catch (err) {
        console.log("Err: " + err);
    }
})

app.delete("/todos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deleteTodo = await pool.query("DELETE FROM todo WHERE todo_id = $1", [id])
        res.json("Todo was successfuly deleted!");
    } catch (err) {
        console.log("Err: " + err);
    }
})

app.listen(5000, () => {
    console.log("server is listening on port 5000");
});