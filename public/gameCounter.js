import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  onSnapshot,
  increment,
  serverTimestamp
} from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';

const firebaseConfig = {
  // Replace with your Firebase config
  apiKey: "AIzaSyCeMdtNCOOGa7cC0H76DPZ6C1NZi5oz3Lc",
  authDomain: "nlevin-website.firebaseapp.com",
  projectId: "nlevin-website",
  storageBucket: "nlevin-website.appspot.com",
  messagingSenderId: "536212172988",
  appId: "1:536212172988:web:901203680b8df4711de0b9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export class GameCounter {
    constructor() {
        console.log('GameCounter: Initializing...');
        this.counterRef = doc(db, 'gameStats', 'counter');
        this.lastWriteRef = doc(db, 'lastWrite', 'initial'); // Set a reference for initial lastWrite
        this.initialized = false;
        this.init();
    }

    async init() {
        try {
            console.log('GameCounter: Starting initialization...');
            await this.setupAnonymousAuth();
            await this.setupCounter();
            await this.setupInitialCollection(); // Setup initial lastWrite
            this.setupListener();
            this.initialized = true;
            console.log('GameCounter: Initialization complete');
        } catch (error) {
            console.error('GameCounter: Error during initialization:', error);
            setTimeout(() => this.init(), 2000);
        }
    }

    async setupInitialCollection() {
        try {
            console.log('GameCounter: Attempting to create lastWrite document...');
            await setDoc(this.lastWriteRef, {
                timestamp: serverTimestamp(),
                uid: 'initial'
            });
            console.log('GameCounter: lastWrite document created');
            console.log('GameCounter: Initial lastWrite document set successfully');
        } catch (error) {
            console.error('GameCounter: Initial setup error:', error);
        }
    }

    async setupAnonymousAuth() {
        try {
            if (!auth.currentUser) {
                console.log('GameCounter: Setting up anonymous auth...');
                const userCred = await signInAnonymously(auth);
                console.log('GameCounter: Anonymous auth successful', userCred.user.uid);
            }
        } catch (error) {
            console.error('GameCounter: Auth error:', error);
            throw error;
        }
    }

    async setupCounter() {
        try {
            console.log('GameCounter: Setting up counter...');
            const counterDoc = await getDoc(this.counterRef);
            
            if (!counterDoc.exists()) {
                console.log('GameCounter: Creating initial counter document...');
                await setDoc(this.counterRef, {
                    count: 0,
                    createdAt: serverTimestamp(),
                    lastUpdated: serverTimestamp()
                });
                console.log('GameCounter: Counter initialized successfully');
            } else {
                console.log('GameCounter: Counter document exists:', counterDoc.data());
            }
        } catch (error) {
            console.error('GameCounter: Setup error:', error);
            throw error;
        }
    }

    setupListener() {
        console.log('GameCounter: Setting up listener...');
        // Unsubscribe from any existing listener
        if (this.unsubscribe) {
            this.unsubscribe();
        }

        this.unsubscribe = onSnapshot(this.counterRef, 
            (doc) => {
                console.log('GameCounter: Received update:', doc.data());
                if (doc.exists()) {
                    this.updateCounterDisplay(doc.data().count);
                }
            },
            (error) => {
                console.error('GameCounter: Listener error:', error);
            }
        );
    }

    updateCounterDisplay(count) {
        const counterDisplay = document.getElementById('globalCounter');
        if (counterDisplay) {
            console.log('GameCounter: Updating display to:', count);
            counterDisplay.textContent = `Global Games Played: ${count}`;
        } else {
            console.error('GameCounter: Counter display element not found');
        }
    }

    async incrementCounter() {
        try {
            if (!this.initialized) {
                console.log('GameCounter: Waiting for initialization...');
                await new Promise(resolve => {
                    const checkInit = setInterval(() => {
                        if (this.initialized) {
                            clearInterval(checkInit);
                            resolve();
                        }
                    }, 100);
                });
            }

            if (!auth.currentUser) {
                console.error('GameCounter: User not authenticated');
                await this.setupAnonymousAuth();
            }

            await updateDoc(this.counterRef, {
                count: increment(1),
                lastUpdated: serverTimestamp()
            });

            // Update last write timestamp for rate limiting
            const lastWriteRef = doc(db, 'lastWrite', auth.currentUser.uid);
            await setDoc(lastWriteRef, {
                timestamp: serverTimestamp()
            });

            console.log('GameCounter: Counter incremented successfully');
        } catch (error) {
            console.error('GameCounter: Increment error:', error);
        }
    }

    // Cleanup method
    destroy() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    }
}

export default GameCounter;