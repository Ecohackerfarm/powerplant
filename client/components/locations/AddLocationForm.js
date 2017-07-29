import React from 'react';
import PropTypes from 'prop-types';
import validateLocation from '/shared/validation/locationValidation'
import {Button, ButtonToolbar, FormGroup, HelpBlock, ListGroup, ListGroupItem} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';
import TextFieldGroup from '/client/components/shared/TextFieldGroup';

class AddLocationForm extends React.Component {
  static propTypes = {
    // both will be passed in by the Crudable AddItemPage
    onSuccess: PropTypes.func.isRequired,
    saveItemRequest: PropTypes.func.isRequired
  }

  state = {
    name: '',
    address: '',
    loc: {
      coordinates: []
    },
    locationResults: [],
    errors: {},
    isLoading: false,
    selectedLocation: false
  }

  typingTimer = {
    timer: undefined,
    timeout: 250
  }

  // gets called when user types in a textbox
  onChange = (evt) => {
    const {typingTimer, requestLocationResults} = this;
    this.setState({
      [evt.target.id]: evt.target.value,
      errors: Object.assign({}, this.state.errors, {[evt.target.id]: undefined})
    });
    if (evt.target.id === 'address') {
      clearTimeout(typingTimer.value);
      const errors = Object.assign({}, this.state.errors, {address: undefined});
      if (evt.target.value) {
        typingTimer.value = setTimeout(requestLocationResults, typingTimer.timeout);
      }
      this.setState({
        loc: {
          coordinates: []
        },
        selectedLocation: false,
        errors
      })
    }
  }

  // gets called when the user types a query in the address textbox
  // fetches possible locations from google geocode api
  requestLocationResults = () => {
    const address = this.state.address;
    fetch('http://maps.google.com/maps/api/geocode/json?address=' + address)
    .then(res => res.json())
    .then(data => {
      if (data.status === "ZERO_RESULTS") {
        this.setState({
          errors: Object.assign({}, this.state.errors, {address: "Address not found"})
        })
      }
      else {
        let locationResults = data.results.map((location) => ({
          name: location.formatted_address,
          loc: {
            // yes, I know this is backwards
            // it's a mongodb thing :(
            coordinates: [location.geometry.location.lng, location.geometry.location.lat]
          }
        }))
        this.setState({
          locationResults,
          errors: Object.assign({}, this.state.errors, {address: undefined})
        });
      }
    })
    .catch(() => {
      this.setState({
        errors: Object.assign({}, this.state.errors, {address: "Unable to fetch location results"})
      });
    })
  }

  // gets called when the user selects a location from the list
  setLocation(index) {
    let loc = this.state.locationResults[index].loc;
    let address = this.state.locationResults[index].name;
    let locationResults = [];
    this.setState({
      loc,
      address,
      locationResults,
      selectedLocation: true
    });
  }

  onSubmit = (evt) => {
    evt.preventDefault();
    const location = {
      name: this.state.name,
      loc: this.state.loc
    }
    const {errors, isValid} = validateLocation(location);
    if (!isValid) {
      errors.address = (errors.loc || {}).coordinates;
      this.setState({
        errors
      })
    }
    else {
      this.props.saveItemRequest(location)
      .then(({success}) => {
        if (success) {
          this.props.onSuccess();
        }
        else {
          console.log("Error saving");
        }
      })
    }
  }

  render() {
    const {errors, isLoading, locationResults} = this.state;
    return (
      <form onSubmit={this.onSubmit}>
        <TextFieldGroup
          id="name"
          onChange={this.onChange}
          placeholder="Name"
          error={errors.name}
          value={this.state.name}/>

        <TextFieldGroup
          id="address"
          onChange={this.onChange}
          placeholder="Address"
          error={errors.address}
          success = {this.state.selectedLocation}
          value={this.state.address} />

        {locationResults.length > 0 &&
          <ListGroup>
            <ListGroupItem bsStyle="info">Select your location</ListGroupItem>
            {locationResults.map(({name}, index) => (
              <ListGroupItem key={name} onClick={this.setLocation.bind(this, index)}>
                {name}
              </ListGroupItem>
            ))}
        </ListGroup>
        }

        <ButtonToolbar>
          <LinkContainer to="/locations">
            <Button>
              Cancel
            </Button>
          </LinkContainer>

          <Button bsStyle="primary"
            disabled={isLoading}
            type={!isLoading ? "submit" : null}>
            Submit
          </Button>
        </ButtonToolbar>
      </form>
    )
  }
}

export default AddLocationForm;
