import {Button, Col, Dropdown, DropdownButton, Form, FormControl, FormGroup, FormLabel, FormText, InputGroup, Text} from 'react-bootstrap'
import {REGION, VERSION} from './Search'
import React, { useEffect, useState } from 'react'

import PotentialLine from './PotentialLine'

const queryItemStats = (region, version, itemID) => {
  // Queries maplestory.io API for detailed item information
  // including the stats listed below, icons, etc.
  let url = `https://maplestory.io/api/${region}/${version}/item/${itemID}`;
  encodeURI(url);
  return fetch(url);
}

const ItemTooltip = (props) => {
  // Design note:
  //
  // ItemTooltip simply stores the stats as needed by the Item tooltip itself.
  // This may include a breakdown of base, scroll, flame, and star force stats.
  //
  // Therefore, this component does not inherently calculate any stats
  // (e.g. a potential's effect on a stat)
  //
  // However, the user should be able to select stats/properties with ease.
  // 
  // Potentials: a small set of handpicked lines + user input for the number
  //     e.g. <user> %LUK
  //          <user> %LUK
  //          <user> %LUK
  //     stored value: sum of user inputs
  //
  // Star Force: user input for the number of stars and stats are calculated based on
  //             known formula for stats per star for each equipment level
  //
  // Flames / Bonus Stats: user input entirely
  //    e.g. 48 LUK / 6% stat 
  //
  // Scrolls: user should be able to pick out of a list of common scrolls
  //          OR
  //          custom input their desired scrolling stats (e.g. Chaos scrolls)
  //
  // As a user types in more information, the form should auto-generate the appropriate stats.
  //
  // TODO: Cooldown Reduction potential lines should also be added in case we do a damage calculator in the future.

  // General Information
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [requiredLevel, setRequiredLevel] = useState(0);
  const [attackSpeed, setAttackSpeed] = useState(0);
  const [exclusiveEquip, setExclusiveEquip] = useState(false); // can only equip 1 at a time
  const [slots, setSlots] = useState(0);                       // TODO: further testing after region support to make sure value is updated at the right time 
  const [hammers, setHammers] = useState(2);                   // TODO: change this beyond GMS default for all regions
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');

  // User Interface Specific Variables
  // TODO: Make sure to include state(s) user friendly selection options for various scrolls
  const [starForce, setStarForce] = useState(0);

  // Non-potential Stats
  // Strength
  const [baseStr, setBaseStr] = useState(0);
  const [flameStr, setFlameStr] = useState(0);
  const [starStr, setStarStr] = useState(0);
  const [scrollStr, setScrollStr] = useState(0);

  // Dexterity
  const [baseDex, setBaseDex] = useState(0);
  const [flameDex, setFlameDex] = useState(0);
  const [starDex, setStarDex] = useState(0);
  const [scrollDex, setScrollDex] = useState(0);

  // Intelligence
  const [baseInt, setBaseInt] = useState(0);
  const [flameInt, setFlameInt] = useState(0);
  const [starInt, setStarInt] = useState(0);
  const [scrollInt, setScrollInt] = useState(0);

  // Luck
  const [baseLuk, setBaseLuk] = useState(0);
  const [flameLuk, setFlameLuk] = useState(0);
  const [starLuk, setStarLuk] = useState(0);
  const [scrollLuk, setScrollLuk] = useState(0);

  // All Stat
  const [flameAllStatPercent, setFlameAllStatPercent] = useState(0);

  // Attack
  const [baseAtt, setBaseAtt] = useState(0);
  const [flameAtt, setFlameAtt] = useState(0);
  const [starAtt, setStarAtt] = useState(0);
  const [scrollAtt, setScrollAtt] = useState(0);

  // Magic Attack
  const [baseMatt, setBaseMatt] = useState(0);
  const [flameMatt, setFlameMatt] = useState(0);
  const [starMatt, setStarMatt] = useState(0);
  const [scrollMatt, setScrollMatt] = useState(0);

  // Health Points
  const [baseHP, setBaseHP] = useState(0);
  const [flameHP, setFlameHP] = useState(0);
  const [starHP, setStarHP] = useState(0);
  const [scrollHP, setScrollHP] = useState(0);

  // Mana Points
  const [baseMP, setBaseMP] = useState(0);
  const [flameMP, setFlameMP] = useState(0);
  const [starMP, setStarMP] = useState(0);
  const [scrollMP, setScrollMP] = useState(0);

  // Damage Percent
  const [baseDmgPercent, setBaseDmgPercent] = useState(0);
  const [flameDmgPercent, setFlameDmgPercent] = useState(0);

  // Boss Damage Percent
  const [baseBossDmgPercent, setBaseBossDmgPercent] = useState(0);
  const [flameBossDmgPercent, setFlameBossDmgPercent] = useState(0);

  // Ignore Enemy Defense
  const [baseIEDPercent, setBaseIEDPercent] = useState(0);
  const [flameIEDPercent, setFlameIEDPercent] = useState(0);

  // Initial state to store Potentials. This also applies equally to Bonus Potentials
  // Primarily for use in child component PotentialLine, because there are very many menu items that need to be selected
  // So the state inside the child component is handling all permutations of potential settings
  // while rendering as few Dropdown/Control components as possible.
  //
  // tldr; Separating into separate component because there will only ever be 6 potentials that use only a subset of these fields.
  let initialPotentialState = {
    // Potential Stats
    // Percent Stats
    potentialStrPercent: 0,
    potentialDexPercent: 0,
    potentialIntPercent: 0,
    potentialLukPercent: 0,
    potentialAllStatPercent: 0,
    potentialDmgPercent: 0,
    potentialBossDmgPercent: 0,
    potentialIEDPercent: 0,
    potentialAttPercent: 0,
    potentialMattPercent: 0,
    potentialHPPercent: 0,
    potentialMPPercent: 0,
    potentialCritRatePercent: 0,
    potentialCritDmgPercent: 0,
    potentialDropRatePercent: 0,
    potentialMesoRatePercent: 0,
    // Flat Stats
    potentialStrFlat: 0,
    potentialDexFlat: 0,
    potentialIntFlat: 0,
    potentialLukFlat: 0,
    potentialAllStatFlat: 0,
    potentialAttFlat: 0,
    potentialMattFlat: 0,
    potentialHPFlat: 0,
    potentialMPFlat: 0,
    // Special Stats
    potentialCDR: 0,
    // Special Stats only for Bonus Potential
    potential1StrPerTenLevel: 0,
    potential1DexPerTenLevel: 0,
    potential1IntPerTenLevel: 0,
    potential1LukPerTenLevel: 0,
    potential2StrPerTenLevel: 0,
    potential2DexPerTenLevel: 0,
    potential2IntPerTenLevel: 0,
    potential2LukPerTenLevel: 0
  };

  // Helper Functions / Variables
  // Potential / Bonus Potential states
  //
  // Should hold all the possible potential stat in 1 state which PotentialLine
  // can update based on what stat the user chose
  const [potentialLine1, setPotentialLine1] = useState(initialPotentialState);
  const [potentialLine2, setPotentialLine2] = useState(initialPotentialState);
  const [potentialLine3, setPotentialLine3] = useState(initialPotentialState);
  const [bonusPotentialLine1, setBonusPotentialLine1] = useState(initialPotentialState);
  const [bonusPotentialLine2, setBonusPotentialLine2] = useState(initialPotentialState);
  const [bonusPotentialLine3, setBonusPotentialLine3] = useState(initialPotentialState);

  // Soul Stats
  // TODO: how to categorize this? May have to invent a separate category for this...
  const [soulStats, setSoulStats] = useState(0);

  // Toggle to force useEffect() to re-run and reset all the states
  const [isReset, setIsReset] = useState(false);
  const resetAllStates = () => {
    console.log("Component states have been reset");

    // General Information
    setName('');
    setImageUrl('');
    setRequiredLevel(0);
    setAttackSpeed(0);
    setExclusiveEquip(false); // can only equip 1 at a time
    setSlots(0);                      
    setHammers(2);                   
    setCategory('');
    setSubcategory('');

    // User Interface Specific Variables
    // TODO: Make sure to include state(s) user friendly selection options for various scrolls
    setStarForce(0);

    // Non-potential Stats
    // Strength
    setBaseStr(0);
    setFlameStr(0);
    setStarStr(0);
    setScrollStr(0);

    // Dexterity
    setBaseDex(0);
    setFlameDex(0);
    setStarDex(0);
    setScrollDex(0);

    // Intelligence
    setBaseInt(0);
    setFlameInt(0);
    setStarInt(0);
    setScrollInt(0);

    // Luck
    setBaseLuk(0);
    setFlameLuk(0);
    setStarLuk(0);
    setScrollLuk(0);

    // All Stat % Flame
    setFlameAllStatPercent(0);

    // Attack
    setBaseAtt(0);
    setFlameAtt(0);
    setStarAtt(0);
    setScrollAtt(0);

    // Magic Attack
    setBaseMatt(0);
    setFlameMatt(0);
    setStarMatt(0);
    setScrollMatt(0);

    // Health Points
    setBaseHP(0);
    setFlameHP(0);
    setStarHP(0);
    setScrollHP(0);

    // Mana Points
    setBaseMP(0);
    setFlameMP(0);
    setStarMP(0);
    setScrollMP(0);

    // Damage Percent
    setBaseDmgPercent(0);
    setFlameDmgPercent(0);

    // Boss Damage Percent
    setBaseBossDmgPercent(0);
    setFlameBossDmgPercent(0);

    // Ignore Enemy Defense
    setBaseIEDPercent(0);
    setFlameIEDPercent(0);

    // Potentials
    setPotentialLine1(initialPotentialState);
    setPotentialLine2(initialPotentialState);
    setPotentialLine3(initialPotentialState);
    setBonusPotentialLine1(initialPotentialState);
    setBonusPotentialLine2(initialPotentialState);
    setBonusPotentialLine3(initialPotentialState);

    // Soul Stats
    setSoulStats(0);

    setIsReset(false);
  };

  const changeHammerDependingOnRegion = () => {
    // Each region has different maximum hammer slots
    // Called separately because state may not be updated in time for scrolls state.
    if (props.region === 'KMS') {
      setHammers(1);
    } else if (props.region === 'GMS' || props.region === 'MSEA' || props.region === 'CMS') {
      setHammers(2);
    } else if (props.region === 'TMS') {
      // TMS has 5 "silver hammers" + 1 "golden hammer"
      setHammers(6);
    }
    console.log('region is set and hammers is updated');
  }

  useEffect(() => {
    // Reset all the states since a new item was loaded
    resetAllStates();

    // Update Hammer information
    changeHammerDependingOnRegion();

    // Load the basic item information from API and set the new state information
    queryItemStats(props.region, props.version, props.itemID)
      .then(response => response.json())
      .then(item => {
        // Update General Information
        setName(item.description.name);
        setRequiredLevel(item.metaInfo.reqLevel);
        setAttackSpeed(item.metaInfo.attackSpeed);
        setExclusiveEquip(item.metaInfo.only);    // unsure if "only" is the right flag
        setCategory(item.typeInfo.category);
        setSubcategory(item.typeInfo.subCategory);
        setSlots(item.metaInfo.tuc + hammers);

        // Update Base Stats
        setBaseStr(item.metaInfo.incSTR); 
        setBaseDex(item.metaInfo.incDEX);
        setBaseInt(item.metaInfo.incINT); 
        setBaseLuk(item.metaInfo.incLUK);
        setBaseHP(item.metaInfo.incMHP); 
        setBaseMP(item.metaInfo.incMMP);
        setBaseAtt(item.metaInfo.incPAD); 
        setBaseMatt(item.metaInfo.incMAD);
        setBaseBossDmgPercent(item.metaInfo.bdR);
        setBaseIEDPercent(item.metaInfo.imdR);
      });

    // Load the item image directly from link
    setImageUrl(`https://maplestory.io/api/${REGION}/${VERSION}/item/${props.itemID}/icon`);
  }, [props.itemID, props.region, isReset]);

  return (
    <div>
      <Form>
        <FormGroup>
          {/* Image, Name, Reset Button */}
          <Form.Row>
            <Col xs={1} sm={1} md={1} lg={1} xl={1}>
              <img className="body-large-icons" src={imageUrl} />
            </Col>
            <Col xs={9} sm={9} md={9} lg={9} xl={9}>
              <h1>{name}</h1>
            </Col>
            {/* Reset Button toggles Reset boolean to trigger useEffect() */}
            <Col xs={1} sm={1} md={1} lg={1} xl={1}>
              <Button onClick={e => setIsReset(true)}>
                Reset 
              </Button>
            </Col>
          </Form.Row>

          {/* Required Level / Attack Speed / Unique Equip / Item Category */}
          <Form.Row>
            <Col>
              <FormLabel> Level </FormLabel>
              <Form.Control readOnly size="sm" type="text" value={requiredLevel}/>
            </Col>
            <Col>
              <FormLabel> Attack Speed </FormLabel>
              <Form.Control readOnly size="sm" type="text" value={attackSpeed}/>
            </Col>
            <Col>
              <FormLabel> Unique Equip </FormLabel>
              <Form.Control readOnly size="sm" type="text" value={exclusiveEquip}/>
            </Col>
            <Col>
              <FormLabel> Category </FormLabel>
              <Form.Control readOnly size="sm" type="text" value={category}/>
            </Col>
            <Col>
              <FormLabel> Subcategory </FormLabel>
              <Form.Control readOnly size="sm" type="text" value={subcategory}/>
            </Col>
          </Form.Row>

          {/* Star Force + num/kind of scrolls/hammers applied */}
          <Form.Row>
            <Col>
              <FormLabel> Star Force </FormLabel>
              <Form.Control size="sm" type="text" value={starForce} onChange={e => setStarForce(e.target.value)}/>
            </Col>
            <Col>
              <FormLabel> Scrolls Applied </FormLabel>
              <Form.Control size="sm" type="text" value={slots} onChange={e => setSlots(e.target.value)}/>
            </Col>
            {/* TODO: Include different kinds of scrolls options here */}
          </Form.Row>

          {/* Stats Window => Base | Flame | Star Force | Scrolling */}
          <Form.Row>
            <Col xs={1} sm={1} md={1} lg={1} xl={2}>
              {/* Left-hand description of various stats */}
              <FormLabel size="sm"> Stats </FormLabel>
              <Form.Control readOnly size="sm" type="text" value="STR"/>
              <Form.Control readOnly size="sm" type="text" value="DEX"/>
              <Form.Control readOnly size="sm" type="text" value="INT"/>
              <Form.Control readOnly size="sm" type="text" value="LUK"/>
              <Form.Control readOnly size="sm" type="text" value="ATT"/>
              <Form.Control readOnly size="sm" type="text" value="MATT"/>
              <Form.Control readOnly size="sm" type="text" value="HP"/>
              <Form.Control readOnly size="sm" type="text" value="MP"/>
              <Form.Control readOnly size="sm" type="text" value="DMG%"/>
              <Form.Control readOnly size="sm" type="text" value="BOSS%"/>
              <Form.Control readOnly size="sm" type="text" value="IED"/>
              <Form.Control readOnly size="sm" type="text" value="All Stat %"/>
            </Col>
            <Col>
              <FormLabel> Base </FormLabel>
              <Form.Control readOnly size="sm" type="text" value={baseStr}/>
              <Form.Control readOnly size="sm" type="text" value={baseDex}/>
              <Form.Control readOnly size="sm" type="text" value={baseInt}/>
              <Form.Control readOnly size="sm" type="text" value={baseLuk}/>
              <Form.Control readOnly size="sm" type="text" value={baseAtt}/>
              <Form.Control readOnly size="sm" type="text" value={baseMatt}/>
              <Form.Control readOnly size="sm" type="text" value={baseHP}/>
              <Form.Control readOnly size="sm" type="text" value={baseMP}/>
              <Form.Control readOnly size="sm" type="text" value={baseDmgPercent}/>
              <Form.Control readOnly size="sm" type="text" value={baseBossDmgPercent}/>
              <Form.Control readOnly size="sm" type="text" value={baseIEDPercent}/>
              {/* All Stat % doesn't actually exist as a base stat in any equip, but I'm leaving it here for aesthetic purposes. */}
              <Form.Control readOnly size="sm" type="text" value={0}/> 
            </Col>
            <Col>
              <FormLabel> Flames </FormLabel>
              <Form.Control size="sm" type="text" value={flameStr} onChange={e => setFlameStr(e.target.value)}/>
              <Form.Control size="sm" type="text" value={flameDex} onChange={e => setFlameDex(e.target.value)}/>
              <Form.Control size="sm" type="text" value={flameInt} onChange={e => setFlameInt(e.target.value)}/>
              <Form.Control size="sm" type="text" value={flameLuk} onChange={e => setFlameLuk(e.target.value)}/>
              <Form.Control size="sm" type="text" value={flameAtt} onChange={e => setFlameAtt(e.target.value)}/>
              <Form.Control size="sm" type="text" value={flameMatt} onChange={e => setFlameMatt(e.target.value)}/>
              <Form.Control size="sm" type="text" value={flameHP} onChange={e => setFlameHP(e.target.value)}/>
              <Form.Control size="sm" type="text" value={flameMP} onChange={e => setFlameMP(e.target.value)}/>
              <Form.Control size="sm" type="text" value={flameDmgPercent} onChange={e => setFlameDmgPercent(e.target.value)}/>
              <Form.Control size="sm" type="text" value={flameBossDmgPercent} onChange={e => setFlameBossDmgPercent(e.target.value)}/>
              <Form.Control size="sm" type="text" value={flameIEDPercent} onChange={e => setFlameIEDPercent(e.target.value)}/>
              <Form.Control size="sm" type="text" value={flameAllStatPercent} onChange={e => setFlameAllStatPercent(e.target.value)}/>
            </Col>
            <Col>
              <FormLabel> Star Force </FormLabel>
              <Form.Control readOnly size="sm" type="text" value={starStr}/>
              <Form.Control readOnly size="sm" type="text" value={starDex}/>
              <Form.Control readOnly size="sm" type="text" value={starInt}/>
              <Form.Control readOnly size="sm" type="text" value={starLuk}/>
              <Form.Control readOnly size="sm" type="text" value={starAtt}/>
              <Form.Control readOnly size="sm" type="text" value={starMatt}/>
              <Form.Control readOnly size="sm" type="text" value={starHP}/>
              <Form.Control readOnly size="sm" type="text" value={starMP}/>
            </Col>
            <Col>
              <FormLabel> Scrolls </FormLabel>
              <Form.Control size="sm" type="text" value={scrollStr} onChange={e => setScrollStr(e.target.value)}/>
              <Form.Control size="sm" type="text" value={scrollDex} onChange={e => setScrollDex(e.target.value)}/>
              <Form.Control size="sm" type="text" value={scrollInt} onChange={e => setScrollInt(e.target.value)}/>
              <Form.Control size="sm" type="text" value={scrollLuk} onChange={e => setScrollLuk(e.target.value)}/>
              <Form.Control size="sm" type="text" value={scrollAtt} onChange={e => setScrollAtt(e.target.value)}/>
              <Form.Control size="sm" type="text" value={scrollMatt} onChange={e => setScrollMatt(e.target.value)}/>
              <Form.Control size="sm" type="text" value={scrollHP} onChange={e => setScrollHP(e.target.value)}/>
              <Form.Control size="sm" type="text" value={scrollMP} onChange={e => setScrollMP(e.target.value)}/>
            </Col>
          </Form.Row>

          {/* Potential, Bonus Potential */}
          <Form.Row>
            <Col>
              <FormLabel> Potential </FormLabel>
              <PotentialLine 
                name = 'Line 1'
                potentialLine = {potentialLine1}
                setPotentialLine = {setPotentialLine1}
              />
              <PotentialLine 
                name = 'Line 2'
                potentialLine = {potentialLine2}
                setPotentialLine = {setPotentialLine2}
              />
              <PotentialLine 
                name = 'Line 3'
                potentialLine = {potentialLine3}
                setPotentialLine = {setPotentialLine3}
              />
            </Col>
            <Col>
              <FormLabel> Bonus Potential </FormLabel>
              <PotentialLine 
                name = 'Line 1'
                potentialLine = {bonusPotentialLine1}
                setPotentialLine = {setBonusPotentialLine1}
              />
              <PotentialLine 
                name = 'Line 2'
                potentialLine = {bonusPotentialLine2}
                setPotentialLine = {setBonusPotentialLine2}
              />
              <PotentialLine 
                name = 'Line 3'
                potentialLine = {bonusPotentialLine3}
                setPotentialLine = {setBonusPotentialLine3}
              />
            </Col>
          </Form.Row>

          {/* Soul Weapon, if applicable */}
          <Form.Row>

          </Form.Row>
        </FormGroup>
      </Form>
    </div>
  );
}

export default ItemTooltip;