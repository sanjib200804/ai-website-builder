// Import the functions you need
import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyBi6dxJ25Vb9SyTig9oHXy4LsxgB2O0jLo',
  authDomain: 'aiwedsitebuilder.firebaseapp.com',
  projectId: 'aiwedsitebuilder',
  storageBucket: 'aiwedsitebuilder.firebasestorage.app',
  messagingSenderId: '9500636402',
  appId: '1:9500636402:web:65ca62fe0db77492c2cc6b'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// ✅ correct auth
const auth = getAuth(app)

// ✅ google provider
const provider = new GoogleAuthProvider()

export { auth, provider }
