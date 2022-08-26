# Simple TODO web-app using React


## Overview
![Aug-24-2022 15-45-32](https://user-images.githubusercontent.com/99692392/186727828-d5a171f3-2786-40ae-bb7a-2713fdbf7928.gif)


### `create`
#### you can create todo list . fill out title and description then click submit button
```Javascript
function Create(props){
  return <article>
    <h2>Create</h2>
    <form onSubmit={event=>{ //event happened when submit button is clicked
      event.preventDefault();
      const title = event.target.title.value;//get value from form title, event target is <form>
      const body = event.target.body.value;//get value from form title, event target is <form>
      props.onCreate(title, body); //pass inputs to onCreate function
    }}>
}
```
```Javascript
else if(mode === 'CREATE'){
    content = <Create onCreate={(_title, _body)=>{
      const newTopic = {id:nextId, title:_title, body:_body}
      const newTopics = [...topics] //duplicate topics
      newTopics.push(newTopic); //add new element to duplication of topics!!
      setTopics(newTopics); //react will compare newTopics and topics then render component if they are different
      setMode('READ'); //check if 'create' worked well
      setId(nextId); //the one just created will become next Id
      setNextId(nextId+1); //getting ready for the next one that will be added
    }}></Create>
}
```

### `read`
#### if you click one of your todos, title and description are shown. you can update and delete that todo.

```Javascript
else if(mode === 'READ'){
    let title, body = null; //their initial value is null because nothing is created at first, but can change
    for(let i=0; i<topics.length; i++){ //find element of topics which match with id state
      if(topics[i].id === id){
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content = <Article title={title} body={body}></Article>
    contextControl = <>
      <li><a className="navigation" href={'/update/'+id} onClick={event=>{
    //if read button is clicked, update should appear
        event.preventDefault();
        setMode('UPDATE');
      }}>Update</a></li>
      <li><input type="button" value="Delete" onClick={()=>{
        //if read button is clicked, delete should appear
        const newTopics = [] //this is not 'topics'
        for(let i=0; i<topics.length; i++){
          if(topics[i].id !== id){
            newTopics.push(topics[i]); //push element from topics to new array
          }
        }
        setTopics(newTopics);
        setMode('WELCOME');
      }} /></li>
    </>//empty tag just for grouping
}
```

### `update`
#### by clicking update button, you can modify your todo.
```Javascript
function Update(props){
  const [title, setTitle] = useState(props.title); //change props to state. State is what insider use, so can be changed within component
  const [body, setBody] = useState(props.body);
  return <article>
    <h2>Update</h2>
    <form onSubmit={event=>{
      event.preventDefault();
      const title = event.target.title.value;
      const body = event.target.body.value;
      props.onUpdate(title, body); //pass new value to onUpdate
    }}>
      <p><input type="text" name="title" placeholder="title" value={title} onChange={event=>{ //to have original/onChange happen everytime we input
        setTitle(event.target.value); //chage to new title
      }}/></p>
      <p><textarea name="body" placeholder="body" value={body} onChange={event=>{
        setBody(event.target.value); //change to new body
      }}></textarea></p>
      <p><input type="submit" value="Update"></input></p>
    </form>
  </article>
}
```
```Javascript
else if(mode === 'UPDATE'){
    let title, body = null;
    for(let i=0; i<topics.length; i++){
      if(topics[i].id === id){
        title = topics[i].title;
        body = topics[i].body;
      }//find original title and body
    }
    content = <Update title={title} body={body} onUpdate={(title, body)=>{//this let form display original title and body
      const newTopics = [...topics] //the one we are about to change is array
      const updatedTopic = {id:id, title:title, body:body} //edited topic. come from Read
      for(let i=0; i<newTopics.length; i++){
        if(newTopics[i].id === id){
          newTopics[i] = updatedTopic; //change newTopics to updatedTopic
          break;
        }
      }
      setTopics(newTopics); 
      setMode('READ'); //display changed content
    }}></Update>
}
```

### `delete`
#### you can delete your todo
```Javascript
<li><input type="button" value="Delete" onClick={()=>{
        const newTopics = [] //this is not 'topics'. new array
        for(let i=0; i<topics.length; i++){
          if(topics[i].id !== id){
            newTopics.push(topics[i]); //find the one user wants to delete than add to new array
          }
        }
        setTopics(newTopics);
        setMode('WELCOME');
      }} /></li>
```
