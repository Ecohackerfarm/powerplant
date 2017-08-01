import Crop from '../models/crop';
import firebase from 'firebase';

/**
 * Migrate all crops from firebase to local mongodb database
 * @return {Promise} passes the migrated crops to resolve once they all finish migrating
 */
function migrateCrops() {
	// returning a promise so we can wait until it resolves to migrate companionships
	return new Promise(resolve => {
		Crop.find({}).remove().exec();
		const search = firebase.database().ref('/plants').once('value');
		search.then(function(snapshot) {
			const data = snapshot.val();
			const promises = Object.keys(data).map(function(crop) {
				const cropModel = new Crop({
					name: data[crop].name,
					display_name: data[crop].display_name,
					alternate_name: '',
					compaions: []
				});
				console.log('Saving crop: ' + data[crop].name);
				return cropModel.save();
			});
			Promise.all(promises).then(resolve);
		});
	});
}

export default migrateCrops;
