import React, { useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

if(!firebase.apps.length)
  firebase.initializeApp({
  apiKey: "AIzaSyAoq0lJfAECOMrlDDvj_dZoC2_khRj8kW8",
  authDomain: "bulletchat-43e2d.firebaseapp.com",
  projectId: "bulletchat-43e2d",
  storageBucket: "bulletchat-43e2d.appspot.com",
  messagingSenderId: "508779799500",
  appId: "1:508779799500:web:515689704ec61e308fb369",
  measurementId: "G-SKX7EBLP8L"
  })
else  
  firebase.app();
const auth = firebase.auth();
const firestore = firebase.firestore();
const analytics = firebase.analytics();


function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <a href="/"> <h1>Chat Room</h1> </a>
        {user ? <SignOut /> : <SignIn />}
      </header>

      <section>
        {user ? <ChatRoom /> :<signInPrompt/>}
      </section>

    </div>
  );
}
function signInPrompt(){
   return (
    <>
      <h5>Please Sign in to continue</h5> 
    </>
  )
}
function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    console.log(provider);
    auth.signInWithPopup(provider);
  }

  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
    </>
  )

}

function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}


function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');


  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (<>
    <main>

      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <span ref={dummy}></span>

    </main>

    <form onSubmit={sendMessage}>

      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Enter text to send" />

      <button className="send-message-button" type="submit" disabled={!formValue}>Send</button>

    </form>
  </>)
}


function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div className={`message ${messageClass}`}>
      <img src={photoURL}  />
      <p>{text}</p>
    </div>
  </>)
}


export default App;