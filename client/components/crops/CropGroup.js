import React from 'react';
import PropTypes from 'prop-types';
import { Typeahead } from 'react-bootstrap-typeahead';
import style from 'react-bootstrap-typeahead/css/Typeahead.css';
import { ToggleButton, ToggleButtonGroup, Row, Col} from 'react-bootstrap';

class CropGroup extends React.Component {
	constructor(props){
		super(props);
		this.onChangeGroup = this.onChangeGroup.bind(this);
		this.onChangeCheckbox = this.onChangeCheckbox.bind(this);
		this.group = props.cropGroup;
		this.state = {
			checked : [1]
		}
	}
	onChangeGroup(group){
		if (group.length>0){
			this.group = group;
		  let checkedNow;
		  if (!this.state.checked){
		  	this.setState({
		  		checked : true
		  	})
		  	checkedNow = true;
		  } else {
		  	checkedNow = false;
		  }
		  this.props.onChange(
				this.props.index,
				this.group,
				checkedNow
			);

		} else {
			this.group = [];
			this.setState({
					checked : false
			});
			this.props.onChange(
				this.props.index,
				this.group,
				false//this.state.checked
			);
		}
	}
	onChangeCheckbox(checkArray){
		let checkedNow;
		if (checkArray.length>0){
			checkedNow = true;
		} else {
			checkedNow = false;
		}
		this.setState({
			checked : checkedNow
		});
		this.props.onChange(
			this.props.index,
			this.group,
			checkedNow//this.state.checked
		);
	}
  render(){
  	return(
  		<Row className="button-checkbox-center">
				<Col xs={3} mdOffset={2} md={2} >
					<ToggleButtonGroup
					  type="checkbox"
					  defaultValue={this.state.checked}
					  onChange={this.onChangeCheckbox}
					>
						<ToggleButton value={1}></ToggleButton>
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
						onChange={this.onChangeGroup}
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
