import React, {useState, useEffect} from 'react'
import Alert from './Alert'
import List from './List'

const getlocalstorage =()=>{
    let list = localStorage.getItem('list')
    if(list){
        return JSON.parse(localStorage.getItem('list'))
    }else{
        return []
    }
}

function Main() {
    const [name, setName] = useState('')
    const [list, setList] = useState(getlocalstorage)
    const [isEditing, setIsEditing] = useState(false)
    const [editID, setEditID] = useState(null)
    const [alert, setAlert] = useState({show:false, msg:'', type:''})

    const submitHandler =(e)=>{
        e.preventDefault();
        if(!name){
            showAlert(true,'Please enter valid item', 'danger')
        } else if(name && isEditing){
            setList(
                list.map((item)=>{
                    if(item.id===editID){
                        return {...item, title:name}
                    }
                    return item
                })
            )
            setName('')
            setEditID(null)
            setIsEditing(false)
            showAlert(true, 'Value changed', 'success')
        } else{
            showAlert(true, 'item added to the list', 'success')
            const newItem = {id: new Date().getTime().toString(),
            title:name}
            setList([...list, newItem])
            setName('')
            
        }
    }
    const showAlert =(show=false,msg="",type="")=>{
        setAlert({show,msg,type})
    }

    const clearList =()=>{
        showAlert(true,'empty list', 'danger')
        setList([])
    }

    const removeItem =(id, title)=>{
        showAlert(true,`${title} is deleted from the list`, 'danger')
        setList(list.filter((item)=>item.id !== id))
    }

    const editItem=(id)=>{
        const specificItem = list.find((item)=>item.id===id)
        setIsEditing(true)
        setEditID(id)
        setName(specificItem.title)
        showAlert(true, 'you are editing item', 'success')
    }

    useEffect(()=>{
        localStorage.setItem('list', JSON.stringify(list))
    },[list])
    return <section className="section-center">
        <form className="grocery-form" onSubmit={submitHandler}>
            {alert.show && <Alert {...alert} list={list} removeAlert={showAlert} />}
            <p className="Heading">Grocery Bud</p>
            <div className="form-control">
                <input type="text" placeholder="e.g Eggs" className="grocery-input" value={name} onChange={(e)=>{setName(e.target.value)}} />
                <button type="submit" className="submit-btn">{isEditing?'Edit':'Submit'}</button>
            </div>
        </form>
        {list.length > 0 &&
        <div className="grocery-container">
            <List items={list} removeItem={removeItem} editItem={editItem} />
            <button className="clear-btn" onClick={clearList} >Clear items</button>
        </div>
        }
    </section>
}

export default Main
