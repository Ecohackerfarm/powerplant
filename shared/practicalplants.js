/**
 * practicalplants.org definitions that are shared between client and server.
 *
 * @namespace practicalplants
 * @memberof shared
 */

module.exports = {
  PP_BOOLEAN_VALUES: ['false', 'true'],
  PP_HARDINESS_ZONE_VALUES: 12,
  PP_SOIL_TEXTURE_VALUES: ['sandy', 'loamy', 'clay', 'heavy clay'],
  PP_SOIL_PH_VALUES: [
    'very acid',
    'acid',
    'neutral',
    'alkaline',
    'very alkaline'
  ],
  PP_SOIL_WATER_RETENTION_VALUES: ['well drained', 'moist', 'wet'],
  PP_SHADE_VALUES: [
    'no shade',
    'light shade',
    'partial shade',
    'permanent shade',
    'permanent deep shade'
  ],
  PP_SUN_VALUES: ['indirect sun', 'partial sun', 'full sun'],
  PP_WATER_VALUES: ['low', 'moderate', 'high', 'aquatic'],
  PP_DROUGHT_VALUES: ['dependent', 'tolerant', 'intolerant'],
  PP_ECOSYSTEM_NICHE_VALUES: [
    'canopy',
    'climber',
    'secondary canopy',
    'soil surface',
    'shrub',
    'herbaceous',
    'rhizosphere'
  ],
  PP_LIFE_CYCLE_VALUES: ['perennial', 'annual', 'biennial'],
  PP_HERBACEOUS_OR_WOODY_VALUES: ['herbaceous', 'woody'],
  PP_DECIDUOUS_OR_EVERGREEN_VALUES: ['deciduous', 'evergreen'],
  PP_GROWTH_RATE_VALUES: ['slow', 'moderate', 'vigorous'],
  PP_MATURE_MEASUREMENT_UNIT_VALUES: ['meters', 'feet'],
  PP_MATURE_HEIGHT_VALUES: 110,
  PP_MATURE_WIDTH_VALUES: 30,
  PP_FLOWER_TYPE_VALUES: ['hermaphrodite', 'monoecious', 'dioecious'],
  PP_POLLINATORS_VALUES: [
    'insects',
    'wind',
    'bees',
    'flies',
    'self',
    'beetles',
    'lepidoptera',
    'bats',
    'moths',
    'birds',
    'apomictic',
    'slugs',
    'snails',
    'hoverflies',
    'cleistogamous',
    'wasps',
    'water',
    'midges',
    'diptera',
    'butterflies',
    'apomixy',
    'bumblebees',
    'wind-blown sand',
    'sunbirds',
    'carrion flies',
    'hand',
    'dryoptera',
    'hymenoptera'
  ],
  PP_FUNCTIONS_VALUES: [
    'nitrogen fixer',
    'ground cover',
    'hedge',
    'windbreak',
    'pioneer',
    'earth stabiliser',
    'green manure',
    'repellant',
    'soil builder',
    'rootstock',
    'biogenic decalcifier',
    'phytoremediation',
    'bee attractor',
    'soil conditioner',
    'pest repellent'
  ],
  PP_GROW_FROM_VALUES: [
    'seed',
    'cutting',
    'layering',
    'tuber',
    'suckers',
    'graft',
    'bulb'
  ],
  PP_CUTTING_TYPE_VALUES: ['semi-ripe', 'soft wood', 'root', 'hard wood'],
  PP_FERTILITY_VALUES: ['self fertile', 'self sterile'],
  PP_ROOT_ZONE_VALUES: ['shallow', 'deep', 'surface'],
  PP_FAMILY_VALUES: ['Acanthaceae','Aceraceae','Actinidiaceae','Agavaceae','Aizoaceae','Alangiaceae','Alismataceae','Alliaceae','Aloeaceae','Alstroemeriaceae','Amaranthaceae','Amaryllidaceae','Anacardiaceae','Annonaceae','Apocynaceae','Aponogetonaceae','Aquifoliaceae','Araceae','Araliaceae','Araucariaceae','Aristolochiaceae','Asclepiadaceae','Asparagaceae','Asphodelaceae','Asteliaceae','Asteraceae','Atherospermataceae','Balsaminaceae','Basellaceae','Begoniaceae','Berberidaceae','Betulaceae','Bignoniaceae','Blechnaceae','Boraginaceae','Brassicaceae','Bromeliaceae','Buddleiaceae','Burseraceae','Butomaceae','Buxaceae','Cabombaceae','Cactaceae','Callitrichaceae','Calochortaceae','Calycanthaceae','Calyceraceae','Campanulaceae','Cannabidaceae','Cannaceae','Capparidaceae','Caprifoliaceae','Caryophyllaceae','Casuarinaceae','Celastraceae','Cephalotaxaceae','Ceratophyllaceae','Cercidiphyllaceae','Chenopodiaceae','Chloranthaceae','Cistaceae','Clethraceae','Cneoraceae','Colchicaceae','Commelinaceae','Compositae','Convallariaceae','Convolvulaceae','Coriariaceae','Cornaceae','Corynocarpaceae','Crassulaceae','Cucurbitaceae','Cunoniaceae','Cupressaceae','Cyatheaceae','Cycadaceae','Cynocrambaceae','Cyperaceae','Cyrillaceae','Daphniphyllaceae','Datiscaceae','Diapensiaceae','Dicksoniaceae','Dioscoreaceae','Dipsacaceae','Droseraceae','Dryopteridaceae','Ebenaceae','Ehretiaceae','Elaeagnaceae','Elaeocarpaceae','Empetraceae','Epacridaceae','Ephedraceae','Equisetaceae','Ericaceae','Eriocaulaceae','Escalloniaceae','Eucommiaceae','Eucryphiaceae','Euphorbiaceae','Eupomatiaceae','Eupteleaceae','Euryalaceae','Fagaceae','Flacourtiaceae','Fumariaceae','Funkiaceae','Garryaceae','Gentianaceae','Geraniaceae','Gesneriaceae','Ginkgoaceae','Gleicheniaceae','Globulariaceae','Goodeniaceae','Gramineae','Grossulariaceae','Gunneraceae','Haemodoraceae','Haloragidaceae','Hamamelidaceae','Hemerocallidaceae','Hippocastanaceae','Hippuridaceae','Hyacinthaceae','Hydrangeaceae','Hydrocharitaceae','Hydrophyllaceae','Hypericaceae','Hypoxidaceae','Illiciaceae','Iridaceae','Juglandaceae','Juncaceae','Juncaginaceae','Labiatae','Lamiaceae','Lardizabalaceae','Lauraceae','Leguminosae','Leitneriaceae','Lemnaceae','Lentibulariaceae','Liliaceae','Limnanthaceae','Linaceae','Loasaceae','Loganiaceae','Lomandraceae','Loranthaceae','Lycopodiaceae','Lythraceae','Magnoliaceae','Malpighiaceae','Malvaceae','Marrattiaceae','Marsileaceae','Martyniaceae','Melanthiaceae','Melastomataceae','Meliaceae','Melianthaceae','Menispermaceae','Menyanthaceae','Misodendraceae','Molluginaceae','Monimiaceae','Moraceae','Morinaceae','Musaceae','Myoporaceae','Myricaceae','Myrsinaceae','Myrtaceae','Najadaceae','Nelumbonaceae','Nyctaginaceae','Nymphaeaceae','Nyssaceae','Oenotheraceae','Oleaceae','Onagraceae','Onocleaceae','Ophioglossaceae','Orchidaceae','Orobanchaceae','Osmundaceae','Oxalidaceae','Paeoniaceae','Palmae','Papaveraceae','Parmeliaceae','Parnassiaceae','Passifloraceae','Pedaliaceae','Philesiaceae','Phormiaceae','Phrymaceae','Phytolaccaceae','Pinaceae','Pistaciaceae','Pittosporaceae','Plantaginaceae','Platanaceae','Plumbaginaceae','Podocarpaceae','Podophyllaceae','Polemoniaceae','Polygalaceae','Polygonaceae','Polypodiaceae','Polytrichaceae','Pontederiaceae','Portulacaceae','Potamogetonaceae','Primulaceae','Proteaceae','Pteridaceae','Punicaceae','Pyrolaceae','Rafflesiaceae','Ranunculaceae','Resedaceae','Restoniaceae','Rhamnaceae','Rosaceae','Rubiaceae','Ruscaceae','Rutaceae','Salicaceae','Santalaceae','Sapindaceae','Sapotaceae','Sargentodoxaceae','Sarraceniaceae','Saururaceae','Saxifragaceae','Schisandraceae','Sciadoptyaceae','Scrophulariaceae','Selaginellaceae','Simaroubaceae','Smilacaceae','Solanaceae','Sparganiaceae','Sphagnaceae','Staphyleaceae','Sterculiaceae','Styracaceae','Symplocaceae','Tamaricaceae','Taxaceae','Taxodiaceae','Tecophilaeaceae','Theaceae','Thelypteridaceae','Thymelaeaceae','Tiliaceae','Trapaceae','Tricyrtidaceae','Trilliaceae','Tropaeolaceae','Turneraceae','Typhaceae','Ulmaceae','Umbelliferae','Urticaceae','Uvulariaceae','Valerianaceae','Verbenaceae','Violaceae','Viscaceae','Vitaceae','Winteraceae','Xanthorrhoeaceae','Xyridaceae','Zannichelliaceae','Zingiberaceae','Zosteraceae','Zygophyllaceae']
};
