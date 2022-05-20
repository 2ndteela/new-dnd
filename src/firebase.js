import { initializeApp } from 'firebase/app';
import { getDatabase } from "firebase/database";
import { getAuth } from 'firebase/auth'

var config = {
    apiKey: "AIzaSyBPB4XiRrEAbU-WXM999w8SiBch0GqVzZU",
    authDomain: "dee-and-dee.firebaseapp.com",
    databaseURL: "https://dee-and-dee.firebaseio.com",
    projectId: "dee-and-dee",
    storageBucket: "dee-and-dee.appspot.com",
    messagingSenderId: "412223361454"
};

const app = initializeApp(config);
getDatabase(app)
getAuth(app)