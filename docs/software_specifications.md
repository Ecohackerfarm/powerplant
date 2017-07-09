[[wiki|Back To Overview]]

{{>toc}}

h1. Software Requirement Specification

for "powerplant"/ pp_ / ...
Version <0.6>

h1. Introduction

powerplant is a software that allows anyone planning a garden to utilize companion planting and other permaculture practices. It provides intelligent suggestions to help the gardener by advising the best planting schedules and combinations of crops to maximize the garden's yield.

h1. Users

* Gardeners, including anyone who wants to plan a garden and is happy to use open source software.

More detail below.

h1. Goal

The goal of powerplant is to help users effectively plan their garden by providing planning and maintenance suggestions which utilize permaculture principles with a focus on companion planting.
 
h2. Product Scope

> Provide a short description of the software being specified and its purpose, including relevant benefits, objectives and goals. 

h3. Software description

* Offer fast and easy solution for knowing which crops (bene)fit together
* Provide an easy to follow schedule for planting, transplanting, and harvesting
* Provide information about the crops themselves
* Push and pull crop information to/from several open data platforms
* User can submit changes to improve data
* Open-source/open-data

> TODO: write more and better text

h3. Objectives

* Improve planning process for anyone who wants to use permaculture principles in their gardening.
* Save time during the planning process for anyone who wants to use permaculture principles in their gardening.
* Education of users
* Improve and collect data in open databases
* Increase harvest yield
* Connect with other open source projects for mutual benefit

h1. Overall Description

>TODO: Describe the context and origin of the product being specified. Include a simple diagram that shows the major components of the overall system, subsystem interconnections, and external interface.

h2. Product Perspective

Our vision is that people are able to plan their own gardens using companion planting and other permacultures practices using our app as a central resource for information. The resources we can provide to the user will grow as the app is used more.

h2. Context

The information that we provide is all out there, we want to provide a central source for all of it. Aid those gardening without experience and help make quick and precise descision for the more experienced gardener.

h2. Origin

Permaculture guidelines, gardening best practices.

The permaculture ideals are:

* Care for the earth
* Care for the people
* Fair share

Open Source/ Open Data.

h3. Outcome

A year of use of this software will result in:

* Users adding to data from all over the world (different climates, soil types)
* Maybe make some money for affiliate links (seeds, supplies) or donations
* Users plan garden and fields with our software
* Users are better educated about gardening and permaculture
* Enhance other open source projects with valuable information
* More development on powerplant resulting in better software
** especially including more OS/OD enthusiasts
** building up networks with different OS/OD projects
 
h2. Product Functionality 

> 1 TODO: Summarize the major functions that the product must perform or must let the user perform.
> 2 TODO: Still sorting this

h3. To Be Sorted

>  a lot of these are functions that are in the prototype but not in the specs yet

h3. Must Have

* Select different guides
* Offline and online user experience
* Suggestions for existing beds
* Mark a bed as full or not
* Notifications from schedule
* Tasks and actions
* Schedule

* user can signup/ login or decide to use with local storage only
* user can create an account from garden data they've already entered
* user can create beds
* user can create gardens

* Need a list of available plants (internal)
* Need to be able to see compatible/incompatible plants (internal)
* Need to be able to filter by compatibility with multiple plants (internal)
* Find optimal planting schedule for a target bed (with at least one user picked crop)
* 
* Read more information on the plant we display
* Print Requirements for selected crops (openfarm guides)
** Planting requirements - displayed when refining crop selection for a bed
* List Plants that match some specific attributes (internal)

* Create and edit garden/s
* Create and edit bed/s within a garden
* Create a list of preferred plants
* Generate 5 plant combination suggestions for a given bed
* Generate compatibility chart while picking plants for a bed
* Modify a plant combination suggestion
** Provide advice to user to aid in their decision
*** Advice on compatibility, plant requirements
*** Suggest alternate plants to modify combination
* Provide schedule for a bed including potting, transplanting, harvesting
* Change the grow-state a plant is in (seed, pot, greenhouse, outside...)
* Change timeframe of schedule (min:week, max:month)
* Provide suggestions for filling blank spaces in schedule
* Add plants to future schedule of bed using the plant-selection process as before
* Report weekly what needs to be done with each plant
* Store and load bed or garden from url and display schedule for current date
* profile to store multiple gardens
* erase bed history/garden history
* take user feedback - simple form: user can choose category and write a message
* View schedule for entire garden

h3. Should Have

* When offline:
** Get suggestions for where to plant crops
*** TODO: Figure out if this is possible offline.
*** Only for plants currently in local memory (eg that are already in beds). More plants is then just disabled.
* If we get the data, notify the user of maintenance tasks include watering, weeding, pruning, etc.
* Suggest plants based on distance between plants
* List suggestions for following plants for harvested beds
* Sharing/collaboration between users about a specific garden using shareable link
* Add a crop entry
** fill out form
** should be validated
* validation of other users data for a specific climate (proofread, rate, comment, improve)
** flag trolls/...
* Keep track of nitrogen fixers/consumers in each bed over time

h3. Cool to Have

* Include types of beds required for a crop
* Get revenue from links for more information.
* Plant pictures
* Print Shopping List
* modify the same garden by multiple users at the same time
* Have some visualization of garden beds with plants
* Draw in current crops

> TODO: Figure out where these attributes belong: Soil conditions, grow time, climate, sun direction relative to each bed, labor required for each plant, sun+water required, best season/time to plant, care frequency, nitrogen/ consumption

h3. Detailed function description.

h4. Select different Guides

User should choose between different guides (from openfarm.cc) for a crop that fits their needs

h4. Offline and Online user experience

NEARLY the same UX (user experience) both offline and online! This is really important because people will need to use on mobile in their garden
* Things a user will most likely want to do while offline. Use command pattern for the actions and queue them up. They sync when the phone/browser has network connection again. This also allows undo's.
** Add a new bed
** Add existing crops to that bed
** Change the status of a crop
** Change status of a task
** Switch to any other bed in their garden
** View a guide/information for a crop

h4. Suggestions

* Provide suggestions for adding specific crops to existing beds
** User can ask for crop suggestions when adding crops to a garden or bed
* Provide suggestions for adding specific crops to a specific bed
** User can also ask for suggestions for crops to add to a specific bed
* Must have at least one user-selected crop to provide suggestions


h4. Notifications

Notify users of tasks that should be done for each garden/bed/crop on a given day
** Right now, this would include planting, transplanting, and harvesting - only the major events

h4. Tasks and Actions

* Users can add custom tasks from a predefined set of actions (or "other")
** Repeatable tasks
* Mark tasks as complete, or postpone or ignore them

h4. Schedule

Find optimal planting schedule for a target bed (with at least one user picked crop)

Information accessible on timeline of different stages and locations of growth (i.e. when to grow in greenhouse andtransplant them outside)

* Print crops that should be ready for harvest in a specific time frame for:
** a bed
** whole garden/field
** Should be an alternate view of the schedule

h3. Terminology

Location: Group of gardens
Garden: combination of beds
Bed: Section in a garden (can be a greenhouse, a pot or a patch of soil)
Crop: Specific instance of a crop that will be planted in a bed
Transplant: action moving plants to a different bed.


h3. 2. Provide a Data Flow Diagram of the system to show how these functions relate to each other.

"Data flow Diagram":  for openfarm.cc data

<pre>
                                                                                                    
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
                                                                                                    
                                                                                                   
</pre>

h2. Users and Characteristics

h3.  Identify the various users that you anticipate will use this product.

* Hobbyist - small home garden. 20 m2
* Countryside garden - 250 - 1000 m2
* Organic farmer - 1000 m2 +
* Consultant - all of the above
* Reporter - People that want to improve farmOS.org data with our app
>TODO: think everything through with the reporter role
* Anyone who wants to plan a garden by using companion planting.
* People who want to use open source/ open data software.

h3. Describe the relevant and important characteristics of each user.

* All users: consistent harvest throughout the year
* Hobbyist - Not too much labor is better; organic/natural garden
* Countryside garden - Same as Hobbyist, also wants to be self-sufficient
* Organic farmer - Same as Hobbyist, also prioritizing lower labor. Intermixed plants means more labor. Technologically literate, want to use software to improve their yields
* Consultant - Provide advice to other hobbyists/gardeners/farmers
 
h2. Operating Environment

> Describe the environment in which the software will operate, including the hardware platform, operating system and versions, and any other software components or applications with which it must peacefully coexist. In this part, make sure to include a simple diagram that shows the major components of the overall system, subsystem interconnections, and external interface

* Lower range laptop
* Windows 10, Chrome, use in office or garden
* Android x.x.x, Chrome, use in office or garden, but mainly garden
* With temporary internet connection

h2. Design and Implementation Constraints

> Describe any items or issues that will limit the options available to the developers. These might include:
> * hardware limitations (timing requirements, memory requirements)
> * interfaces to other applications
> * specific technologies
> * tools
> * databases to be used
> * language requirements
> * User Documentation

* React for front end with JSX to generate HTML
* SASS for css
* Need to eventually be compatible with FarmOS.
* Need to eventually be compatible with Openfarm.cc.
* Want to be similar to Openfarm crop database structure.
* Want tasks to be similar to FarmOS Log data structure
* Text + photo editors.
* NodeJS as backend engine running ES6
** MongoDB for database with Mongoose as ODM
** Express for route handling
** Passport for user authentication
** Mocha + Chai + supertest for unit testing and integration testing
* Mobile-first, offline-first design (ok, maybe mobile-first, offline-second. they can't both be first)

h2. User Documentation

> TO DO: Describe what kind of manuals and what kind of help is needed for the software you will be developing.
List the user documentation components (such as user manuals, on-line help, and tutorials) that will be delivered along with the software.//

Need to have user documentation. Usability will be severly limited without. Need to have in depth descriptions of how to input data, what screens should look like, how to interpret output. Need to document things before creating them.

* User manual
* FAQ
* First time user prompts
* Community talking points
* Chat rooms (like FarmOS)
* Tutorials for most exemplary tasks (Videos, ...)

h1. Specific Requirements

h2. External Interface Requirements

> TO DO: Describe user interfaces, different screen images, any GUI standards, standard buttons and functions (e.g., Cancel) that will be available to the user. Define error message display standards.

h3. GUI standards

https://material.io/guidelines/
https://medium.com/@marcintreder/the-minimum-viable-design-system-75ca1806848a

* Lots of rounded rectangles to contain components
* Font size standards based on Marvel prototype (maybe change to be based on screen size in the future)
** Main page title: 26pt
** Subtitle: 18pt
** Body text: 14pt
* Sidebar menu accessible from any screen which shows the current location and allows jumping to any screen above it in the hierarchy (All Gardens -> Garden Dashboard -> Bed Dashboard -> Crop)
* Gardens and Beds contain 3 subscreens (fragments?)
** Dashboard, Beds/Crops, Schedule
** Dashboard shows relevant tasks
** Beds/Crops shows all Beds/Crops contained within the Garden/Bed
** Schedule shows history of all past, present, and future crops for the Garden/Bed
* Any time there is a title/heading of an element containing a Garden, Bed, or Crop, it will have a small drop down menu next to it
** Menu items: Edit, delete
** This is the main mechanism by which user can change settings/status of a specific Garden, Bed, or Crop

h3. View Description

"View the prototype! (INCOMPLETE)":https://marvelapp.com/94c4bh4

h2. Log In

*  Username
*  Password
*  reset password
*  register
*  log in facebook/google/github/...

h2. Register

*  Username
*  Password
*  Email (optional)

h2. Create Garden

* name
* location
* climate (calculated with the location)
* default soil type

h2. Add Bed
*  name
*  soil type (preset to default for garden, optional)
*  size (width and length, optional)
*  pre-existing plants (optional)
**  checkbox for selecting empty or plants, then can select plants
*  amount of sun (optional)
*  bed type
*  add bed history
** inputfield of plantname
** planted (optional)
** deceased (optional)

> TODO: add many many more more more more views

h3. Hardware Interfaces

> Describe the logical and physical characteristics of each interface between the software product and the hardware components of the system. This may include, the supported device types, the nature of the data and control interactions between the software and the hardware.

  * 800x400 display
  * 100kB/s
  * 200mb memory on mobile
  * 512mb memory on non-mobile
  * 5mb local storage

h3. Software Interfaces

> TO DO:  Describe: the connections between the product and other specific software components (name and version),  databases,  operating systems (Windows? Linux? Etc…), tools, libraries and integrated commercial components. 

* FarmOS
** FarmOS users can provide the url of their server and save/load all of their data BESIDES crop guides and crop information from there
** There will have to be a moderate amount of translation between powerplant data format and FarmOS data format
** Rather than building a seperate FarmOS module, we will make our web app compatible with FarmOS
** A FarmOS module could be possible, but requires much more time and expertise than it is worth at the moment
* Openfarm.cc
** Openfarm stores CropRelationships, Crop Guides, and Crop Information
** Powerplant users can choose to register their accounts with Openfarm as well
** Users who do this will be able to save/modify this data
** All users (registered or not), while load this data from Openfarm

> TO DO: Identify data items or messages coming into the system and going out and describe the purpose of each. 

* FarmOS specs go here
* openfarm.cc specs go here

> TO DO: Describe the services needed. 

> TO DO: Identify data that will be shared across software components.

* need to look at what FarmOS stores and what we store
 figure out what we can store in FarmOS


h3. Communications Interfaces

TO DO:

1. Describe the requirements associated with any communication functions required by this product, including e-mail, web browser, network server communications protocols, electronic forms. 
2. Define any pertinent message formatting. 

h2. communication standards that will be used, such as FTP or HTTP. 

REST

"Auto-generated API specs":https://github.com/Ecohackerfarm/powerplant/blob/master/docs/spec.md

h4. communication security or encryption issues, data transfer rates, and synchronization mechanisms.

  * Profile could have sensitive info
  * Even in case of (locally) illegal crops being grown, info cannot be accessible by anyone
  * Yield is sensitive
  * Complete transparency within network of gardeners, zero transparency outside
  * low bandwidth because garden usually has bad reception (GPRS traffic)
  * Sync profile data between local and server


h2. Behavior Requirements

h3. Use Case View

> TO DO: Provide a use case diagram which will encapsulate the entire system and all possible actors.

"Workflow Diagram":https://www.draw.io/?state=%7B%22ids%22:%5B%220BwEWI1CO-iYrWnhPV2xJRjZtUkU%22%5D,%22action%22:%22open%22,%22userId%22:%22114282926801448689365%22%7D#G0BwEWI1CO-iYrWnhPV2xJRjZtUkU

> TODO: Create use case diagrams involving each of the possible types of users

h2. List of Use case

h2. Diagram
> TODO: Next time

TODO:
    Convince openfarm to enhance companionship model
