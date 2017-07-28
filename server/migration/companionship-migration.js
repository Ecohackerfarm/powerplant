import Companionship from '../models/companionship';
import Crop from '../models/crop';
import firebase from 'firebase';

/**
 * Migrate the companionships from the Firebase database to the local mongodb database
 * Requires that all the crops be done migrating first
 * @return {None}
 */
function migrateCompanionships() {
  return new Promise((resolve) => {
  // Delete all previous entries
    Companionship.find({}).remove().exec();


    const search = firebase.database().ref('/').once('value');
    search.then((snapshot) => {
      const data = snapshot.val();
      const companionships = data.companions;
      const crops = data.plants;

      // we need to replace all the firebase keys with mongodb keys otherwise it's a huge pain
      // to do this we will create a map from firebase keys to mongodb keys
      const fbToMongo = {};
      const fbIds = Object.keys(crops);
      const promises = fbIds.map((id) => {
        return Crop.findOne({name: crops[id].name}).exec();
      });
      Promise.all(promises).then((data) => {
        // now data holds a list of all the crops IN THE SAME ORDER AS fbIds
        const mongoIds = data.map((crop) => {
          return crop._id;
        });
        for (let i=0; i<mongoIds.length; i++) {
          fbToMongo[fbIds[i]] = mongoIds[i];
        }

        // now we have a map from firebase ids to mongo ids
        // need to add each companionshipship in firebase to mongo
        const savePromises = [];
        for (let crop1 in companionships) {
          for (let crop2 in companionships[crop1]) {
            const compatibility = companionships[crop1][crop2] === "good"?1:-1;
            savePromises.push(new Companionship({crop1: fbToMongo[crop1], crop2: fbToMongo[crop2], compatibility: compatibility}).save());
            console.log(crop1 + " and " + crop2 + " are " + compatibility);
            // want to make sure it doesn't get added twice
            delete companionships[crop2][crop1];
          }
        }
        Promise.all(savePromises).then((companionships) => {
          const cropPromises = [];
          console.log("Saved all companionships...starting to save references in Crops");
          companionships.forEach((companionship) => {
            // save reference to companionship in each of the crops
            cropPromises.push(Crop.findByIdAndUpdate(
              companionship.crop1,
              {$push: {companionships: companionship}}
            ));
            if (!companionship.crop1.equals(companionship.crop2)) {
              cropPromises.push(Crop.findByIdAndUpdate(
                companionship.crop2,
                {$push: {companionships: companionship}}
              ));
            }
          });
          Promise.all(cropPromises).then(resolve);
        });
      });
    });
  });
}

export default migrateCompanionships;
