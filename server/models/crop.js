import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
// import idExists from 'mongoose-idexists';

/**
 * This is all going to get overhauled eventually when integration with openfarm.cc happens...
 * (or sooner, but I don't have time)
 * @constructor
 * @alias Crop
 * @param {Object} crop
 * @param {String} crop.name internal name
 * @param {String} crop.display_name display name 1
 * @param {String} [crop.alternate_display] display name 2
 * @param {(ObjectId[]|server.models.Companionship[])} companionships all companionships involving this crop
 * @param {}
 */
const cropSchema = new Schema({
	name: { type: String, index: true, required: true },
	display_name: { type: String, required: true },
	alternate_display: String,
	companionships: [{ type: ObjectId, ref: 'Companionship' }],
	preferred_soil: String,
	preferred_climate: String
});

/**
 * Custom mongoose query to find a Crop by its name (name, not display name or alternate display). Could be changed in the future
 * @alias byName
 * @memberof server.models.Crop
 * @static
 * @example
 * // find all crops matching "bean"
 * Crop.find().byName("bean").exec((err, results) => {
 *   // do something with results
 * })
 * @param  {String} name [description]
 * @return {Mongoose.Query}      [description]
 */
cropSchema.query.byName = function(name) {
	const regex = new RegExp(name, 'i');
	return this.find({ name: regex });
};

const Crop = mongoose.model('Crop', cropSchema);
export default Crop;
