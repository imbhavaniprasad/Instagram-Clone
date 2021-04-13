import React,{useState,useEffect} from 'react'
import './App.css';
import {db,auth} from './firebase'
import Nav from './components/Nav';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Posts from './components/Posts';
import { Button } from '@material-ui/core';
function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
      position: 'absolute',
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const[users,setUsers] = useState([]);
  const classes = useStyles();
  const [username, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const [openSignIn,setOpenSignIn] = useState(false);
  const [user,setUser] = useState(null);
  useEffect(()=>{
     const unsubscribe = auth.onAuthStateChanged((authUser)=>{
          if(authUser){
              //if user has logged in...
              setUser(authUser);
               if(authUser.displayName){
                 
              }else{
                return authUser.updateProfile({
                  displayName: username,
                });
              }
          }
          else{
              //...user logged in
              setUser(null);
          }
      })
      return()=>{
          unsubscribe();
      }
      
  },[user,username])
  const signUp = (e) => {
      e.preventDefault();
      // alert(email + "" + username);
      auth.createUserWithEmailAndPassword(email, password)
           .then(authUser=>{
               return authUser.user.updateProfile({
                   displayName : username
               })
              }
           ) 
          .catch(error => alert(error.message));
          setOpen(false);
  }
  const signIn =(e)=>{
    e.preventDefault();
    auth.signInWithEmailAndPassword(email , password)
    .catch((error) => alert(error.message));
    setOpenSignIn(false);
  }
  const body = (
      <div style={modalStyle} className={classes.paper}>
          <form className="modalform">
              <center><img className="formlogo" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png" alt="instagram" />
              </center>

              <input value={username} onChange={e => setUserName(e.target.value)} type='text' name="name" />
              <input value={email} onChange={e => setEmail(e.target.value)} type="email" name="email" />
              <input value={password} onChange={e => setPassword(e.target.value)} type="password" name="password" />
              <button className="btn btn-primary" onClick={signUp}>Sign Up</button>
          </form>
      </div>
  );
  const signinmodal = (
    <div style={modalStyle} className={classes.paper}>
        <form className="modalform">
            <center><img className="formlogo" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png" alt="instagram" />
            </center>
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" name="email" />
            <input value={password} onChange={e => setPassword(e.target.value)} type="password" name="password" />
            <button className="btn btn-primary" onClick={signIn}>Login</button>
        </form>
    </div>
);
  useEffect(()=>{
    db.collection('posts').onSnapshot(snapshot=>{
      setUsers(snapshot.docs.map(doc => ({
        id:doc.id,
        post:doc.data()
      })));
    })
  },[]);
  return (
    <div className="App">
    <Nav/>
    <div>
      {user?(<button type="button" onClick={()=>auth.signOut()}>
                Log Out
            </button>):
            ( <div className = "app__loginContainer">
            <button className="btn btn-primary" onClick ={()=>setOpen(true)}>Sign Up</button>
            <button className="btn btn-primary" onClick ={()=>setOpenSignIn(true)}>Sign In</button>
            </div>
        )
            }
            
            <Modal
                open={open}
                onClose={()=>setOpen(false)}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                {body}
            </Modal>
            <Modal
                open={openSignIn}
                onClose={()=>setOpenSignIn(false)}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                {signinmodal}
            </Modal>
        </div>
    {users.map((users,id)=>{
      return(
        <Posts key={id} username={users.post.username} caption={users.post.caption} imgurl={users.post.imgurl}/>
      );
    })}
    
    </div>
  );
}

export default App;
