const React = require('react');
const { Form, InputGroup, Row, Col } = require('react-bootstrap');
const { connect } = require('react-redux');
const SelectDropdownWithSearch = require('./shared/SelectDropdownWithSearch.js');
const SelectDropdown = require('./shared/SelectDropdown.js');
const InputField = require('./shared/InputField.js');
const EditPanel = require('./shared/EditPanel.js');
const practicalplants = require('../shared/practicalplants.js');
const utils = require('../shared/utils.js');

/**
 * CropEditPanel is an editor for Crop objects.
 *
 * @param props.crop
 * @param props.handleSave
 * @param props.handleCancel
 */
class CropEditPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      crop: this.props.crop
    };

    this.onTagsChange     = this.onTagsChange.bind(this);
    this.onDropdownChange = this.onDropdownChange.bind(this);
  }

  render() {
    const { handleSave, handleCancel, crops } = this.props;
    const { crop } = this.state;

    const initialTags = utils.getCropTagNames(crop);
    const initialCuttingType = crop.cuttingType ? [crop.cuttingType] : [];
    const initialDeciduousOrEvergreen = crop.deciduousOrEvergreen ? [crop.deciduousOrEvergreen] : [];
    const initialDrought = crop.drought ? [crop.drought] : [];
    const initialFlowerType = crop.flowerType ? [crop.flowerType] : [];
    const initialGrowthRate = crop.growthRate ? [crop.growthRate] : [];
    const initialHerbaceousOrWoody = crop.herbaceousOrWoody ? [crop.herbaceousOrWoody] : [];
    const initialRootZone = crop.rootZone ? [crop.rootZone] : [];
    const initialShade = crop.shade ? [crop.shade] : [];
    const initialSun = crop.sun ? [crop.sun] : [];
    const initialWater = crop.water ? [crop.water] : [];

    const initialEcosystemNiche = crop.ecosystemNiche ? crop.ecosystemNiche : [];
    const initialFertility = crop.fertility ? crop.fertility : [];
    const initialFunctions = crop.functions ? crop.functions : [];
    const initialGrowFrom = crop.growFrom ? crop.growFrom : [];
    const initialLifeCycle = crop.lifeCycle ? crop.lifeCycle : [];
    const initialPollinators = crop.pollinators ? crop.pollinators : [];
    const initialSoilPh = crop.soilPh ? crop.soilPh : [];
    const initialSoilTexture = crop.soilTexture ? crop.soilTexture : [];
    const initialSoilWaterRetention = crop.soilWaterRetention ? crop.soilWaterRetention : [];

    const initialMatureMeasurementUnit = practicalplants.PP_MATURE_MEASUREMENT_UNIT_VALUES.includes(crop.matureMeasurementUnit) ? [crop.matureMeasurementUnit] : [];

    const tagSet = utils.findTagSet(crops);

    return (
      <EditPanel
        title={utils.getCropDisplayName(crop)}
        handleSave={() => handleSave(crop)}
        handleCancel={handleCancel}>
          {[
            this.getNameInputElement(crop, 'Binomial name'),
            this.getNameInputElement(crop, 'Common name'),
          ]}
          {[
            this.getNumberInputElement(crop, 'Hardiness zone')
          ]}
          {[
            this.getNumberInputElement(crop, 'Mature height'),
            this.getNumberInputElement(crop, 'Mature width'),
            this.getSingleDropdownElement('Mature measurement unit', practicalplants.PP_MATURE_MEASUREMENT_UNIT_VALUES, initialMatureMeasurementUnit),
          ]}
          <SelectDropdownWithSearch items={tagSet} initialSelection={initialTags} title={'Tags'} multi={true} allowNewItems={true} handleChange={this.onTagsChange} />
          {[
            this.getSingleDropdownElement('Cutting type', practicalplants.PP_CUTTING_TYPE_VALUES, initialCuttingType),
            this.getSingleDropdownElement('Deciduous or evergreen', practicalplants.PP_DECIDUOUS_OR_EVERGREEN_VALUES, initialDeciduousOrEvergreen),
            this.getSingleDropdownElement('Drought', practicalplants.PP_DROUGHT_VALUES, initialDrought),
            this.getSingleDropdownElement('Flower type', practicalplants.PP_FLOWER_TYPE_VALUES, initialFlowerType),
            this.getSingleDropdownElement('Growth rate', practicalplants.PP_GROWTH_RATE_VALUES, initialGrowthRate),
            this.getSingleDropdownElement('Herbaceous or woody', practicalplants.PP_HERBACEOUS_OR_WOODY_VALUES, initialHerbaceousOrWoody),
            this.getSingleDropdownElement('Root zone', practicalplants.PP_ROOT_ZONE_VALUES, initialRootZone),
            this.getSingleDropdownElement('Shade', practicalplants.PP_SHADE_VALUES, initialShade),
            this.getSingleDropdownElement('Sun', practicalplants.PP_SUN_VALUES, initialSun),
            this.getSingleDropdownElement('Water', practicalplants.PP_WATER_VALUES, initialWater),
          ]}
          {[
            this.getMultiDropdownElement('Ecosystem niche', practicalplants.PP_ECOSYSTEM_NICHE_VALUES, initialEcosystemNiche),
            this.getMultiDropdownElement('Fertility', practicalplants.PP_FERTILITY_VALUES, initialFertility),
            this.getMultiDropdownElement('Functions', practicalplants.PP_FUNCTIONS_VALUES, initialFunctions),
            this.getMultiDropdownElement('Grow from', practicalplants.PP_GROW_FROM_VALUES, initialGrowFrom),
            this.getMultiDropdownElement('Life cycle', practicalplants.PP_LIFE_CYCLE_VALUES, initialLifeCycle),
            this.getMultiDropdownElement('Pollinators', practicalplants.PP_POLLINATORS_VALUES, initialPollinators),
            this.getMultiDropdownElement('Soil pH', practicalplants.PP_SOIL_PH_VALUES, initialSoilPh), // TODO validate consecutiveness
            this.getMultiDropdownElement('Soil texture', practicalplants.PP_SOIL_TEXTURE_VALUES, initialSoilTexture), // TODO validate consecutiveness
            this.getMultiDropdownElement('Soil water retention', practicalplants.PP_SOIL_WATER_RETENTION_VALUES, initialSoilWaterRetention),
          ]}
          {[
            this.getCheckboxElement('maritime resistant', 'maritime', crop.maritime),
            this.getCheckboxElement('pollution resistant', 'pollution', crop.pollution),
            this.getCheckboxElement('poor nutrition resistant', 'poorNutrition', crop.poorNutrition),
            this.getCheckboxElement('wind resistant', 'wind', crop.wind),
          ]}
      </EditPanel>
    );
  }

  getCheckboxElement(label, property, initialChecked) {
    const controlId = getControlId(label);

    return (
      <Form.Group as={Row} controlId={controlId}>
        <Col><Form.Check type={'checkbox'} label={label} defaultChecked={initialChecked} onChange={event => this.onCheckboxChange(event, property)} /></Col>
      </Form.Group>
    );
  }

  getMultiDropdownElement(label, items, initialSelection) {
    return this.getDropdownElement(label, items, initialSelection, true);
  }

  getSingleDropdownElement(label, items, initialSelection) {
    return this.getDropdownElement(label, items, initialSelection, false);
  }

  getDropdownElement(label, items, initialSelection, multi) {
    const property = utils.toCamelCase(label);
    const controlId = getControlId(label);

    return (
      <Form.Group as={Row} controlId={controlId}>
        <Form.Label column={true}>{label}</Form.Label>
        <Col><SelectDropdown items={items} initialSelection={initialSelection} title={label} multi={multi} handleChange={selected => this.onDropdownChange(selected, property, multi)} /></Col>
      </Form.Group>
    );
  }

  getNumberInputElement(crop, label) {
    return this.getInputElement(crop, label, this.onNumberChange);
  }

  getNameInputElement(crop, label) {
    return this.getInputElement(crop, label, this.onNameChange);
  }

  getInputElement(crop, label, handler) {
    const property  = utils.toCamelCase(label);
    const controlId = getControlId(label);

    return (
      <Form.Group as={Row} controlId={controlId}>
        <Form.Label column={true}>{label}</Form.Label>
        <Col><InputField value={crop[property]} handleChange={(name) => handler.bind(this)(name, property)} /></Col>
      </Form.Group>
    );
  }

  onNumberChange(name, property) {
    // TODO Proper validation with user warnings
    for (let index = 0; index < name.length; index++) {
      if (!['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'].includes(name.charAt(index))) {
        return;
      }
    }

    this.setCrop({ [property]: name });
  }

  onNameChange(name, property) {
    this.setCrop({ [property]: name });
  }

  onCheckboxChange(event, property) {
    this.setCrop({ [property]: event.target.checked });
  }

  onDropdownChange(selected, property, multi) {
    this.setCrop({ [property]: multi ? selected : selected[0] });
  }

  onTagsChange(tagNames) {
    const tags = tagNames.map(name => ({ _id: null, name: name }));
    this.setCrop({ tags: tags });
  }

  setCrop(update) {
    const { crop } = this.state;
    this.setState({ crop: Object.assign({}, crop, update) } );
  }
}

function getControlId(label) {
  return utils.toCamelCase('form ' + label);
}

const mapStateToProps = state => ({
  crops: Object.values(state.crops),
});

module.exports = connect(mapStateToProps, null)(CropEditPanel);
