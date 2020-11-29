# MapleStory Equip Simulator

A GUI for MapleStory equipment damage calculator. The idea is to convert MasteringRobert's [spreadsheet](https://docs.google.com/spreadsheets/d/1mVZerZgojSRKq0FsUco_n097y45EPa4w1QptWuU6mwM/edit#gid=0) and [other similar tools](https://brendonmay.github.io/wseCalculator/) into a more practical GUI.

For example, one conceptual idea is to use a similar GUI to this [cube simulator](https://stripedypaper.github.io/cube/). A user should be able to set their equipment stats and know exactly what their stats and details would be.

The main advantage of this tool is its relatively unintimidating UI. In addition, it may also have the ability to extend functionality to more advanced features, like damage calculation, skill rotations, image-based equipment input, projected damage against various mobs, etc.

Overall goal: reduce player knowledge needed to calculate damage + automate as much as possible + simplify UI into step-by-step

# Why use this instead of spreadsheet and other tools?

- Potential for advanced functionality (screenshot inputs)
- Dynamic skill rotation calculations for damage, etc.
- Projected damage against actual mobs

# Todo:

## Minimum Viable Product (MVP)

### Equipment Search / Stats Configuration

- [x] Access the maplestory.io API and search for only equipment data and images
- [x] Sort those images/data into a search bar
- [x] For each equipment, display stats in simple layout
- [ ] Allow users to add any "configurable" stats (stars, potentials, flames, scrolls) to each equipment
- [ ] Allow users to "equip" the items and to see what items they have equipped
- [ ] Create important damage categories and calculate range, stats, etc.

### Website Layout

- [x] Create simple header with region select
- [ ] Create Dark Mode (switch all buttons from primary to dark and change background image)
- [ ] Make header less transparent or simply solid color to avoid text overlap confusion
- [ ] Automatically determine latest version number based on region or set it manually in the header
- [ ] Set two tabs, one for equip configuration/search and one for overall views/total range window. One idea is [React Bootstrap Tabs](https://react-bootstrap.github.io/components/tabs/)
- [ ] Produce a simple footer with Twitch/YT/Github links + space for more tools
- [ ] Make form simple step-by-step (one input section at a time) to make users less scared
- [ ] Adjust inputs/website layouts displayed based on user situation: Class, Server, Region. (i.e. hide stats that are not relevant for the user)
- [ ] Hide irrelevant information per equip (e.g. thief equips don't have int, rings can't get %damage)
- [ ] Have a flame number input checker (to make sure flame inputted is a valid configuration for flame)
- [ ] Gear Presets for easier UI access

### Defensive Programming

- [ ] Make sure all form inputs are properly cleaned and standard defensive techniques are used for all Forms / Buttons

# Optional Augmentations

- [ ] Augment searchbar with an inventory UI
- [ ] Generate several pages of items, instead of just 5 items on one page
- [ ] Copy the in-game UI or improve general layouts/readability for equipment window, inventory window, and tooltip (for search)
- [ ] Make sure that the components render properly and are spaced properly on various resolutions (especially half-screen / mobile)
- [ ] Improve search functionality by including more domain knowledge (e.g. common terms, category search, etc.)

# Advanced Functionality

- [ ] Support for [Familiars](https://github.com/PirateIzzy/WzComparerR2), Links, Legion/Union, etc.
- [ ] Average DPM / projected Dojo floor? Basically "mechanically dependent" tool. Maybe ask user to input a sequence of skills and compare various skill rotations to optimize DPM
- [ ] Translate the website into the region's language (e.g. KMS -> Korean)
- [ ] Screenshot gear to auto input for gear
- [ ] Include Oz rings, party composition, skill rotation damage calculation
- [ ] Projected nerfs/buffs effect on classes
- [ ] What bosses can you currently do? How much time can you spend not attacking?
- [ ] What is the next equip upgrade you can feasibly make? (given user's dedication to game)
