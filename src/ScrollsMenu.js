import {Dropdown, DropdownButton, Form, InputGroup} from 'react-bootstrap'
import React, {useEffect, useState} from 'react'

const ScrollsMenu = (props) => {
  // Menu for user to select from list of common scrolls that provide consistent stats (e.g. no Chaos Scrolls).
  //
  // Currently supports: Spell Traces
  //
  // TODO: Add support for Gollux Scrolls, 9th Anniversary Prime Scrolls
  //       Remember to update logic in calculateScrollStats() in ItemTooltip
  //
  // TODO: Remove options that are not relevant to item. (e.g. 15% Spell Trace for non-weapons, Gollux for non-gollux)
  //
  // TODO: Look into having picture support inside Dropdown Menu for each kind of scroll?
  const [scrollType, setScrollType] = useState(props.type);
  const [scrollStat, setScrollStat] = useState(props.stat);

  const onSelectStat = (stat) => {
    // update both local and parent state hook to properly update dropdown title
    setScrollStat(stat);
    props.setPrimaryStat(stat);
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
        {/* Select Scroll Success Rate. */}
        <DropdownButton as={InputGroup.Prepend} title={scrollType} variant="dark">
          {['15% Spell Trace',
            '30% Spell Trace',
            '70% Spell Trace',
            '100% Spell Trace'].map((type) => (
              <Dropdown.Item onClick={() => onSelectType(type)}>
                {type}
              </Dropdown.Item> 
          ))}
        </DropdownButton>

        {/* Select Scroll Stat. Only displayed if user selects a Spell Trace scroll. */}
        {
          scrollType.includes('Spell Trace')
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