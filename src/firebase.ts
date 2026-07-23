import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  apiKey: "AIzaSyABCDEFGHIJKLMNOPQRSTUVWXYZ123456",
  authDomain: "naruto-helper-xxxxx.firebaseapp.com",
  databaseURL: "https://naruto-helper-xxxxx-default-rtdb.firebaseio.com",
  projectId: "naruto-helper-xxxxx",
  storageBucket: "naruto-helper-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
}

const app = initializeApp(firebaseConfig)
export const db = getDatabase(app)