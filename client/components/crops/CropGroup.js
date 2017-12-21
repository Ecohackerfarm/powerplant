import React from 'react';
import PropTypes from 'prop-types';
import { Typeahead } from 'react-bootstrap-typeahead';
import style from 'react-bootstrap-typeahead/css/Typeahead.css';
import { ToggleButton, ToggleButtonGroup, Row, Col} from 'react-bootstrap';

class CropGroup extends React.Component {
  render(){
  	return(
  		<Row className="button-checkbox-center">
				<Col xs={3} mdOffset={2} md={2} >
					<ToggleButtonGroup type="checkbox" defaultValue={[]}>
						<ToggleButton value={true}></ToggleButton>
					</ToggleButtonGroup>
				</Col>
				<Col xs={9} md={8}>
					<Typeahead
						clearButton
						multiple
						align='justify'
						options={this.props.cropGroup}
						defaultSelected={this.props.cropGroup}
						labelKey='commonName'
						placeholder='Bed is empty, choose crop ...'
					/>
				</Col>
			</Row>
	  );
  }
}

CropGroup.propTypes = {
	cropGroup : PropTypes.array.isRequired,
}

export default CropGroup;
