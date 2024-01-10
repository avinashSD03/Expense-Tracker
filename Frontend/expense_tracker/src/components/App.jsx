import React, { useEffect, useState } from 'react';
import Header from './Header';
import CreateExpense from './CreateExpense';
import ExpenseList from './ExpenseList';
import ExpenseHead from './ExpenseHead';
import TrackRecords from './TrackRecords';
import RecordList from './RecordList';
import Axios from 'axios';

function App(){
    const [expenses,setExpenses]=useState([]);
    const [total,setTotal]=useState(0);
    const [trackRecords,settrackRecords]=useState([]);
    const [unique,setUnique]=useState([]);


    async function getExpenses(){
        const response= await Axios.get("http://localhost:3001/expenses");
        setExpenses(response.data);
    }
    async function getTotal(){
        const response= await Axios.get("http://localhost:3001/totalCost");
        setTotal(response.data[0].totalcost);
    }
    async function getUniqueYears(){
        const response= await Axios.get("http://localhost:3001/uniqueYears");
        setUnique(response.data);
    }
    useEffect(()=>{
        getExpenses();
    },[]);
    useEffect(()=>{
        getTotal();
    },[]);
    useEffect(()=>{
        getUniqueYears();
    },[]);
   
    async function addExpense(newItem){
        await Axios.post("http://localhost:3001/addExpense",{
            title:newItem.title,
            cost:newItem.cost,
            date:newItem.date,
            note:newItem.note
        });
        setExpenses(prevXpense=>{
            return[...prevXpense,newItem]
        })
    }

    async function editExpense(newItem,id){
        setExpenses(updateItems=>{
            return updateItems.map((items,index) => index===id?items=newItem:items)
        });
        await Axios.put(`http://localhost:3001/update/${id}`,{
            title:newItem.title,
            cost:newItem.cost,
            date:newItem.date,
            note:newItem.note
        });
    }
    async function orderPrice(type){
        const response= await Axios.get(`http://localhost:3001/filterPrice/${type}`);
        setExpenses(response.data);
    }
    async function orderDate(type){
        const response= await Axios.get(`http://localhost:3001/filterDate/${type}`);
        setExpenses(response.data);
    }
    async function getMonth(type){
        const response= await Axios.get(`http://localhost:3001/filterMonth/${type}`);
        setExpenses(response.data);
    }
    async function getTrackRecords(year){
        const response= await Axios.get(`http://localhost:3001/trackRecord/${year}`);
        settrackRecords(response.data);
    }

    return(
            <div>
                <Header/>
                <div className='columnDisplay'>
                    <div>
                        <CreateExpense onAdd={addExpense}/>
                        <ExpenseHead sum={total}
                                     filterPrice={orderPrice}
                                     filterDate={orderDate}
                                     filterMonth={getMonth}
                        />
                        <div className='expenseList'>
                            {expenses.map(exp=>{
                                return(
                                    <ExpenseList
                                        key={exp.exp_id}
                                        id={exp.exp_id}
                                        title={exp.exp_title}
                                        cost={exp.truncost}
                                        date={exp.formatted_date}
                                        note={exp.exp_note}
                                        onEdit={editExpense}
                                    />
                                )
                                })
                            }
                        </div>
                    </div>
                    <div>
                        <TrackRecords
                            Disyears={unique}
                            demandYear={getTrackRecords}
                        />
                        <div className='recordList'>
                            <RecordList records={trackRecords}/>
                        </div>
                    </div>
                </div>
            </div>
    );
}

export default App;