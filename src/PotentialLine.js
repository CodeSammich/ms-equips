import {Col, Dropdown, DropdownButton, Form, InputGroup} from 'react-bootstrap'
import React, {useState} from 'react'

const PotentialLine = (props) => {
  // Handles the state and corresponding selection menu for one Potential/Bonus Potential line
  // props = {potentialLine, setPotentialLine}
  //
  // Essentially, the design principle is that we have our parent (e.g. ItemTooltip) that wants to use render several potential lines.
  // But, each potential line has numerous possible stats. So, we save all possible stats in one single Object {} in one of the parent's hooks
  // and pass the hook var/set pair into props. 
  //
  // Then, this component will handle the selection logic by means of a string (i.e. selectedPotentialLine)

  // The current kind of stat chosen in the potential line 
  const [selectedPotentialLine, setSelectedPotentialLine] = useState(props.name);         // Name displayed (e.g. STR %)
  const [selectedPotentialLineKey, setSelectedPotentialLineKey] = useState('');   // Key used in state (e.g. potentialStrPercent)

  const onChangeSelection = (name, key) => {
    setSelectedPotentialLine(name);
    setSelectedPotentialLineKey(key);
  }

  const onChangeState = (value) => {
    props.setPotentialLine(
      // updates state variable depending on what stat the user chose (selectedPotentialLine)
      {
        ...props.potentialLine,                // ... is deconstructing: copies INSIDE potentialLine object (e.g. key/value pairs, arrays, etc.)
        [selectedPotentialLineKey]: value      //     which results in a duplicate key, so this key is updated.
      }
    )
  };

  return (
    <React.Fragment>
      {/* Save the user's stat selection for future state update */}
      <InputGroup className="sm-3">
        <DropdownButton as={InputGroup.Prepend} size="sm" placeholder={props.name} title={selectedPotentialLine} variant="dark">
          <Dropdown.Item onClick={() => onChangeSelection('STR %', 'potentialStrPercent')}>STR %</Dropdown.Item>
          <Dropdown.Item onClick={() => onChangeSelection('DEX %', 'potentialDexPercent')}>DEX %</Dropdown.Item>
          <Dropdown.Item onClick={() => onChangeSelection('INT %', 'potentialIntPercent')}>INT %</Dropdown.Item>
          <Dropdown.Item onClick={() => onChangeSelection('LUK %', 'potentialLukPercent')}>LUK %</Dropdown.Item>
          <Dropdown.Item onClick={() => onChangeSelection('ALL STAT %', 'potentialAllStatPercent')}>ALL STAT %</Dropdown.Item>
          <Dropdown.Item onClick={() => onChangeSelection('Damage %', 'potentialDmgPercent')}>Damage %</Dropdown.Item>
          <Dropdown.Item onClick={() => onChangeSelection('BOSS %', 'potentialBossDmgPercent')}>BOSS %</Dropdown.Item>
          <Dropdown.Item onClick={() => onChangeSelection('IED %', 'potentialIEDPercent')}>IED %</Dropdown.Item>
          <Dropdown.Item onClick={() => onChangeSelection('ATT %', 'potentialAttPercent')}>ATT %</Dropdown.Item>
          <Dropdown.Item onClick={() => onChangeSelection('MATT %', 'potentialMattPercent')}>MATT %</Dropdown.Item>
          <Dropdown.Item onClick={() => onChangeSelection('HP %', 'potentialHPPercent')}>HP %</Dropdown.Item>
          <Dropdown.Item onClick={() => onChangeSelection('MP %', 'potentialMPPercent')}>MP %</Dropdown.Item>
          <Dropdown.Item onClick={() => onChangeSelection('Critical Rate %', 'potentialCritRatePercent')}>Critical Rate %</Dropdown.Item>
          <Dropdown.Item onClick={() => onChangeSelection('Critical Damage %', 'potentialCritDmgPercent')}>Critical Damage %</Dropdown.Item>
          <Dropdown.Item onClick={() => onChangeSelection('Drop Rate Increase %', 'potentialDropRatePercent')}>Drop Rate Increase %</Dropdown.Item>
          <Dropdown.Item onClick={() => onChangeSelection('Meso Rate Increase %', 'potentialMesoRatePercent')}>Meso Rate Increase %</Dropdown.Item>
          <Dropdown.Item onClick={() => onChangeSelection('+ STR', 'potentialStrFlat')}>+ STR</Dropdown.Item>
          <Dropdown.Item onClick={() => onChangeSelection('+ DEX', 'potentialDexFlat')}>+ DEX</Dropdown.Item>
          <Dropdown.Item onClick={() => onChangeSelection('+ INT', 'potentialIntFlat')}>+ INT</Dropdown.Item>
          <Dropdown.Item onClick={() => onChangeSelection('+ LUK', 'potentialLukFlat')}>+ LUK</Dropdown.Item>
          <Dropdown.Item onClick={() => onChangeSelection('+ ALL STAT', 'potentialAllStatFlat')}>+ ALL STAT</Dropdown.Item>
          <Dropdown.Item onClick={() => onChangeSelection('+ ATT', 'potentialAttFlat')}>+ ATT</Dropdown.Item>
          <Dropdown.Item onClick={() => onChangeSelection('+ MATT', 'potentialMattFlat')}>+ MATT</Dropdown.Item>
          <Dropdown.Item onClick={() => onChangeSelection('+ HP', 'potentialHPFlat')}>+ HP</Dropdown.Item>
          <Dropdown.Item onClick={() => onChangeSelection('+ MP', 'potentialMPFlat')}>+ MP</Dropdown.Item>
          <Dropdown.Item onClick={() => onChangeSelection('Cooldown Reduction', 'potentialCDR')}>Cooldown Reduction</Dropdown.Item>
          <Dropdown.Item onClick={() => onChangeSelection('STR +1 per 10 Character Levels', 'potential1StrPerTenLevel')}>STR +1 per 10 Character Levels</Dropdown.Item>
          <Dropdown.Item onClick={() => onChangeSelection('DEX +1 per 10 Character Levels', 'potential1DexPerTenLevel')}>DEX +1 per 10 Character Levels</Dropdown.Item>
          <Dropdown.Item onClick={() => onChangeSelection('INT +1 per 10 Character Levels', 'potential1IntPerTenLevel')}>INT +1 per 10 Character Levels</Dropdown.Item>
          <Dropdown.Item onClick={() => onChangeSelection('LUK +1 per 10 Character Levels', 'potential1LukPerTenLevel')}>LUK +1 per 10 Character Levels</Dropdown.Item>
          <Dropdown.Item onClick={() => onChangeSelection('STR +2 per 10 Character Levels', 'potential2StrPerTenLevel')}>STR +2 per 10 Character Levels</Dropdown.Item>
          <Dropdown.Item onClick={() => onChangeSelection('DEX +2 per 10 Character Levels', 'potential2DexPerTenLevel')}>DEX +2 per 10 Character Levels</Dropdown.Item>
          <Dropdown.Item onClick={() => onChangeSelection('INT +2 per 10 Character Levels', 'potential2IntPerTenLevel')}>INT +2 per 10 Character Levels</Dropdown.Item>
          <Dropdown.Item onClick={() => onChangeSelection('LUK +2 per 10 Character Levels', 'potential2LukPerTenLevel')}>LUK +2 per 10 Character Levels</Dropdown.Item>
        </DropdownButton>
        {/* Update the earlier chosen state variable with what the user typed in (e.target.value) */}
        {/* Only loads if user actually selects a potential line */}
        { selectedPotentialLine && <Form.Control type="text" value={props.potentialLine[selectedPotentialLine]} onChange={e => onChangeState(e.target.value)}/> }
      </InputGroup>
    </React.Fragment>
  );
};

export default PotentialLine;