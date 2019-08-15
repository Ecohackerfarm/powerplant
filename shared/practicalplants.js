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
  PP_FAMILY_VALUES: ['acanthaceae','aceraceae','actinidiaceae','agavaceae','aizoaceae','alangiaceae','alismataceae','alliaceae','aloeaceae','alstroemeriaceae','amaranthaceae','amaryllidaceae','anacardiaceae','annonaceae','apocynaceae','aponogetonaceae','aquifoliaceae','araceae','araliaceae','araucariaceae','aristolochiaceae','asclepiadaceae','asparagaceae','asphodelaceae','asteliaceae','asteraceae','atherospermataceae','balsaminaceae','basellaceae','begoniaceae','berberidaceae','betulaceae','bignoniaceae','blechnaceae','boraginaceae','brassicaceae','bromeliaceae','buddleiaceae','burseraceae','butomaceae','buxaceae','cabombaceae','cactaceae','callitrichaceae','calochortaceae','calycanthaceae','calyceraceae','campanulaceae','cannabidaceae','cannaceae','capparidaceae','caprifoliaceae','caryophyllaceae','casuarinaceae','celastraceae','cephalotaxaceae','ceratophyllaceae','cercidiphyllaceae','chenopodiaceae','chloranthaceae','cistaceae','clethraceae','cneoraceae','colchicaceae','commelinaceae','compositae','convallariaceae','convolvulaceae','coriariaceae','cornaceae','corynocarpaceae','crassulaceae','cucurbitaceae','cunoniaceae','cupressaceae','cyatheaceae','cycadaceae','cynocrambaceae','cyperaceae','cyrillaceae','daphniphyllaceae','datiscaceae','diapensiaceae','dicksoniaceae','dioscoreaceae','dipsacaceae','droseraceae','dryopteridaceae','ebenaceae','ehretiaceae','elaeagnaceae','elaeocarpaceae','empetraceae','epacridaceae','ephedraceae','equisetaceae','ericaceae','eriocaulaceae','escalloniaceae','eucommiaceae','eucryphiaceae','euphorbiaceae','eupomatiaceae','eupteleaceae','euryalaceae','fagaceae','flacourtiaceae','fumariaceae','funkiaceae','garryaceae','gentianaceae','geraniaceae','gesneriaceae','ginkgoaceae','gleicheniaceae','globulariaceae','goodeniaceae','gramineae','grossulariaceae','gunneraceae','haemodoraceae','haloragidaceae','hamamelidaceae','hemerocallidaceae','hippocastanaceae','hippuridaceae','hyacinthaceae','hydrangeaceae','hydrocharitaceae','hydrophyllaceae','hypericaceae','hypoxidaceae','illiciaceae','iridaceae','juglandaceae','juncaceae','juncaginaceae','labiatae','lamiaceae','lardizabalaceae','lauraceae','leguminosae','leitneriaceae','lemnaceae','lentibulariaceae','liliaceae','limnanthaceae','linaceae','loasaceae','loganiaceae','lomandraceae','loranthaceae','lycopodiaceae','lythraceae','magnoliaceae','malpighiaceae','malvaceae','marrattiaceae','marsileaceae','martyniaceae','melanthiaceae','melastomataceae','meliaceae','melianthaceae','menispermaceae','menyanthaceae','misodendraceae','molluginaceae','monimiaceae','moraceae','morinaceae','musaceae','myoporaceae','myricaceae','myrsinaceae','myrtaceae','najadaceae','nelumbonaceae','nyctaginaceae','nymphaeaceae','nyssaceae','oenotheraceae','oleaceae','onagraceae','onocleaceae','ophioglossaceae','orchidaceae','orobanchaceae','osmundaceae','oxalidaceae','paeoniaceae','palmae','papaveraceae','parmeliaceae','parnassiaceae','passifloraceae','pedaliaceae','philesiaceae','phormiaceae','phrymaceae','phytolaccaceae','pinaceae','pistaciaceae','pittosporaceae','plantaginaceae','platanaceae','plumbaginaceae','podocarpaceae','podophyllaceae','polemoniaceae','polygalaceae','polygonaceae','polypodiaceae','polytrichaceae','pontederiaceae','portulacaceae','potamogetonaceae','primulaceae','proteaceae','pteridaceae','punicaceae','pyrolaceae','rafflesiaceae','ranunculaceae','resedaceae','restoniaceae','rhamnaceae','rosaceae','rubiaceae','ruscaceae','rutaceae','salicaceae','santalaceae','sapindaceae','sapotaceae','sargentodoxaceae','sarraceniaceae','saururaceae','saxifragaceae','schisandraceae','sciadoptyaceae','scrophulariaceae','selaginellaceae','simaroubaceae','smilacaceae','solanaceae','sparganiaceae','sphagnaceae','staphyleaceae','sterculiaceae','styracaceae','symplocaceae','tamaricaceae','taxaceae','taxodiaceae','tecophilaeaceae','theaceae','thelypteridaceae','thymelaeaceae','tiliaceae','trapaceae','tricyrtidaceae','trilliaceae','tropaeolaceae','turneraceae','typhaceae','ulmaceae','umbelliferae','urticaceae','uvulariaceae','valerianaceae','verbenaceae','violaceae','viscaceae','vitaceae','winteraceae','xanthorrhoeaceae','xyridaceae','zannichelliaceae','zingiberaceae','zosteraceae','zygophyllaceae']
};
