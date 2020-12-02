import {Dropdown, DropdownButton, Form, InputGroup} from 'react-bootstrap'
import React, {useEffect, useState} from 'react'

const ScrollsMenu = (props) => {
  // Menu for user to select from list of common scrolls that provide consistent stats (e.g. no Chaos Scrolls).
  //
  // TODO: Look into having picture support inside Dropdown Menu for each kind of scroll?
  const [scrollType, setScrollType] = useState(props.type);    // User Selected Scroll
  const [scrollStat, setScrollStat] = useState(props.stat);    // User Selected Stat for Spell Trace Scrolls
  const [typesMenu, setTypesMenu] = useState(null);            // JSX of Menu for scroll types

  useEffect(() => {
    // Logic handling for what kinds of scrolls are displayed for the user to pick. Hides irrelevant scrolls
    // We use a local array instead of the types hook because we need to set and call the list in the same useEffect(), which are async

    // Scrolls without Item Restrictions
    let scrolls = [
      '30% Spell Trace',
      '70% Spell Trace',
      '100% Spell Trace',
      '9th Anniversary Prime Scroll'
      // NOTE: If you add an scroll to Special Scrolls in scrolls.json, please add scroll name here.
      // Default scrolls are all static stat scrolls from here: https://www.grandislibrary.com/contents/upgrading-enhancing-equipment
    ];

    // Scrolls with Item Restrictions
    // Weapons have 15% Spell Trace
    if (props.category.includes('Weapon') ||
        (props.category == 'Unknown' && props.job == 'Warrior' && !props.itemName.includes('Emblem'))) {    // Adele Weapon lol
          scrolls = ['15% Spell Trace', ...scrolls];
    }

    // Gollux Scrolls
    if (props.itemName.includes('Gollux')) {
      // Basic Gollux Scroll only applies to Cracked and Solid Gollux Accessories
      if (props.itemName.includes('Cracked') || props.itemName.includes('Solid')) {
        scrolls = [...scrolls, 'Basic Gollux Scroll'];
      }
      // Advanced Gollux Scroll only applies to Reinforced and Superior Gollux Accessories
      if (props.itemName.includes('Reinforced') || props.itemName.includes('Superior')) {
        scrolls = [...scrolls, 'Advanced Gollux Scroll'];
      }
    }

    // Dominator Pendant Scrolls
    if (props.itemName == 'Dominator Pendant') {
      scrolls = [...scrolls, 'Fragment of Distorted Time'];
    }

    // Update hook and generate JSX. 
    // Needs to be generated locally b/c if scrolls is a hook, then scrolls may not be updated before map is called.
    setTypesMenu(
      (
        scrolls.map((type) => (
          <Dropdown.Item onClick={() => onSelectType(type)}>
            {type}
          </Dropdown.Item> 
        ))
      )
    );
  }, [props.itemName, props.category])    

  const onSelectStat = (stat) => {
    // update both local and parent state hook to properly update dropdown title
    setScrollStat(stat);
    props.setScrollPrimaryStat(stat);
  };

  const onSelectType = (type) => {
    // update both local and parent state hook to properly update dropdown title
    setScrollType(type);
    props.setScrollType(type);
  };

  useEffect(() => {
    // Reset menu titles upon tooltip refresh
    setScrollType(props.type);
    setScrollStat(props.stat);
  }, [props.id, props.type])  // Resets on new item load or when reset button is pressed

  return (
    <React.Fragment>
      {/* Save the user's scroll selection for stats logic update in ItemTooltip */}
      <InputGroup size="sm">
        {/* Select Type of Scroll (e.g. Spell Trace 15%, Gollux Scroll, etc.). */}
        <DropdownButton as={InputGroup.Prepend} title={scrollType} variant="dark">
          {typesMenu}
        </DropdownButton>

        {/* Select Scroll Stat. Only displayed if user selects a Spell Trace scroll. */}
        {/* Should not be available for items without a stat in the Spell Trace scroll */}
        {
          scrollType.includes('Spell Trace')
          &&
          props.subcategory != 'Glove'
          &&
          props.subcategory != 'Mechanical Heart'
          &&
          <DropdownButton as={InputGroup.Prepend} title={scrollStat} variant="dark">
            {['STR',
              'DEX',
              'INT',
              'LUK',
              'HP'].map((stat) => (
                <Dropdown.Item onClick={() => onSelectStat(stat)}>
                  {stat}
                </Dropdown.Item> 
            ))}
          </DropdownButton>
        }

        {/* Number of slots on equip */}
        <Form.Control type="text" value={props.slots}
          onChange={e => props.setSlots(e.target.value)}/>
        <Form.Control readOnly type="text" value="slots"/>
      </InputGroup>
    </React.Fragment>
  );
};

export default ScrollsMenu;