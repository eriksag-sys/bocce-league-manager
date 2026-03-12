import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDxqMtMYffVmyA65CKEgkC9eOPUxXV1yvY",
    authDomain: "bocce-tournaments.firebaseapp.com",
    projectId: "bocce-tournaments",
    storageBucket: "bocce-tournaments.firebasestorage.app",
    messagingSenderId: "321731864294",
    appId: "1:321731864294:web:7cd579229d2ed050eefd27",
    measurementId: "G-NY7Y1JN4BB"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function test() {
    console.log("Testing Firestore write...");
    try {
        const docRef = doc(db, 'appData', 'leagueState');
        await setDoc(docRef, { 
            leagueTeams: { 
                "spring_mon_day": Array.from({ length: 20 }, (_, i) => "Team " + i) 
            } 
        }, { merge: true });
        console.log("Success!");
    } catch (e) {
        console.error("Failed:", e);
    }
    process.exit();
}

test();
