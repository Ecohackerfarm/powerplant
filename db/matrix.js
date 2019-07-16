/**
 * Companion plant matrix
 *
 * @namespace matrix
 * @memberof db
 */

/**
 * Used internally to add entries to the list of companions.
 *
 * @param {String} plant0
 * @param {String} plant1
 * @param {Number} companion 0 for incompatible, 1 for companion
 */
function add(plant0, plant1, companion) {
  if (plant0 == plant1) {
    console.log('companions.js: plant is always companion with itself');
    return;
  }

  addPlant(plant0);
  addPlant(plant1);

  if (getCompanionValue(plant0, plant1) !== undefined) {
    console.log(
      'companions.js: duplicate companion entry ' + plant0 + ', ' + plant1
    );
  } else {
    companions.push({
      plant0: plant0,
      plant1: plant1,
      companion: companion
    });
  }
}

/**
 * Get companionship value of two plants.
 *
 * @param {String} plant0
 * @param {String} plant1
 * @return {Number} 0 for incompatible, 1 for companion, undefined for neutral.
 */
function getCompanionValue(plant0, plant1) {
  if (!plants.includes(plant0) || !plants.includes(plant1)) {
    return undefined;
  }
  if (plant0 == plant1) {
    return 1;
  }

  let value = getCompanionValueWithExactOrder(plant0, plant1);
  if (value === undefined) {
    value = getCompanionValueWithExactOrder(plant1, plant0);
  }
  return value;
}

/**
 * Helper for getting a companionship value.
 *
 * @param {String} plant0
 * @param {String} plant1
 * @return {Number}
 */
function getCompanionValueWithExactOrder(plant0, plant1) {
  let entry = companions.find(
    entry => entry.plant0 == plant0 && entry.plant1 == plant1
  );
  return entry ? entry.companion : entry;
}

/**
 * Helper for adding entries.
 *
 * @param {String} plant
 */
function addPlant(plant) {
  if (!plants.includes(plant)) {
    plants.push(plant);
  }
}

let plants = [];
let companions = [];

add('Allium cepa', 'Petroselinum crispum', 1);
add('Allium cepa', 'Pastinaca sativa', 1);
add('Allium cepa', 'Pisum sativum', 0);
add('Allium cepa', 'Rosa sericea', 1);
add('Allium cepa', 'Beta vulgaris cicla', 1);
add('Allium cepa', 'Fragaria x ananassa', 1);
add('Allium cepa', 'Solanum esculentum', 1);
add('Allium porrum', 'Origanum majorana', 1);
add('Allium porrum', 'Allium cepa', 1);
add('Allium sativum', 'Lavandula angustifolia', 1);
add('Allium sativum', 'Pisum sativum', 0);
add('Allium sativum', 'Rosmarinus officinalis', 1);
add('Allium sativum', 'Rosa sericea', 1);
add('Allium sativum', 'Fragaria x ananassa', 0);
add('Allium sativum', 'Helianthus annuus', 0);
add('Allium schoenoprasum', 'Phaseolus vulgaris', 0);
add('Allium schoenoprasum', 'Origanum majorana', 1);
add('Allium schoenoprasum', 'Petroselinum crispum', 1);
add('Allium schoenoprasum', 'Pastinaca sativa', 1);
add('Allium schoenoprasum', 'Pisum sativum', 0);
add('Allium schoenoprasum', 'Rosa sericea', 1);
add('Allium schoenoprasum', 'Fragaria x ananassa', 1);
add('Allium schoenoprasum', 'Solanum esculentum', 1);
add('Anethum graveolens', 'Foeniculum vulgare', 1);
add('Anethum graveolens', 'Solanum esculentum', 1);
add('Anthriscus cerefolium', 'Coriandrum sativum', 1);
add('Anthriscus cerefolium', 'Anethum graveolens', 1);
add('Anthriscus cerefolium', 'Allium sativum', 1);
add('Anthriscus cerefolium', 'Lactuca sativa', 1);
add('Anthriscus cerefolium', 'Petroselinum crispum', 1);
add('Anthriscus cerefolium', 'Raphanus landra', 1);
add('Anthriscus cerefolium', 'Achillea millefolium', 1);
add('Apium graveolens dulce', 'Anethum graveolens', 1);
add('Apium graveolens dulce', 'Allium porrum', 1);
add('Apium graveolens dulce', 'Origanum majorana', 1);
add('Apium graveolens dulce', 'Pastinaca sativa', 0);
add('Apium graveolens dulce', 'Pisum sativum', 1);
add('Apium graveolens dulce', 'Solanum tuberosum', 0);
add('Apium graveolens dulce', 'Solanum esculentum', 1);
add('Armoracia rusticana', 'Solanum tuberosum', 1);
add('Armoracia rusticana', 'Rosa sericea', 1);
add('Asparagus officinalis', 'Ocimum basilicum', 1);
add('Asparagus officinalis', 'Allium schoenoprasum', 1);
add('Asparagus officinalis', 'Origanum majorana', 1);
add('Asparagus officinalis', 'Petroselinum crispum', 1);
add('Asparagus officinalis', 'Solanum esculentum', 1);
add('Beta vulgaris craca', 'Borago officinalis', 1);
add('Beta vulgaris craca', 'Brassica oleracea', 1);
add('Beta vulgaris craca', 'Phaseolus vulgaris', 0);
add('Beta vulgaris craca', 'Anethum graveolens', 1);
add('Beta vulgaris craca', 'Lactuca sativa', 1);
add('Beta vulgaris craca', 'Origanum majorana', 1);
add('Beta vulgaris craca', 'Allium cepa', 1);
add('Beta vulgaris craca', 'Solanum tuberosum', 1);
add('Beta vulgaris craca', 'Beta vulgaris cicla', 1);
add('Beta vulgaris craca', 'Solanum esculentum', 0);
add('Borago officinalis', 'Brassica oleracea', 1);
add('Borago officinalis', 'Cucumis sativus', 1);
add('Borago officinalis', 'Fragaria x ananassa', 1);
add('Borago officinalis', 'Tanacetum vulgare', 1);
add('Borago officinalis', 'Solanum esculentum', 1);
add('Brassica oleracea', 'Tropaeolum majus', 1);
add('Brassica oleracea', 'Phaseolus vulgaris', 1);
add('Brassica oleracea', 'Coriandrum sativum', 1);
add('Brassica oleracea', 'Cucumis sativus', 1);
add('Brassica oleracea', 'Anethum graveolens', 1);
add('Brassica oleracea', 'Calendula officinalis', 1);
add('Brassica oleracea', 'Origanum majorana', 1);
add('Brassica oleracea', 'Helianthus annuus', 1);
add('Brassica oleracea', 'Chamaemelum nobile', 1);
add('Brassica oleracea', 'Allium sativum', 0);
add('Brassica oleracea', 'Lavandula angustifolia', 1);
add('Brassica oleracea', 'Lactuca sativa', 1);
add('Brassica oleracea', 'Mentha spicata', 1);
add('Brassica oleracea', 'Allium cepa', 1);
add('Brassica oleracea', 'Pisum sativum', 1);
add('Brassica oleracea', 'Solanum tuberosum', 1);
add('Brassica oleracea', 'Rosmarinus officinalis', 1);
add('Brassica oleracea', 'Salvia officinalis', 1);
add('Brassica oleracea', 'Tanacetum vulgare', 1);
add('Brassica oleracea', 'Thymus vulgaris', 1);
add('Brassica oleracea', 'Apium graveolens dulce', 1);
add('Brassica oleracea', 'Ruta graveolens', 0);
add('Brassica oleracea', 'Solanum esculentum', 1);
add('Brassica oleracea', 'Fragaria x ananassa', 1);
add('Calendula officinalis', 'Solanum tuberosum', 1);
add('Calendula officinalis', 'Rubus idaeus', 1);
add('Calendula officinalis', 'Rosa sericea', 1);
add('Calendula officinalis', 'Fragaria x ananassa', 1);
add('Calendula officinalis', 'Solanum esculentum', 1);
add('Chamaemelum nobile', 'Mentha spicata', 0);
add('Citrus limon', 'Rosa sericea', 1);
add('Coriandrum sativum', 'Anethum graveolens', 1);
add('Coriandrum sativum', 'Foeniculum vulgare', 0);
add('Coriandrum sativum', 'Pastinaca sativa', 1);
add('Cucumis sativus', 'Anethum graveolens', 1);
add('Cucumis sativus', 'Lactuca sativa', 1);
add('Cucumis sativus', 'Origanum majorana', 1);
add('Cucumis sativus', 'Tropaeolum majus', 1);
add('Cucumis sativus', 'Pisum sativum', 1);
add('Cucumis sativus', 'Solanum tuberosum', 0);
add('Cucumis sativus', 'Raphanus landra', 1);
add('Cucumis sativus', 'Salvia officinalis', 0);
add('Cucumis sativus', 'Helianthus annuus', 1);
add('Cucumis sativus', 'Tanacetum vulgare', 1);
add('Daucus carota', 'Allium schoenoprasum', 1);
add('Daucus carota', 'Coriandrum sativum', 1);
add('Daucus carota', 'Cucumis sativus', 1);
add('Daucus carota', 'Anethum graveolens', 1);
add('Daucus carota', 'Malus domestica', 1);
add('Daucus carota', 'Allium porrum', 1);
add('Daucus carota', 'Lactuca sativa', 1);
add('Daucus carota', 'Calendula officinalis', 1);
add('Daucus carota', 'Origanum majorana', 1);
add('Daucus carota', 'Allium cepa', 1);
add('Daucus carota', 'Pastinaca sativa', 0);
add('Daucus carota', 'Pisum sativum', 1);
add('Daucus carota', 'Raphanus landra', 1);
add('Daucus carota', 'Rosmarinus officinalis', 1);
add('Daucus carota', 'Ruta graveolens', 1);
add('Daucus carota', 'Salvia officinalis', 1);
add('Daucus carota', 'Solanum esculentum', 1);
add('Foeniculum vulgare', 'Lavandula angustifolia', 0);
add('Foeniculum vulgare', 'Solanum esculentum', 0);
add('Lactuca sativa', 'Calendula officinalis', 1);
add('Lactuca sativa', 'Origanum majorana', 1);
add('Lactuca sativa', 'Allium cepa', 1);
add('Lactuca sativa', 'Petroselinum crispum', 0);
add('Lactuca sativa', 'Pastinaca sativa', 1);
add('Lactuca sativa', 'Pisum sativum', 1);
add('Lactuca sativa', 'Raphanus landra', 1);
add('Lactuca sativa', 'Fragaria x ananassa', 1);
add('Lavandula angustifolia', 'Origanum majorana', 1);
add('Lavandula angustifolia', 'Rosa sericea', 1);
add('Lavandula angustifolia', 'Beta vulgaris cicla', 1);
add('Lavandula angustifolia', 'Fragaria x ananassa', 1);
add('Malus domestica', 'Allium schoenoprasum', 1);
add('Malus domestica', 'Allium sativum', 1);
add('Malus domestica', 'Armoracia rusticana', 1);
add('Malus domestica', 'Citrus limon', 1);
add('Malus domestica', 'Calendula officinalis', 1);
add('Malus domestica', 'Sinapis alba', 1);
add('Malus domestica', 'Tropaeolum majus', 1);
add('Malus domestica', 'Solanum tuberosum', 0);
add('Malus domestica', 'Spinacia oleracea', 1);
add('Malus domestica', 'Tanacetum vulgare', 1);
add('Malus domestica', 'Achillea millefolium', 1);
add('Malus domestica', 'Beta vulgaris cicla', 1);
add('Mentha spicata', 'Petroselinum crispum', 0);
add('Mentha spicata', 'Solanum esculentum', 1);
add('Ocimum basilicum', 'Allium schoenoprasum', 1);
add('Ocimum basilicum', 'Cucumis sativus', 1);
add('Ocimum basilicum', 'Foeniculum vulgare', 1);
add('Ocimum basilicum', 'Ruta graveolens', 0);
add('Ocimum basilicum', 'Beta vulgaris cicla', 0);
add('Ocimum basilicum', 'Solanum esculentum', 1);
add('Origanum majorana', 'Allium cepa', 1);
add('Origanum majorana', 'Pastinaca sativa', 1);
add('Origanum majorana', 'Pisum sativum', 1);
add('Origanum majorana', 'Solanum tuberosum', 1);
add('Origanum majorana', 'Cucurbita moschata', 1);
add('Origanum majorana', 'Raphanus landra', 1);
add('Origanum majorana', 'Allium cepa ascalonicum', 1);
add('Origanum majorana', 'Beta vulgaris cicla', 1);
add('Origanum majorana', 'Spinacia oleracea', 1);
add('Origanum majorana', 'Solanum esculentum', 1);
add('Origanum majorana', 'Cucurbita pepo', 1);
add('Pastinaca sativa', 'Pisum sativum', 1);
add('Pastinaca sativa', 'Solanum tuberosum', 1);
add('Pastinaca sativa', 'Raphanus landra', 1);
add('Pastinaca sativa', 'Salvia officinalis', 1);
add('Pastinaca sativa', 'Solanum esculentum', 1);
add('Petroselinum crispum', 'Rosmarinus officinalis', 1);
add('Petroselinum crispum', 'Rosa sericea', 1);
add('Petroselinum crispum', 'Solanum esculentum', 1);
add('Phaseolus vulgaris', 'Apium graveolens dulce', 1);
add('Phaseolus vulgaris', 'Zea mays', 1);
add('Phaseolus vulgaris', 'Cucumis sativus', 1);
add('Phaseolus vulgaris', 'Origanum majorana', 1);
add('Phaseolus vulgaris', 'Solanum tuberosum', 1);
add('Phaseolus vulgaris', 'Fragaria x ananassa', 1);
add('Phaseolus vulgaris', 'Helianthus annuus', 1);
add('Phaseolus vulgaris', 'Allium sativum', 0);
add('Phaseolus vulgaris', 'Lactuca sativa', 1);
add('Phaseolus vulgaris', 'Allium cepa', 0);
add('Phaseolus vulgaris', 'Raphanus landra', 1);
add('Pisum sativum', 'Solanum tuberosum', 1);
add('Pisum sativum', 'Rubus idaeus', 1);
add('Pisum sativum', 'Allium cepa ascalonicum', 0);
add('Prunus armeniaca', 'Ocimum basilicum', 1);
add('Prunus armeniaca', 'Allium sativum', 1);
add('Prunus armeniaca', 'Armoracia rusticana', 1);
add('Prunus armeniaca', 'Citrus limon', 1);
add('Prunus armeniaca', 'Calendula officinalis', 1);
add('Prunus armeniaca', 'Sinapis alba', 1);
add('Prunus armeniaca', 'Tropaeolum majus', 1);
add('Prunus armeniaca', 'Spinacia oleracea', 1);
add('Prunus armeniaca', 'Helianthus annuus', 1);
add('Prunus armeniaca', 'Tanacetum vulgare', 1);
add('Prunus armeniaca', 'Solanum esculentum', 0);
add('Prunus armeniaca', 'Achillea millefolium', 1);
add('Prunus avium', 'Allium schoenoprasum', 1);
add('Prunus avium', 'Allium sativum', 1);
add('Prunus avium', 'Armoracia rusticana', 1);
add('Prunus avium', 'Citrus limon', 1);
add('Prunus avium', 'Lactuca sativa', 1);
add('Prunus avium', 'Calendula officinalis', 1);
add('Prunus avium', 'Sinapis alba', 1);
add('Prunus avium', 'Tropaeolum majus', 1);
add('Prunus avium', 'Solanum tuberosum', 0);
add('Prunus avium', 'Beta vulgaris cicla', 1);
add('Prunus avium', 'Spinacia oleracea', 1);
add('Prunus avium', 'Tanacetum vulgare', 1);
add('Prunus avium', 'Achillea millefolium', 1);
add('Ribes uva-crispa', 'Solanum esculentum', 1);
add('Rosa sericea', 'Ruta graveolens', 1);
add('Rosa sericea', 'Salvia officinalis', 1);
add('Rosa sericea', 'Brassica oleracea', 1);
add('Rosa sericea', 'Tanacetum vulgare', 1);
add('Rosa sericea', 'Thymus vulgaris', 1);
add('Rosmarinus officinalis', 'Salvia officinalis', 0);
add('Rosmarinus officinalis', 'Solanum esculentum', 1);
add('Rubus idaeus', 'Ruta graveolens', 1);
add('Ruta graveolens', 'Salvia officinalis', 0);
add('Salvia officinalis', 'Fragaria x ananassa', 1);
add('Solanum melongena', 'Origanum majorana', 1);
add('Solanum melongena', 'Solanum tuberosum', 1);
add('Solanum tuberosum', 'Cucurbita moschata', 0);
add('Solanum tuberosum', 'Rubus idaeus', 0);
add('Solanum tuberosum', 'Rosmarinus officinalis', 1);
add('Solanum tuberosum', 'Helianthus annuus', 0);
add('Solanum tuberosum', 'Solanum esculentum', 0);
add('Spinacia oleracea', 'Fragaria x ananassa', 1);
add('Tanacetum vulgare', 'Achillea millefolium', 1);
add('Tropaeolum majus', 'Solanum tuberosum', 1);
add('Tropaeolum majus', 'Raphanus landra', 1);
add('Tropaeolum majus', 'Rosa sericea', 1);
add('Tropaeolum majus', 'Fragaria x ananassa', 1);
add('Tropaeolum majus', 'Solanum esculentum', 1);
add('Tropaeolum majus', 'Cucurbita pepo', 1);
add('Vicia faba equina', 'Beta vulgaris craca', 1);
add('Vicia faba equina', 'Brassica oleracea', 1);
add('Vicia faba equina', 'Daucus carota', 1);
add('Vicia faba equina', 'Zea mays', 1);
add('Vicia faba equina', 'Cucumis sativus', 1);
add('Vicia faba equina', 'Solanum melongena', 1);
add('Vicia faba equina', 'Allium sativum', 0);
add('Vicia faba equina', 'Vitis vinifera', 1);
add('Vicia faba equina', 'Lactuca sativa', 1);
add('Vicia faba equina', 'Calendula officinalis', 1);
add('Vicia faba equina', 'Origanum majorana', 1);
add('Vicia faba equina', 'Allium cepa', 0);
add('Vicia faba equina', 'Petroselinum crispum', 1);
add('Vicia faba equina', 'Pastinaca sativa', 1);
add('Vicia faba equina', 'Pisum sativum', 1);
add('Vicia faba equina', 'Solanum tuberosum', 1);
add('Vicia faba equina', 'Rosmarinus officinalis', 1);
add('Vicia faba equina', 'Salvia officinalis', 1);
add('Vicia faba equina', 'Allium cepa ascalonicum', 1);
add('Vicia faba equina', 'Allium schoenoprasum', 0);
add('Vicia faba equina', 'Foeniculum vulgare', 0);
add('Vicia faba equina', 'Spinacia oleracea', 1);
add('Vitis vinifera', 'Sinapis alba', 1);
add('Vitis vinifera', 'Tanacetum vulgare', 1);
add('Vitis vinifera', 'Solanum esculentum', 1);
add('Vitis vinifera', 'Achillea millefolium', 1);
add('Zea mays', 'Cucumis sativus', 1);
add('Zea mays', 'Origanum majorana', 1);
add('Zea mays', 'Pastinaca sativa', 1);
add('Zea mays', 'Pisum sativum', 1);
add('Zea mays', 'Solanum tuberosum', 1);
add('Zea mays', 'Cucurbita moschata', 1);
add('Zea mays', 'Raphanus landra', 1);
add('Zea mays', 'Cucurbita pepo', 1);

module.exports = {
  plants,
  companions,
  getCompanionValue
};
