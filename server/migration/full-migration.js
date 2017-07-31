// Setting up Firebase (would only need to run migration)

// can just use regular firebase
import firebase from 'firebase';
import mongoose from 'mongoose';
import migrateCrops from './crop-migration';
import migrateCompanionships from './companionship-migration';

// initialize mongo
mongoose.connect('mongodb://192.168.99.100/pp_main');
mongoose.Promise = global.Promise;

// Initialize Firebase
const config = {
	apiKey: 'AIzaSyCKLggXck_1fxtoSn0uvjQ00gEapjLJDbM',
	authDomain: 'companion-planting-b56b5.firebaseapp.com',
	databaseURL: 'https://companion-planting-b56b5.firebaseio.com',
	projectId: 'companion-planting-b56b5',
	storageBucket: 'companion-planting-b56b5.appspot.com',
	messagingSenderId: '158677284326'
};
firebase.initializeApp(config);

console.log('Beginning migration');
migrateCrops().then(migrateCompanionships).then(() => {
	console.log('Migration complete!');
	process.exit();
});
