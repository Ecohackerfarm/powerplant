import React from 'react';
import {Switch, Route} from 'react-router-dom';
import {LinkContainer} from 'react-router-bootstrap';
import PropTypes from 'prop-types';
import {Grid, Row, Col, HelpBlock, Button} from 'react-bootstrap';
import CrudableList from './CrudableList'
import AddItemPage from './AddItemPage';
import EditItemPage from './EditItemPage';
import SetHeaderTitle from '../SetHeaderTitle';

const CrudableListPage = ({actions, items, itemName, ItemListView, AddItemForm, match}) => {
  const homeUrl = match.url;
  return (
    <Switch>
      <Route exact path={match.url} render={() => (
        <Grid>
          <SetHeaderTitle title={itemName.charAt(0).toUpperCase() + itemName.slice(1) + "s"} />
          <CrudableList deleteAction={actions.delete} match={match} items={items} ItemView={ItemListView} itemName={itemName} />
          <LinkContainer to={`${match.url}/add`}>
            <Button bsStyle="floating">+</Button>
          </LinkContainer>
        </Grid>
      )} />
      <Route exact path={`${match.url}/add`} render={() => (
        <div>
          <SetHeaderTitle title={`Add ${itemName}`} />
          <AddItemPage AddItemForm={AddItemForm}
            itemName={itemName}
            onSubmit={actions.create}
            homeUrl={match.url} />
        </div>
      )} />
      <Route exact path={`${match.url}/:id/edit`} render={({match}) => (
        <div>
          <SetHeaderTitle title={`Edit ${itemName}`} />
          <EditItemPage EditItemForm={AddItemForm}
            editAction={actions.edit}
            itemName={itemName}
            id={match.params.id}
            homeUrl={homeUrl}
            items={items}
             />
        </div>
      )} />
    </Switch>
  );
}

CrudableListPage.propTypes = {
  actions: PropTypes.object.isRequired,
  items: PropTypes.array.isRequired,
  itemName: PropTypes.string.isRequired,
  ItemListView: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
}

export default CrudableListPage;
