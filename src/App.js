import './assets/App.css';
import Main from './components/Main.tsx'
import { useEffect, useState, useRef } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, off , child, onValue, get} from "firebase/database";
import {getAuth,  signInWithEmailAndPassword} from "firebase/auth"
import Global from "./Global.js";
import sun from "./assets/sun_icon.png";
import { WeatherProvider } from "./provider/WeatherProvider.js"; // ← importuj Provider
import Alerts from "./components/Alerts.js";

const firebaseConfig = {
  apiKey: "AIzaSyBdMuzQU24tYjF99SBlFcfxp4c8_dn1-hI",
  authDomain: "pogodynka-e398e.firebaseapp.com",
  databaseURL: "https://pogodynka-e398e-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "pogodynka-e398e",
  storageBucket: "pogodynka-e398e.firebasestorage.app",
  messagingSenderId: "766903572746",
  appId: "1:766903572746:web:04919bbb638e3a2a38c2f3"
};


// function NoMobile() {
//   return(<div class="info"><div class="info-text">{"Aplikacja nie działa na urządzeniach mobilnych (;"}</div></div>);
// }
function notify(title, msg) {
    if (Notification.permission === 'granted') {
      new Notification(title, {
        body: `${msg}`,
        icon: `${sun}`
      });
    }
}

function getGlobalAlerts(fb) {
  const dbRef = ref(fb);
  const adminRef = child(dbRef, `msg1`);
  let cnt = 0;
    onValue(adminRef, snapshot => {
      cnt++;
      if(cnt === 1) return;
      if (snapshot.exists()) {
        const msg = snapshot.val();
        notify('Globalny alert', msg)
      } 
    });
  }
  function rmLocalAlerts(fb, city) {
    console.log("❌ Unsubscribing:", city);
    const dbRef = ref(fb);
    const adminRef = child(dbRef, city);
    off(adminRef)
  }
  function addLocalAlerts(fb, city, setData) {
    const dbRef = ref(fb);
    const adminRef = child(dbRef, city);

    console.log("✅ subscribing ", city);
    onValue(adminRef, snapshot => {
    console.log("✅ wlazło ", city, snapshot.exists());
      
      if (snapshot.exists()) {
          const msg = snapshot.val();
          const tab = msg.split(" ");
          console.log(city, tab[1])
          if(tab.lenght < 2) return;
          const msgDate = new Date(tab[1]);
          console.log("✅isNaN(msgDate.getTime())",isNaN(msgDate.getTime()))
          if (isNaN(msgDate.getTime())) return;
          const d = new Date();
          const now = new Date(d.getFullYear(), d.getMonth(), d.getDate());
          console.log("now > msgDate",now > msgDate)
          if(now > msgDate) return;
          console.log("✅ setData",setData)
          if(setData) {
            console.log("✅ updating ", city);
            setData(prevData => [...prevData, { city, msg }]);
          }
          notify(city, msg);
        } 
    });
}


function App() {
  const [data, setData] = useState([]);
  const subscribedCities = useRef(new Set());

  const firebaseApp = initializeApp(firebaseConfig);
  const database = getDatabase(firebaseApp);
  const auth = getAuth(firebaseApp);
  
  function unsubscribe(city) {
    subscribedCities.current.delete(city);
    rmLocalAlerts(database, city)
  }
  function subscribe(city) {
    if (subscribedCities.current.has(city)) return;
    subscribedCities.current.add(city);
    const auth = getAuth();
    const user = auth.currentUser;

      if (user) {
        console.log("✅ Użytkownik jest zalogowany:", user.email);
      } else {
        console.log("❌ Brak zalogowanego użytkownika");
      }
    // signInWithEmailAndPassword(auth, Global.email, Global.password)
    //   .then(userCredential => {
          addLocalAlerts(database, city, setData)
  // })
  // .catch(error => {
  //   console.error("❌ Błąd logowania:", error.message);
  // });
    
  }      
useEffect(() => {
  console.log("USE EFFECT")
    signInWithEmailAndPassword(auth, Global.email, Global.password)
      .then(userCredential => {
        getGlobalAlerts(database)
        let list = []
        if(localStorage.getItem("follow_cities"))
          list = JSON.parse(localStorage.getItem("follow_cities")) ?? []
        console.log(list)
        for(const city of list) {
          //console.log("*"+city)
          addLocalAlerts(database, city, setData)
        }
  })
  .catch(error => {
    console.error("❌ Błąd logowania:", error.message);
  });
  }, []);
  return (
    <WeatherProvider onUnsubscribe={unsubscribe} onSubscribe={subscribe}> 
      <div className="App">
        <Alerts data={data} close={false}/>
        <Main />
      </div>
    </WeatherProvider>
  );
}

export default App;
