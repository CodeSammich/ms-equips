# MapleStory Equip Simulator

A GUI for MapleStory equipment damage calculator. The idea is to convert MasteringRobert's [spreadsheet](https://docs.google.com/spreadsheets/d/1mVZerZgojSRKq0FsUco_n097y45EPa4w1QptWuU6mwM/edit#gid=0) into a more practical GUI.

For example, one conceptual idea is to use a similar GUI to this [cube simulator](https://stripedypaper.github.io/cube/). A user should be able to set their equipment stats and know exactly what their stats and details would be.

# Todo:

## Minimum Viable Product (MVP)

### Equipment Search / Stats Configuration

- [x] Access the maplestory.io API and search for only equipment data and images
- [x] Sort those images/data into a search bar
- [x] For each equipment, display stats in simple layout
- [ ] Allow users to add any "configurable" stats (stars, potentials, flames, scrolls) to each equipment

### Range/Equipment Window

- [ ] Allow users to "equip" the items and to see what items they have equipped
- [ ] Create important damage categories and calculate range, stats, etc.

### Website Layout

- [x] Create simple header with region select
- [ ] Automatically determine latest version number based on region or set it manually in the header
- [ ] Set two tabs, one for equip configuration/search and one for overall views/total range window. One idea is [React Bootstrap Tabs](https://react-bootstrap.github.io/components/tabs/)
- [ ] Produce a simple footer with Twitch/YT/Github links + space for more tools

### Defensive Programming

- [ ] Make sure all form inputs are properly cleaned and standard defensive techniques are used for all Forms / Buttons

# Backlog

- [ ] Augment searchbar with an inventory UI
- [ ] Generate several pages of items, instead of just 5 items on one page
- [ ] Copy the in-game UI or improve general layouts/readability for equipment window, inventory window, and tooltip (for search)
- [ ] Make sure that the components render properly and are spaced properly on various resolutions (especially half-screen / mobile)
- [ ] Improve search functionality by including more domain knowledge (e.g. common terms, category search, etc.)

# Future Ideas

- [ ] Support for Familiars, Links, Legion/Union, etc.
- [ ] Average DPM / projected Dojo floor? Basically "mechanically dependent" tool. Maybe ask user to input a sequence of skills and compare various skill rotations to optimize DPM
- [ ] Translate the website into the region's language (e.g. KMS -> Korean)
