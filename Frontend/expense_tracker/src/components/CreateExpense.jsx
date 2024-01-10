import React, { useState } from "react";

function CreateExpense(props){
    const d=new Date();
    const currDate=d.getDate();
    const currMonth=d.getMonth();
    const currYear=d.getFullYear();
    const date= currDate < 10 ? currYear+"-"+currMonth+1+"-"+"0"+currDate :  currYear+"-"+currMonth+1+"-"+currDate;


    const [newXpense,setnewXpense]=useState({
        title:"",
        cost:"",
        date:"",
        note:""
    });
    function handleChange(event){
        const {name,value}=event.target;
        setnewXpense(prevXpense => {
            return {...prevXpense,
                [name]:value
            };
        });
    }
    function handleCreate(event){
        props.onAdd(newXpense);
        setnewXpense({
            title: "",
            cost: "",
            date:"",
            note:""
        });
        event.preventDefault();
        window.location.reload();
    }
    return(
        <div className="inputForm">
            <p className="titleXpense">Add A New Expense</p>
            <form onSubmit={handleCreate}>
                <div className="outerDetails">
                    <div className="formDetails">
                        <div>
                            <input type="text" className="form-control" id="myForm" placeholder="Title" onChange={handleChange} name="title" value={newXpense.title}/>
                        </div>
                        <div className="costForm">
                            <span className="rupee">&#8377;</span>
                            <input type="number" className="form-control" id="myForm" placeholder="Cost" onChange={handleChange} name="cost" value={newXpense.cost}/>
                        </div>
                        <div>
                            <input type='date' className="form-control" id="myForm" placeholder="Date" max={date} onChange={handleChange} name="date" value={newXpense.date}/>
                        </div>
                    </div>
                    <div>
                        <textarea className="form-control" placeholder="Additional Notes" onChange={handleChange} name="note" value={newXpense.note}></textarea>
                    </div>
                    <button className="btn btn-success" type="submit">Add Expense</button>
                </div>
            </form>
        </div>
    )
}

export default CreateExpense;