#### Database structure

The database structure follows a relatively straightforward hierarchy:

```
    +------------------------------------+
    |      User                          |
    +------------------------------------+
    |       _id:ObjectId                 |
    |  username:String                   |
    |  password:String                   |
    | locations:[ObjectId(ref:Location)] |
    |                                    |
    +n------------^----------------------+
     |            |
     |            |
     |          user
    locations     |
     |            |
     |            |
    +v------------1+---------------+
    |     Location                 |
    +------------------------------+
    |   _id:ObjectId               |
    |  beds:[Bed]                  |
    |   loc:{coordinates:[Number], |
    |         address:String}      |
    |  user:ObjectId(ref:User)     |
    |                              |
    +----n--------------^----------+
         |              |
       beds          location
         |              |
    +----v--------------1-----------------+
    |          Bed                        |
    +-------------------------------------+
    |          _id:ObjectId               |
    | active_crops:[ObjectId(ref:Crop)]   |
    |   past_crops:[ObjectId(ref:Crop)]   |
    |    soil_type:Enum                   |
    |     location:ObjectId(ref:Location) |
    |                                     |
    |                                     |
    +-----n------------^------------------+
          |            |
       active_crops    |
       past_crops     bed
          |            |
    +-----v------------1----------------------+
    |     Crop                                |
    +-----------------------------------------+
    |       _id:ObjectId                      |
    |  bed:ObjectId(ref:Bed)                  |
    |  crop_info:ObjectId(ref:CropInformation)|
    |  planted_indoors:Date                   |
    |  planted_in_bed:Date                    |
    |  predicted_transplant:Date              |
    |  predicted_harVest:Date                 |
    +-----------------------------------------+
```

#### Database structure completion/redesign proposal

This section is used for planning and developing changes/additions to the
database structure. Once the new structure has been agreed upon and adopted,
move it to the "Database structure" section above.

- Having both User.locations (array of references to Location documents) and
  Location.user_id makes the operation of creating a new location non-atomic
  because both the User and the Location document have to be saved to the
  database. If one of these two operations fail then the database would be left
  to an inconsistent state. Mongoose doesn't have transactions so non-atomic
  updates must be handled manually. This may be solved either by having only
  the reference to the parent document (Location.user_id) or by embedding the
  Location documents to the User document. If we have only Location.user_id
  then the Location documents of a User can be found by
  LocationModel.find({ user_id: User._id });
  - Location should have a parent reference to User because multiple users may
    work on the same location.
  - Location should embed Garden and Garden should embed Bed documents because
    their physical location is static.
  - CropInstance documents should not be embedded to Bed because crops may be
    transplanted.
  - CropObservation documents should be embedded to CropInstance because they
    are specific to one physical instance of a crop.
  - Mongoose generates IDs also for embedded documents (subdocuments). Good for
    accessing them directly.
- Observation is the base model for all observations and actions. It contains
  the date of the observation/action, and a human-readable description field.
  - PlantOrganismObservation document is used to log changes in the development
    of a crop, like phenological events and diseases.
    - The property "growth_stage" can be used to log phenological events and it
      should be compatible with the BBCH scale.
    - The property "damage_type" is the type of the damage that has occurred to
      the plant. Damage can be a nutritional deficiency, a bacterial disease,
      a physical damage done by insects or animals, etc.
    - FUTURE-TODO: It should be possible to provide photos. For example when
      the user doesn't know the reason/name for a disease, they could somehow
      share the observation and get help from other users.
  - WeatherObservation document is used for temperature and precipitation
    observations, and it has geographic coordinates for the location.
    - Probably there are web services that provide both current and historical
      weather data. Information could be combined from multiple services.
  - Combination of CropObservation and WeatherObservation data can be used to
    predict growing seasons and harvest dates. Growing degree days (GDD) can be
    used to predict harvest dates for a crop in different locations.
    - All garden data should be open in the sense that it may be used to compute
      impersonal results such as the global average of how many GDDs it takes to
      grow a crop.
  - LocationObservation document is used to log which insects (organisms) are
    known to live in the environment. It is needed for selecting good companion
    plants. For now this data could be hard-coded for a couple of different
    environments.
- Companionship/CompanionshipMechanism document specifies how well a set of
  crops that are planted in close proximity work together to fulfill a specific
  goal (CompanionshipMechanism.type) that helps all of the crops to strive.
  - The property "type" has one of the following values: "attract insect",
    "mycorrhizal", "climbing support". TODO: Specify more companionship types.
  - The property "compatibility" specifies how well the set of crops work
    together. Combination of "type" and "compatibility" allows the program to
    make intelligent suggestions especially when there are more than two plants
    in a bed.
  - The property "description" is a human-readable description of the
    companionship mechanism that is specific to the given set of crops.
  - TODO: When it is needed, change to set of crops instead of just two.
  - The program can also determine companion plants by analyzing the
    observation/action/harvest data.
- Bed.environment_type can be used to specify if the bed is in greenhouse or
  if it is outside in the garden.
- Organism is the base model for all organisms (crops, insects). It specifies
  the name of the organism, its functional properties, and its foods (list of
  other organisms).
  - Internally the functional properties are arranged in a tree structure,
    allowing the program to select organisms from a more specific/generic
    functional group.
  - PlantOrganism document is used to specify the innate properties of a crop,
    in contrast to the PlantOrganismObservation document that is used to log
    events that are specific to a particular environment.
    - Tag "mycorrhizal" specifies that the plant is able to form mycorrhizal
      associations. Most plants are mycorrhizal, and all mycorrhizal plants
      are also companion plants because the fungi can connect with multiple
      plants. The Companionship document is still needed to specify how
      "compatible" the two plants are for forming a mycorrhizal network.
      - The program could suggest how to treat beds without digging, to plant
        some trees, and how to do mycorrhizal inoculation.
    - Tag "climbing" specifies that the plant is able to use support structures
      to climb on. It can be used to detect which plant is the climber in a
      companionship.
    - The property "average_length" gives an indication of the height/length of
      the plant in meters. It can be used to suggest companions for climbers.
  - Create an Organism document for humans that can be used to determine the
    edible plant products.
- TODO: Build a sketch database with all the needed features.

```
const referenceSchema = new Schema({
  title: { type: String },
  author: { type: String },
  year: { type: Number },
  url: { type: String },
  url_visited: { type: Date },
});

const userSchema = new Schema({
	username: { type: String },
	email: { type: String },
	password: { type: String },
});

const observationSchema = new Schema({
	date: { type: Date },
	description: { type: String },
});

const plantOrganismObservationSchema = observationSchema.discriminator('PlantOrganismObservation', new Schema({
	growth_stage: { type: String },
	damage_type: { type: String },
});

const locationObservationSchema = observationSchema.discriminator('LocationObservation', new Schema({
	organism_id: { type: ObjectId, ref: 'Organism' },
});

const organismInstanceSchema = new Schema({
	organism_id: { type: ObjectId, ref: 'PlantOrganism' },
	observations: [plantOrganismObservationSchema],
});

const bedSchema = new Schema({
	name: { type: String },
	environment_type: { type: String },
	soil_type: { type: String },
});

const gardenSchema = new Schema({
	name: { type: String },
	beds: [bedSchema],
});

const geoJsonPointSchema = new Schema({
	type: { type: String, default: 'Point' },
	coordinates: { type: [Number] }
});

const locationSchema = new Schema({
	user_id: { type: ObjectId, ref: 'User' },
	name: { type: String },
	address: { type: String },
	coordinates: geoJsonPointSchema,
	gardens: [gardenSchema],
	observations: [locationObservationSchema]
	actions: [plantOrganismActionSchema]
});

const organismSchema = new Schema({
  common_name: { type: String },
  binomial_name: { type: String },
  functions: { type: [String] },
  foods: { type: [ObjectId], ref: 'Organism' },
});

const plantOrganismSchema = organismSchema.discriminator('PlantOrganism', new Schema({
	variety_name: { type: String },
	average_length: { type: Number },
});

const companionshipMechanismSchema = new Schema({
	description: { type: String },
	type: { type: String },
	compatibility: { type: Number },
	references: { type: [String] }
});

const attractInsectCompanionshipMechanismSchema = companionshipMechanismSchema.discriminator('AttractInsectCompanionshipMechanism', new Schema({
  insect: { type: ObjectId, ref: 'Organism' },
});

const companionshipSchema = new Schema({
	crop1_id: { type: ObjectId, ref: 'PlantOrganism' },
	crop2_id: { type: ObjectId, ref: 'PlantOrganism' },
	companionship_mechanisms: [companionshipMechanismSchema]
});

const weatherObservationSchema = observationSchema.discriminator('WeatherObservation', new Schema({
	coordinates: geoJsonPointSchema,
	maximum_temperature: { type: Number },
	minimum_temperature: { type: Number },
	precipitation: { type: Number },
});

const plantOrganismActionSchema = observationSchema.discriminator('PlantOrganismAction', new Schema({
	plant_organism_id: { type: ObjectId, ref: 'PlantOrganism' },
});

const transplantActionSchema = plantOrganismActionSchema.discriminator('TransplantAction', new Schema({
	source_bed_id: { type: ObjectId, ref: 'Bed' },
	destination_bed_id: { type: ObjectId, ref: 'Bed' },
});

const productSchema = new Schema({
	type: { type: String },
	amount: { type: Number },
	unit: { type: String }
});

const harvestActionSchema = plantOrganismActionSchema.discriminator('HarvestAction', new Schema({
	products: [productSchema],
});
```

```
attractColeomegillaMaculataByGlandularHairReference = {
	title: "Selection and Evaluation of a Companion Plant to Indirectly Augment Densities of Coleomegilla maculata (Coleoptera: Coccinellidae) in Sweet Corn",
	author: null,
	year: null,
	url: null,
	url_visited: null,
	journal: null,
	volume: null,
};

attractColeomegillaMaculataByDandelionReference = {
	title: "Coleomegilla maculata (Coleoptera: Coccinellidae) Predation on Pea Aphids Promoted by Proximity to Dandelions",
	author: null,
	year: null,
	url: null,
	url_visited: null,
};

attractMicroplitisMediatorByBuckwheatReference = {
	title: "Biodiversity enhancement and utilization - Pest control in brassicas",
	author: null,
	year: null,
	url: null,
	url_visited: null,
};

genericMycorrhizaReference = {
	title: "Mycorrhizal Associations",
	author: null,
	year: null,
	url: "https://mycorrhizas.info/",
	url_visited: null,
};

corn = {
  name: "Corn",
  binomial_name: "Zea mays",
  functions: ["mycorrhizal"],
  average_length: 3.00,
};

tomato = {
  name: "Tomato",
  binomial_name: "Solanum lycopersicum",
  functions: ["glandular hair", "mycorrhizal"],
};

ornamentalTobacco = {
  name: "Ornamental tobacco",
  binomial_name: "Nicotiana alata",
  functions: ["glandular hair", "mycorrhizal"]
};

alfalfa = {
  name: "Alfalfa",
  binomial_name: "Medicago sativa",
  functions: ["mycorrhizal"]
};

dandelion = {
  name: "Dandelion",
  binomial_name: "Taraxacum officinale",
  functions: ["mycorrhizal"]
};

onion = {
  name: "Onion",
  binomial_name: "Allium cepa",
  functions: ["mycorrhizal"]
};

buckwheat = {
  name: "Buckwheat",
  binomial_name: "Fagopyrum esculentum",
  functions: ["nectar"]
};

cornflower = {
  name: "Cornflower",
  binomial_name: "Centaurea cyanus",
  functions: ["nectar", "mycorrhizal"]
};

vetch = {
  name: "Vetch",
  binomial_name: "Vicia sativa",
  functions: ["nectar", "nitrogen fixation", "nitrogen fixation by Rhizobia", "mycorrhizal"]
};

cabbage = {
  name: "Cabbage",
  binomial_name: "Brassica oleracea",
  functions: ["cabbage"]
};

pea = {
  name: "Pea",
  binomial_name: "Pisum sativum",
  functions: ["legume", "nitrogen fixation", "nitrogen fixation by Rhizobia", "mycorrhizal", "climbing"],
  average_length: 1.00,
};

commonBean = {
  name: "Common bean",
  binomial_name: "Phaseolus vulgaris",
  functions: ["legume", "nitrogen fixation", "nitrogen fixation by Rhizobia", "mycorrhizal", "climbing"]
};

alder = {
  name: "Alder",
  binomial_name: "Alnus glutinosa",
  functions: ["nitrogen fixation", "nitrogen fixation by Frankia", "mycorrhizal"]
};

squash = {
  name: "Squash",
  binomial_name: "Cucurbita pepo",
  functions: ["squash", "mycorrhizal"]
};

helicoverpaZea = {
  common_name: "",
  binomial_name: "Helicoverpa zea",
  functions: [],
  foods: [corn]
};

coleomegillaMaculata = {
  common_name: "Spotted ladybug beetle",
  binomial_name: "Coleomegilla maculata",
  functions: [],
  foods: [helicoverpaZea]
};

cornAndTomato = {
  crop1_id: corn,
  crop2_id: tomato,
  companionship_mechanisms: [
    {
      description: "Tomato attracts Coleomegilla maculata which feeds on Helicoverpa zea" 
                 + " and therefore prevents H. zea to feed on corn. C. maculata prefers" 
                 + " to lay eggs in general on plants that have glandular hair and in" 
                 + " particular on tomato.",
      type: "attract insect",
      compatibility: 2,
      references: [attractColeomegillaMaculataByGlandularHairReference]
    }
  ]
};

cornAndOrnamentalTobacco = {
  crop1_id: corn,
  crop2_id: ornamentalTobacco,
  companionship_mechanisms: [
    {
      description: "Ornamental tobacco attracts Coleomegilla maculata which feeds on" 
                 + " Helicoverpa zea and therefore prevents H. zea to feed on corn." 
                 + " C. maculata prefers to lay eggs in general on plants that have" 
                 + " glandular hair and in particular on ornamental tobacco.",
      type: "attract insect",
      compatibility: 3,
      references: [attractColeomegillaMaculataByGlandularHairReference]
    },
    {
      description: "Corn and ornamental tobacco are both mycorrhizal.",
      type: "mycorrhizal",
      compatibility: 3,
      references: [genericMycorrhizaReference]
    }
  ]
};

cornAndCommonBean = {
  crop1_id: corn,
  crop2_id: commonBean,
  companionship_mechanisms: [
    {
      description: "Corn provides support for the common bean to climb on. Native"
                 + " americans used the Three Sisters method: corn, bean and"
                 + " squash planted together.",
      type: "climbing support",
      compatibility: 3,
      references: []
    },
    {
      description: "Corn and common bean are both mycorrhizal.",
      type: "mycorrhizal",
      compatibility: 3,
      references: [genericMycorrhizaReference]
    }
  ]
};

alfalfaAndDandelion = {
  crop1_id: alfalfa,
  crop2_id: dandelion,
  companionship_mechanisms: [
    {
      description: "Dandelion attracts Coleomegilla maculata which feeds on Acyrthosiphon" 
                 + " pisum and therefore prevents A. pisum to feed on alfalfa. C. maculata" 
                 + " might be attracted to the pollen of dandelion.",
      type: "attract insect",
      compatibility: 3,
      references: [attractColeomegillaMaculataByDandelionReference]
    },
    {
      description: "Alfalfa and dandelion are both mycorrhizal.",
      type: "mycorrhizal",
      compatibility: 3,
      references: [genericMycorrhizaReference]
    },
  ]
};

cabbageAndBuckwheat = {
  crop1_id: cabbage,
  crop2_id: buckwheat,
  companionship_mechanisms: [
    {
      description: "Buckwheat, especially its nectar, attracts Microplitis mediator"
                 + " which also feeds on Mamestra brassicae and therefore prevents"
                 + " M. brassicae to feed on cabbage.",
      type: "attract insect",
      compatibility: 3,
      references: [attractMicroplitisMediatorByBuckwheatReference]
    }
  ]
};

organismFunctions = {
	key: null,
	value: null,
	children: [
		{ key: 'glandular hair', value: [tomato, ornamentalTobacco], children: [] },
		{ key: 'mycorrhizal', value: [corn, tomato, ornamentalTobacco], children: [] },
		{ key: 'nitrogen fixation', value: null, children: [
			{ key: 'nitrogen fixation by Rhizobia', value: [pea, commonBean, vetch], children: [] },
			{ key: 'nitrogen fixation by Frankia', value: [alder], children: [] },
		] },
	]
};

companionshipMechanismTypes = {
	key: null,
	value: null,
	children: [
		{ key: 'mycorrhizal', value: null, children: [] },
		{ key: 'climbing support', value: null, children: [] },
		{ key: 'attract insect', value: null, children: [] },
	]
};
```
