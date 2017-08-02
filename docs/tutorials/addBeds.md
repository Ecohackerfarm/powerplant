Introduction
============
At the time of writing (Aug. 2, 2017), the next major step in the project is to implement the rest of the data hierarchy (Users -> Locations -> Beds -> Crops). Currently, there are users and locations. It is only logical that beds be implemented next.

A **bed** is defined in the software specifications as: "Section in a garden (can be a greenhouse, a pot or a patch of soil)"

This tutorial will go through the full process of implementing ONLY the list of beds, both front and back end. The order of these events is not so important; what matters is that it's all there. The result will be a fully editable list of beds which are stored within each location. They won't contain anything, they won't have schedules or tasks. That will all need to be added later, but in order to have a schedule there must be a Crop model first. I suggest implementing only the list views first, and then embellishing each one with tasks and schedules, once possible, to turn it into a multi-tabbed view.

At a later point, this list of beds will need to be expanded into a full Location view, as per the prototype. It will contain three tabs, one of which is the list of beds, the other two will be tasks and schedule (see "Garden Dashboard" on the prototype).

Overview
--------

The front end components involved are
* React components to display the actual data
	* A form for adding a new bed
	* A template for displaying a single item in the list of beds
	* A redux-connected component which sends all the relevant information to CrudableList to generate the page
* Redux actions to create, edit, and delete the data
* Redux reducers to modify the store based on these actions
* Unit tests for the actions and reducers

The back end components involved are
* A mongoose model for a Bed object
* Modification of the Location object to reference its beds
* Creation of express middleware to check and fetch beds from add a list of ids
* API routes to create, read, update, and destroy (CRUD)
* Integration tests to ensure that all API routes are working as intended

Front End
=========

React components
----------------

Create presentational React components which will display a functional list of beds given the proper data. You will then be able to use a {@link client.components.shared.CrudableList CrudableList} to turn this into a fully functional and interactable list of data, similar to the locations list.

### New bed form

You must create a form for adding a new bed. This will function as both the form to add a bed, and to edit one. Follow the specifications at {@link client.components.shared.CrudableList.CrudableListPage.AddItemForm CrudableList.AddItemForm} for information about the properties this form will take in. They must have these exact properties in order to be compatible with the CrudableList.

Having good error messages and user feedback in forms is important! This component should probably return a `form` element which utilizes {@link client.components.shared.TextFieldGroup TextFieldGroups} for all input groups. This is a shared component which handles error messages and validation states for you!

### List item

A simple component for displaying a single bed item in the list of beds. This is not meant to contain all bed information, just a few key components. Maybe just a short list of current crops, a few icons indicating tasks (although tasks might not have been implemented yet, so that could be difficult).

> **NOTE** unfortunately for this tutorial, I ACCIDENTALLY CLOSED WITHOUT SAVING after writing a bunch of it after this point. So it's going to be a little terser than usual, I probably won't link things because it's a pain to write, and I might sound a little angrier. Lesson learned, make sure you know which side of the split you're on before :q!

Specifications for list item are at {@link client.components.shared.CrudableList.CrudableListPage.ItemListView} (see why I didn't want to type links???). For locations, I made it a panel. I'd recommend doing the same for consistency.

### Tying it all together

For locations, this is `/client/components/locations/LocationsPage.js`. It creates a higher-order redux-connected component which passes in a whole bunch of things that the CrudableListPage needs. Once you have this, you have the whole editable list!

Redux actions
-------------

You will need actions to:
* Load all beds from the server
* Save a bed
* Edit a bed
* Delete a bed
For each of these, you will need
* An action request (the thing that gets wrapped in a dispatch call and passed to CrudableListPage) in `/client/actions/bedActions.js`
* A pure action creator in `/client/actions/index.js`
* An action type definition as a JSDoc `@typedef` in `/client/actions/index.js`
* An action type string constant in `/client/actions/types.js`

For writing the request, you can utilize {@link client.actions.actionHelpers.simpleAuthCheckedRequest}. See examples of its usage in `/client/actions/locationActions.js`.

Redux reducers
--------------

Reducers are pure functions (no side effects) which take in the previous state and an action and return the new state. You'll need to write a bed reducer, which takes in the previous list of beds and an action object and returns the new list of beds. It should go in `/client/reducers/beds.js` and have a named export as `beds` in `/client/reducers/index.js`.

Unit tests
----------

I recommend following test-driven development for the actions and reducers and writing tests before writing the functions. I know I didn't do a great job with this for actions :( Learn from my mistakes!


Back end
========

Mongoose model
--------------

The outline of the bed model is in the dev docs (the home page of this documentation). I'll also put it right here.

```
    +----v--------------1-----------------+
    |          Bed                        |
    +-------------------------------------+
    |          _id:ObjectId               |
    | active_crops:[ObjectId(ref:Crop)]   |
    |   past_crops:[ObjectId(ref:Crop)]   |
    |    soil_type:Enum                   |
    |     location:ObjectId(ref:Location) |
    |         user:ObjectId(ref:User)     |
    |                                     |
    |                                     |
    +-----n------------^------------------+
```

You can leave out active\_crops and past\_crops if they don't exist yet. Or make them empty lists and fill in the ref: part later. Also, now is a good time to go into the location model and add a list of bed ObjectIds.

Express middleware
------------------

Go to `/server/middleware/data-validation.js`. You can export functions similar to `getCrops`, `fetchCrops`, etc. for beds. These will handle the error responses for when someone asks for an invalid bed

API routes
----------

Should go in `/server/routers/api/beds.js`. I think a flat API structure here is good, so I'd probably do something like `GET/PUT /beds/:bedId`, `POST /beds`, `GET /users/:id/beds` (that last one should go in the `users.js` router.

Make sure you use the middleware you just created to check/fetch beds. They just need to be put in the `ids` property of the request first. For sending back errors, use the `next(error)` call. All errors will get passed to a central API error handler middleware in `/server/routers/api.js`. The error object must have a status but that's the only required part. I liked to have a message property and then an errors object which could have errors for specific fields if applicable (like if handling form data).

Integration tests
-----------------

Write a suit of integration tests which tests every API route. This is hugely important, because you don't want to have to manually check that the routes are doing what you want them to do. Again, TDD is really helpful here. Look at the *Testing* section of the dev docs for some guidelines.



Feel free to email me with questions/etc. I know this is a VERY unfinished project and this was my first large-scale full-stack software project. I'm sure there are plenty of places I could've done something much better.

*Simon Ever-Hale*

*simoneverhale@gmail.com*

*Aug. 2, 2017*
