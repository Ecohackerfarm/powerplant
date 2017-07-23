\[\[wiki|Back To Overview\]\]

{{&gt;toc}}

Software Requirement Specification
==================================

for "powerplant"/ pp\_ / ...
Version &lt;0.8&gt;

Introduction
============

powerplant is a software that allows anyone planning a garden to utilize companion planting and other permaculture practices. It provides intelligent suggestions to help the gardener by advising the best planting schedules and combinations of crops to maximize the garden's yield.

Users
=====

-   Gardeners, including anyone who wants to plan a garden and is happy to use open source software.

More detail below.

Goal
====

The goal of powerplant is to help users effectively plan their garden by providing planning and maintenance suggestions which utilize permaculture principles with a focus on companion planting.

Product Scope
-------------

&gt; Provide a short description of the software being specified and its purpose, including relevant benefits, objectives and goals.

### Software description

-   Offer fast and easy solution for knowing which crops (bene)fit together
-   Provide an easy to follow schedule for planting, transplanting, and harvesting
-   Provide information about the crops themselves
-   Push and pull crop information to/from several open data platforms
-   User can submit changes to improve data
-   Open-source/open-data

&gt; TODO: write more and better text

### Objectives

-   Improve planning process for anyone who wants to use permaculture principles in their gardening.
-   Save time during the planning process for anyone who wants to use permaculture principles in their gardening.
-   Education of users
-   Improve and collect data in open databases
-   Increase harvest yield
-   Connect with other open source projects for mutual benefit

Overall Description
===================

                                +-----------------------+
                                |  OpenFarm.cc API      |
                                +-----------+-----------+
                                            ^
                                            |
                                            |
                                            |
                                            v
    +-------------+                    +----+-----------------+             +----------------+
    | Front End   +<------------------>+    Back End          +<----------->+ powerplant DB  |
    +-------------+                    +----+-----------------+             +----------------+
                                            ^  
                                            |   
                                            |   
                                            |   
                                            |   
                                            v   
                                +--------------+--------+
                                |  FarmOS API           |
                                +-----------------------+

Product Perspective
-------------------

Our vision is that people are able to plan their own gardens using companion planting and other permacultures practices using our app as a central resource for information. The resources we can provide to the user will grow as the app is used more.

Context
-------

The information that we provide is all out there, we want to provide a central source for all of it. Aid those gardening without experience and help make quick and precise descision for the more experienced gardener.

Origin
------

Permaculture guidelines, gardening best practices.

The permaculture ideals are:

-   Care for the earth
-   Care for the people
-   Fair share

Open Source/ Open Data.

### Outcome

A year of use of this software will result in:

-   Users adding to data from all over the world (different climates, soil types)
-   Maybe make some money for affiliate links (seeds, supplies) or donations
-   Users plan garden and fields with our software
-   Users are better educated about gardening and permaculture
-   Enhance other open source projects with valuable information
-   More development on powerplant resulting in better software
    -   especially including more OS/OD enthusiasts
    -   building up networks with different OS/OD projects

Product Functionality
---------------------

&gt; 1 TODO: Summarize the major functions that the product must perform or must let the user perform.
&gt; 2 TODO: Still sorting this

### Must Have

-   Select different guides
-   Offline and online user experience
-   Suggestions for existing beds
-   Mark a bed as full or not
-   Notifications from schedule
-   Tasks and actions
-   Schedule

<!-- -->

-   user can signup/ login or decide to use with local storage only
-   user can create an account from garden data they've already entered
-   user can create beds
-   user can create gardens

<!-- -->

-   Need a list of available plants (internal)
-   Need to be able to see compatible/incompatible plants (internal)
-   Need to be able to filter by compatibility with multiple plants (internal)
-   Find optimal planting schedule for a target bed (with at least one user picked crop)
-   -   Read more information on the plant we display
-   Print Requirements for selected crops (openfarm guides)
    -   Planting requirements - displayed when refining crop selection for a bed
-   List Plants that match some specific attributes (internal)

<!-- -->

-   Create and edit garden/s
-   Create and edit bed/s within a garden
-   Create a list of preferred plants
-   Generate 5 plant combination suggestions for a given bed
-   Generate compatibility chart while picking plants for a bed
-   Modify a plant combination suggestion
    -   Provide advice to user to aid in their decision
        -   Advice on compatibility, plant requirements
        -   Suggest alternate plants to modify combination
-   Provide schedule for a bed including potting, transplanting, harvesting
-   Change the grow-state a plant is in (seed, pot, greenhouse, outside...)
-   Change timeframe of schedule (min:week, max:month)
-   Provide suggestions for filling blank spaces in schedule
-   Add plants to future schedule of bed using the plant-selection process as before
-   Report weekly what needs to be done with each plant
-   Store and load bed or garden from url and display schedule for current date
-   profile to store multiple gardens
-   erase bed history/garden history
-   take user feedback - simple form: user can choose category and write a message
-   View schedule for entire garden
-   Reporting new data or modifying existing data
    -   Crop Information, Crop Relationship, and Guide
-   get climate zone from location

### Should Have

-   When offline:
    -   Get suggestions for where to plant crops
        -   TODO: Figure out if this is possible offline.
        -   Only for plants currently in local memory (eg that are already in beds). More plants is then just disabled.
-   If we get the data, notify the user of maintenance tasks include watering, weeding, pruning, etc.
-   Suggest plants based on distance between plants
-   List suggestions for following plants for harvested beds
-   Sharing/collaboration between users about a specific garden using shareable link
-   Add a crop entry
    -   fill out form
    -   should be validated
-   validation of other users data for a specific climate (proofread, rate, comment, improve)
    -   flag trolls/...
-   Keep track of nitrogen fixers/consumers in each bed over time
-   Save edit history for OpenFarm data
-   permaculture zones:
    -   a garden can have zones
    -   suggestions based on zones
        -   which plant where dependent on how much attention they need/how often you harvest
            -   TODO: think about this, how to figure that out

### Cool to Have

-   Include types of beds required for a crop
-   Get revenue from links for more information.
-   Plant pictures
-   Print Shopping List
-   modify the same garden by multiple users at the same time
-   Have some visualization of garden beds with plants
-   Draw in current crops
-   Gamification
    -   Levels/badges for users
        -   Contributor
        -   Expert farmer
        -   etc.

&gt; TODO: Figure out where these attributes belong: Soil conditions, grow time, climate, sun direction relative to each bed, labor required for each plant, sun+water required, best season/time to plant, care frequency, nitrogen/ consumption

### Detailed function description.

#### Select different Guides

User should choose between different guides (from openfarm.cc) for a crop that fits their needs

-   When adding a crop to a bed, users have the option of selecting a guide available from openfarm
-   Users can view the guide for a crop at any time from the crop details page
-   Guides can be removed, added or changed to a crop in crop view (only one guide per crop)

#### Offline and Online user experience

NEARLY the same UX (user experience) both offline and online! This is really important because people will need to use on mobile in their garden

-   Things a user will most likely want to do while offline. Use command pattern for the actions and queue them up. They sync when the phone/browser has network connection again. This also allows undo's.
    -   Add a new bed
    -   Add existing crops to that bed
    -   Change the status of a crop
    -   Change status of a task
    -   Switch to any other bed in their garden
    -   View a guide/information for a crop

#### Suggestions

-   Provide suggestions for adding specific crops to existing beds
    -   User can ask for crop suggestions when adding crops to a garden or bed
-   Provide suggestions for adding specific crops to a specific bed
    -   User can also ask for suggestions for crops to add to a specific bed
-   Must have at least one user-selected crop to provide suggestions

#### Notifications

Notify users of tasks that should be done for each garden/bed/crop on a given day

-   Email notifications
    -   should be opt out by default
    -   include weekly summary of upcoming tasks

<!-- -->

-   Push notifications
    -   Need to be enabled in browser (would only work on desktop)
    -   include events happening on the current day

#### Tasks and Actions

-   Right now, this would include planting, transplanting, and harvesting - only the major events
-   Users can add custom tasks from a predefined set of actions (or "other")
    -   Tasks are associated with a location, bed, or crop
    -   Repeatable tasks
-   Mark tasks as complete, or postpone or ignore them

#### Schedule

Find optimal planting schedule for a target bed (with at least one user picked crop)

-   When adding a crop, users can get suggestions for when to plant it based on the duration of growth
-   Goal is to maximize the overall yield and allow for consistent harvest throughout the year

Information accessible on timeline of different stages and locations of growth (i.e. when to grow in greenhouse and transplant them outside)

-   Users can view the schedule for a location or bed as a chart
-   Growth periods are shaded in bars, single events are represented as lines
-   Should allow the user to see, at a quick glance, what is growing and when things can be harvested
    -   Also be able to identify gaps in the schedule which could be filled
-   Should also show information about compatibility interactions
    -   Needs to be intuitive and simple to understand, obvious from one look at the schedule

#### User Contributions

Users can contribute in the form of editing existing cropinformation, croprelationship, and guides.

Creating Guides should link into OpenFarm directly - Create Guide.

-   pro: less work for developer
-   contra: might be confusing for the user
    Editing Guides should be put into powerplant "centralized improved guide" (except it is your own guide?). This avoids parallel versions of the same guide edited by different users, and instead puts all the edits in one place.
    Editing Cropinformation should be edited in OpenFarm directly.
    Croprelation should be changed in the app and put into OpenFarm.

### Terminology

Location: Group of gardens
Garden: combination of beds
Bed: Section in a garden (can be a greenhouse, a pot or a patch of soil)
Crop: Specific instance of a crop that will be planted in a bed
Transplant: action moving plants to a different bed.

### 2. Provide a Data Flow Diagram of the system to show how these functions relate to each other.

Data flow diagram for cropinformation/croprelationship data (from openfarm)


                ```````````                           `...`                                             
              `.           .`                       `.`   `.`                                           
             ``             ``                    ```       `.`                                         
             .               .                  ```-Openfarm-..`                                       
        -````. User Interface .``````Send.```>`./.` registered?- `.```````no`````````````-              
        .    .               .                   `....-........`                         .              
        .     .`            .                      `.`     `.`                           .              
        .      +.`       ```                         `.` `.`                             .              
        .      ^  ``/|\``                              `-`                               .              
        .      .     :                                  .                                .              
        .      .     .                                  .                                .              
        .      .     .                                  .                                .              
        .      .     .                                  .                                .              
    Request    .     .                                  .                                .              
        .      .     .                                 yes                               .              
        .      .     .                                  .                       `````````+.`````````    
        .      .     .````````````````````````````````  .``                    .```````````````````.    
        .    .``        Response to request          .    `.                   .                   .    
        . `Response                                  .    `.                   . no action allowed .    
        . .to Request                                .    `.                   .  `` ````` ``````` .    
        . .-`------                                  .    `.                   .                   -    
        .    ^                                       .    `.                   `````````````````````    
        .    .                                       .    `.                                            
        .    .                                       .    `.                                            
        .    .                                       -    \/                                            
        .    .                                   `````````.-                                            
        .    -`````````                       ```        `-:                                            
        .   ..        `.                     .`             .                                           
        .  .``Openfarm` .                   `. Power plant   .                                          
        .>/- `Database` .:<`````Send ```````-  Backend    `  .                                          
           .` ---:::--` .                   `.   .------:    .                                          
            .`        `.                     .`             .                                           
              `````````                       `.`         .`                                            
                                                ``````````                                              

Users and Characteristics
-------------------------

### Identify the various users that you anticipate will use this product.

-   Hobbyist - small home garden. 20 m2
-   Countryside garden - 250 - 1000 m2
-   Organic farmer - 1000 m2 +
-   Consultant - all of the above
-   Anyone who wants to plan a garden by using companion planting.
-   People who want to use open source/ open data software.

### Describe the relevant and important characteristics of each user.

-   All users: consistent harvest throughout the year
-   Hobbyist - Not too much labor is better; organic/natural garden
-   Countryside garden - Same as Hobbyist, also wants to be self-sufficient
-   Organic farmer - Same as Hobbyist, also prioritizing lower labor. Intermixed plants means more labor. Technologically literate, want to use software to improve their yields
-   Consultant - Provide advice to other hobbyists/gardeners/farmers

Operating Environment
---------------------

&gt; Describe the environment in which the software will operate, including the hardware platform, operating system and versions, and any other software components or applications with which it must peacefully coexist. In this part, make sure to include a simple diagram that shows the major components of the overall system, subsystem interconnections, and external interface

-   Lower range laptop
-   Windows 10, Chrome, use in office or garden
-   Android x.x.x, Chrome, use in office or garden, but mainly garden
-   With temporary internet connection

Design and Implementation Constraints
-------------------------------------

&gt; Describe any items or issues that will limit the options available to the developers. These might include:
&gt; \* hardware limitations (timing requirements, memory requirements)
&gt; \* interfaces to other applications
&gt; \* specific technologies
&gt; \* tools
&gt; \* databases to be used
&gt; \* language requirements
&gt; \* User Documentation

-   React for front end with JSX to generate HTML
-   SASS for css
-   Need to eventually be compatible with FarmOS.
-   Need to eventually be compatible with Openfarm.cc.
-   Want to be similar to Openfarm crop database structure.
-   Want tasks to be similar to FarmOS Log data structure
-   Text + photo editors.
-   NodeJS as backend engine running ES6
    -   MongoDB for database with Mongoose as ODM
    -   Express for route handling
    -   Passport for user authentication
    -   Mocha + Chai + supertest for unit testing and integration testing
-   Mobile-first, offline-first design (ok, maybe mobile-first, offline-second. they can't both be first)

User Documentation
------------------

&gt; TO DO: Describe what kind of manuals and what kind of help is needed for the software you will be developing.
List the user documentation components (such as user manuals, on-line help, and tutorials) that will be delivered along with the software.//

Need to have user documentation. Usability will be severly limited without. Need to have in depth descriptions of how to input data, what screens should look like, how to interpret output. Need to document things before creating them.

-   User manual
-   FAQ
-   First time user prompts
-   Community talking points
-   Chat rooms (like FarmOS)
-   Tutorials for most exemplary tasks (Videos, ...)

Specific Requirements
=====================

External Interface Requirements
-------------------------------

&gt; TO DO: Describe user interfaces, different screen images, any GUI standards, standard buttons and functions (e.g., Cancel) that will be available to the user. Define error message display standards.

### GUI standards

https://material.io/guidelines/
https://medium.com/@marcintreder/the-minimum-viable-design-system-75ca1806848a

-   Lots of rounded rectangles to contain components
-   Font size standards based on Marvel prototype (maybe change to be based on screen size in the future)
    -   Main page title: 26pt
    -   Subtitle: 18pt
    -   Body text: 14pt
-   Sidebar menu accessible from any screen which shows the current location and allows jumping to any screen above it in the hierarchy (All Gardens -&gt; Garden Dashboard -&gt; Bed Dashboard -&gt; Crop)
-   Gardens and Beds contain 3 subscreens (fragments?)
    -   Dashboard, Beds/Crops, Schedule
    -   Dashboard shows relevant tasks
    -   Beds/Crops shows all Beds/Crops contained within the Garden/Bed
    -   Schedule shows history of all past, present, and future crops for the Garden/Bed
-   Any time there is a title/heading of an element containing a Garden, Bed, or Crop, it will have a small drop down menu next to it
    -   Menu items: Edit, delete
    -   This is the main mechanism by which user can change settings/status of a specific Garden, Bed, or Crop

### View Description

[View the prototype! (INCOMPLETE)](https://marvelapp.com/94c4bh4)

&gt; TODO: add many many more more more more views

### Hardware Interfaces

&gt; Describe the logical and physical characteristics of each interface between the software product and the hardware components of the system. This may include, the supported device types, the nature of the data and control interactions between the software and the hardware.

\* 800x400 display
\* 100kB/s
\* 200mb memory on mobile
\* 512mb memory on non-mobile
\* 5mb local storage

### Software Interfaces

&gt; TO DO: Describe: the connections between the product and other specific software components (name and version), databases, operating systems (Windows? Linux? Etc…), tools, libraries and integrated commercial components.

-   FarmOS
    -   FarmOS users can provide the url of their server and save/load all of their data BESIDES crop guides and crop information from there
    -   There will have to be a moderate amount of translation between powerplant data format and FarmOS data format
    -   Rather than building a seperate FarmOS module, we will make our web app compatible with FarmOS
    -   A FarmOS module could be possible, but requires much more time and expertise than it is worth at the moment
-   Openfarm.cc
    -   Openfarm stores CropRelationships, Crop Guides, and Crop Information
    -   Powerplant users can choose to register their accounts with Openfarm as well
    -   Users who do this will be able to save/modify this data
    -   All users (registered or not), while load this data from Openfarm

&gt; TO DO: Identify data items or messages coming into the system and going out and describe the purpose of each.

-   FarmOS specs go here
-   openfarm.cc specs go here

&gt; TO DO: Describe the services needed.

&gt; TO DO: Identify data that will be shared across software components.

-   need to look at what FarmOS stores and what we store
    figure out what we can store in FarmOS

### Communications Interfaces

TO DO:

1. Describe the requirements associated with any communication functions required by this product, including e-mail, web browser, network server communications protocols, electronic forms.
2. Define any pertinent message formatting.

communication standards that will be used, such as FTP or HTTP.
---------------------------------------------------------------

REST

[Auto-generated API specs](https://github.com/Ecohackerfarm/powerplant/blob/master/docs/spec.md)

API error messages have the following format:

<pre>
{
status: Number,
message: (optional) String,
errors: (optional) {
fieldName1: String,
...
}
}

</pre>
`status`: HTTP status code
`errors`: Object containing error messages pertinent to specific UI elements, e.g. a login request with an incorrect password would result in `{password: "Incorrect password"}`
`message`: A general description of the error, which can be displayed to the user

#### communication security or encryption issues, data transfer rates, and synchronization mechanisms.

\* Profile could have sensitive info
\* Even in case of (locally) illegal crops being grown, info cannot be accessible by anyone
\* Yield is sensitive
\* Complete transparency within network of gardeners, zero transparency outside
\* low bandwidth because garden usually has bad reception (GPRS traffic)
\* Sync profile data between local and server

Behavior Requirements
---------------------

### Use Case View

&gt; TO DO: Provide a use case diagram which will encapsulate the entire system and all possible actors.

[Workflow Diagram](https://github.com/Ecohackerfarm/powerplant/blob/master/docs/Powerplant%20Workflow.svg)

&gt; TODO: Create use case diagrams involving each of the possible types of users

List of Use case
----------------

Diagram
&gt; TODO: Next time
--------------------

TODO:
Convince openfarm to enhance companionship model
