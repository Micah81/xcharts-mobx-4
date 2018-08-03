import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const prodConfig = {
    apiKey: "AIzaSyAIfCmXQcx0iCIeot1-PtmrJBPD7fDOGGI",
    authDomain: "xcharts-385f8.firebaseapp.com",
    databaseURL: "https://xcharts-385f8.firebaseio.com",
    projectId: "xcharts-385f8",
    storageBucket: "xcharts-385f8.appspot.com",
    messagingSenderId: "121322119064"
  };

const devConfig = {
    apiKey: "AIzaSyAIfCmXQcx0iCIeot1-PtmrJBPD7fDOGGI",
    authDomain: "xcharts-385f8.firebaseapp.com",
    databaseURL: "https://xcharts-385f8.firebaseio.com",
    projectId: "xcharts-385f8",
    storageBucket: "xcharts-385f8.appspot.com",
    messagingSenderId: "121322119064"
  };

const config = process.env.NODE_ENV === 'production'
  ? prodConfig
  : devConfig;

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const db = firebase.database();
const auth = firebase.auth();

export {
  db,
  auth,
};
