import React, { useState } from 'react';
 

function ExpenseList(props){

    const [editXpense,seteditXpense]=useState({
        title:props.title,
        cost:props.cost,
        date:props.date,
        note:props.note
    })
    const [isClicked,setisClicked]=useState(false);

    function handleClick(){
        setisClicked(!isClicked);
    }
    function handleChange(event){
        const {name,value}=event.target;
        seteditXpense(prevXpense => {
            return {...prevXpense,
                [name]:value
            };
        });
    }
    function handleSubmit(event){
        setisClicked(!isClicked);
        props.onEdit(editXpense,props.id)
        document.getElementById("updateField").setAttribute("hidden",true);
        event.preventDefault();
        window.location.reload();
    }
    return(
        !isClicked ?(
            <div className="list-group">
                <div className="list-group-item list-group-item-actions">
                    <div className="d-flex w-100 justify-content-between">
                        <h4 className="mb-1 myEdits">{props.title}</h4>
                        <p className='myEdits'>&#8377; {props.cost}</p>
                    </div>
                    <p className="mb-1 myEdits">{props.note}</p>
                    <div className='d-flex w-100 justify-content-between'>
                        <small className='myEdits'>{props.date}</small>
                        <i onClick={handleClick} type="button" className="fa fa-pencil"></i>
                    </div>
                </div>
            </div>
      )
      :
      (
        <div>
            <form>
                <div className="list-group">
                    <div className="list-group-item list-group-item-actions">
                        <div className="d-flex w-100 justify-content-between">
                            <h4 className="mb-1"><input id='updateField' className='editIn' onChange={handleChange} type='text' name='title' value={editXpense.title}/></h4>
                            <p>&#8377; <input id='updateField' className='editIn shortBox' onChange={handleChange} type='text' name='cost' value={editXpense.cost}/></p>
                        </div>
                        <p className="mb-1"><input id='updateField' className='editIn' onChange={handleChange} type='text' name='note' value={editXpense.note}/></p>
                        <div className='d-flex w-100 justify-content-between'>
                            <small><input id='updateField' className='editIn' onChange={handleChange} type='text' name='date' value={editXpense.date}/></small>
                            <span className='my' type="submit" onClick={handleSubmit}>&#10003;</span>
                        </div>
                    </div>
                </div>
           </form>
         </div>
      )
    )
}

export default ExpenseList;