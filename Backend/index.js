import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import _ from 'lodash';
import cors from 'cors';

const app = express();
const port = 3001;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "expensetracker",
  password: "your password",
  port: 5432,
});
db.connect();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());

app.get('/expenses',async(req,res)=>{
    const queryRes=await db.query("SELECT exp_id,exp_title,trunc(exp_cost) as truncost,TO_CHAR(exp_date, 'DD/MM/YYYY') AS formatted_date,exp_note FROM expenses ORDER BY exp_id desc");
    res.json(queryRes.rows);
})
app.get('/totalCost',async(req,res)=>{
    const queryRes=await db.query("SELECT SUM(exp_cost) as totalcost FROM expenses");
    res.json(queryRes.rows);
})
app.post('/addExpense',async(req,res)=>{
    const {title,cost,date,note}=req.body;
    await db.query("INSERT INTO expenses(exp_title,exp_cost,exp_date,exp_note) VALUES($1,$2,$3,$4) RETURNING *",[title,cost,date,note]);
})
app.put('/update/:id',async(req,res)=>{
    const item_id=req.params.id;
    const {title,cost,date,note}=req.body;
    await db.query("UPDATE expenses SET exp_title=$1,exp_cost=$2,exp_date=$3,exp_note=$4 where exp_id=$5",[title,cost,date,note,item_id]);
})
app.get('/filterPrice/:type',async(req,res)=>{
    const type=req.params.type;
    if(type==="asc"){ 
        const queryRes=await db.query("SELECT exp_id,exp_title,trunc(exp_cost) as truncost,TO_CHAR(exp_date, 'DD/MM/YYYY') AS formatted_date,exp_note FROM expenses ORDER BY truncost")
        res.json(queryRes.rows);
    }
    else{
        const queryRes=await db.query("SELECT exp_id,exp_title,trunc(exp_cost) as truncost,TO_CHAR(exp_date, 'DD/MM/YYYY') AS formatted_date,exp_note FROM expenses ORDER BY truncost DESC")
        res.json(queryRes.rows);
    }
})
app.get('/filterDate/:type',async(req,res)=>{
    const type=req.params.type;
    if(type==="asc"){ 
        const queryRes=await db.query("SELECT exp_id,exp_title,trunc(exp_cost) as truncost,TO_CHAR(exp_date, 'DD/MM/YYYY') AS formatted_date,exp_note FROM expenses ORDER BY formatted_date")
        res.json(queryRes.rows);
    }
    else{
        const queryRes=await db.query("SELECT exp_id,exp_title,trunc(exp_cost) as truncost,TO_CHAR(exp_date, 'DD/MM/YYYY') AS formatted_date,exp_note FROM expenses ORDER BY formatted_date DESC")
        res.json(queryRes.rows);
    }
})
app.get('/filterMonth/:type',async(req,res)=>{
    const type=req.params.type;
    const queryRes=await db.query("SELECT exp_id,exp_title,trunc(exp_cost) as truncost,TO_CHAR(exp_date, 'DD/MM/YYYY') AS formatted_date,exp_note FROM expenses WHERE EXTRACT(MONTH FROM exp_date)=$1",[type])
    res.json(queryRes.rows);
});
app.get('/trackRecord/:year',async(req,res)=>{
    const year=req.params.year;
    const queryRes=await db.query("SELECT EXTRACT(YEAR FROM exp_date) as years,TO_CHAR(exp_date, 'Month') as months,SUM(exp_cost) as sum from expenses where EXTRACT(YEAR FROM exp_date)=$1 group by years,months",[year]);
    res.json(queryRes.rows);
})
app.get('/uniqueYears',async(req,res)=>{
    const queryRes=await db.query("SELECT DISTINCT EXTRACT(YEAR FROM exp_date) as years from expenses");
    res.json(queryRes.rows);
})
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
