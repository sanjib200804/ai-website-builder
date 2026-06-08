// Import the functions you need
import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyAHhkSoJ90HKkby_KIpfRb-C0ECjHfJyns',
  authDomain: 'webgeineai.firebaseapp.com',
  projectId: 'webgeineai',
  storageBucket: 'webgeineai.firebasestorage.app',
  messagingSenderId: '787663275941',
  appId: '1:787663275941:web:c9cfebb8a0e73adab20a4c',
  measurementId: 'G-THB6EQS333'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// ✅ correct auth
const auth = getAuth(app)

// ✅ google provider
const provider = new GoogleAuthProvider()

export { auth, provider }
