import logo from './logo.svg';
import styles from './App.css';
import React, {useState} from 'react';

function Article(props){
  return <article>
    <h2>{props.title}</h2>
    {props.body}
  </article>
}
function Header(props){
  return <header>
    <h1><a className="mainTitle" href="/" onClick={(event)=>{
      event.preventDefault(); //no reload
      props.onChangeMode();
    }}>{props.title}</a></h1> 
  </header>
}
function Nav(props){ 
  const lis = []
  for(let i=0; i<props.topics.length; i++){
    let t = props.topics[i];
    lis.push(<li key={t.id}>
      <a id={t.id} href={'/read/'+t.id} onClick={event=>{ //t.id is string
        event.preventDefault();
        props.onChangeMode(Number(event.target.id));
      }}>{t.title}</a>
    </li>)
  }
  return <nav>
    <ol>
      {lis} 
    </ol>
  </nav>
}//{lis} will locate element of list
function Create(props){
  return <article>
    <h2>Create</h2>
    <form onSubmit={event=>{ //event happened when submit button is clicked
      event.preventDefault(); //no need to reload
      const title = event.target.title.value; //get value from form title, event target is form tag
      const body = event.target.body.value; //get value from form body, event target is form tag
      props.onCreate(title, body);
    }}>
      <p><input type="text" name="title" placeholder="title"/></p>
      <p><textarea name="body" placeholder="description"></textarea></p>
      <p><input type="submit" value="Create"></input></p>
    </form>
  </article>
}
function Update(props){
  const [title, setTitle] = useState(props.title); //change props to state. State is what insider use, so can be changed within component
  const [body, setBody] = useState(props.body);
  return <article>
    <h2>Update</h2>
    <form onSubmit={event=>{
      event.preventDefault();
      const title = event.target.title.value;
      const body = event.target.body.value;
      props.onUpdate(title, body);
    }}>
      <p><input type="text" name="title" placeholder="title" value={title} onChange={event=>{ //onChange happen everytime we input
        setTitle(event.target.value); //chage to new title
      }}/></p>
      <p><textarea name="body" placeholder="body" value={body} onChange={event=>{
        setBody(event.target.value); //change to new body
      }}></textarea></p>
      <p><input type="submit" value="Update"></input></p>
    </form>
  </article>
}
function App() {
  let today = new Date();
  const [mode, setMode] = useState('WELCOME');
  const [id, setId] = useState(null); //to print what topic is chosen.
  const [nextId, setNextId] = useState(0); //manage id seperately
  const [topics, setTopics] = useState([]);
  let content = null;
  let contextControl = null;
  if(mode === 'WELCOME'){
    content = <Article title="Welcome" body="create your to-do list"></Article>
  } else if(mode === 'READ'){
    let title, body = null;
    for(let i=0; i<topics.length; i++){ //find element of topics which match with id state
      if(topics[i].id === id){ //
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content = <Article title={title} body={body}></Article>
    contextControl = <>
      <li><a className="navigation" href={'/update/'+id} onClick={event=>{
        event.preventDefault();
        setMode('UPDATE');
      }}>Update</a></li>
      <li><input type="button" value="Delete" onClick={()=>{
        const newTopics = [] //this is not 'topics'
        for(let i=0; i<topics.length; i++){
          if(topics[i].id !== id){
            newTopics.push(topics[i]);
          }
        }
        setTopics(newTopics);
        setMode('WELCOME');
      }} /></li>
    </>//empty tag just for grouping
  } else if(mode === 'CREATE'){
    content = <Create onCreate={(_title, _body)=>{
      const newTopic = {id:nextId, title:_title, body:_body}
      const newTopics = [...topics] //duplicate topics
      newTopics.push(newTopic); //add new element to duplication of topics!!
      setTopics(newTopics); //react will compare newTopics and topics then ender component if they are different
      setMode('READ'); //check if create worked well
      setId(nextId);
      setNextId(nextId+1); //getting ready for the next one that will be added
    }}></Create>
  } else if(mode === 'UPDATE'){
    let title, body = null;
    for(let i=0; i<topics.length; i++){
      if(topics[i].id === id){
        title = topics[i].title;
        body = topics[i].body;
      } //find original title and body
    }
    content = <Update title={title} body={body} onUpdate={(title, body)=>{//update component now has original title and body
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
  return (
    <div>
      <h2>{today.getFullYear()+'-'+today.getMonth()+'-'+today.getDate()}</h2>
      <Header title="< TODO >" onChangeMode={()=>{
        setMode('WELCOME');
      }}></Header>
      <Nav topics={topics} onChangeMode={(_id)=>{
        setMode('READ');
        setId(_id);//_id changes when user click, then component re-execute which make new Id value
      }}></Nav>
      {content}
      <ul className="list">
        <li><a className="navigation" href="/create" onClick={event=>{
          event.preventDefault();
          setMode('CREATE'); //mode became 'create' and app component re-execute
        }}>Create</a></li>
        {contextControl}
      </ul>
    </div>
  );
}

export default App;