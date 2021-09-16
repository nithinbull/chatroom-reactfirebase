import './App.css';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyAoq0lJfAECOMrlDDvj_dZoC2_khRj8kW8",
  authDomain: "bulletchat-43e2d.firebaseapp.com",
  projectId: "bulletchat-43e2d",
  storageBucket: "bulletchat-43e2d.appspot.com",
  messagingSenderId: "508779799500",
  appId: "1:508779799500:web:4af36ffa1d8f725e8fb369",
  measurementId: "G-SE7DDR07BV"
})

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
        <header>

        </header>
        <section>
           <ChatRoom/>
        </section>
    </div>
  );
}

function SignIn(){
  const signInWithGoogle = ()=>{
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
      <p>Do not violate the community guidelines or you will be banned for life!</p>
    </>
  )
}

function SignOut() {
  return auth.currentUSer && (
    <button> Sign Out</button>
  )
}

function ChatRoom(){
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);
  const [messages] = useCollectionData(query,{idFeild : 'id'});
  
  return (
    <main>
      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
    </main>
  );
   
}

function ChatMessage(props){
  const {text, id} = props.message;
  //const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
  return <p>{text}</p>
}
export default App;
