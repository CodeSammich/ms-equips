import React, { useState, useEffect } from 'react'
import {Form, Col, FormLabel, FormText, FormGroup, FormControl, Button } from 'react-bootstrap'
import {REGION, VERSION} from './Search'

const queryItemStats = (itemID) => {
  // Queries maplestory.io API for detailed item information
  // including the stats listed below, icons, etc.
  const url = `https://maplestory.io/api/${REGION}/${VERSION}/item/${itemID}`;
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

  // General Information
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [requiredLevel, setRequiredLevel] = useState(0);
  const [attackSpeed, setAttackSpeed] = useState(0);
  const [exclusiveEquip, setExclusiveEquip] = useState(false); // can only equip 1 at a time
  const [slots, setSlots] = useState(0); 
  const [hammers, setHammers] = useState(0); 
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

  // Potential Stats
  // Percent Stats
  const [potentialStrPercent, setPotentialStrPercent] = useState(0);
  const [potentialDexPercent, setPotentialDexPercent] = useState(0);
  const [potentialIntPercent, setPotentialIntPercent] = useState(0);
  const [potentialLukPercent, setPotentialLukPercent] = useState(0);
  const [potentialAllStatPercent, setPotentialAllStatPercent] = useState(0);
  const [potentialDmgPercent, setPotentialDmgPercent] = useState(0);
  const [potentialBossDmgPercent, setPotentialBossDmgPercent] = useState(0);
  const [potentialIEDPercent, setPotentialIEDPercent] = useState(0);
  const [potentialAttPercent, setPotentialAttPercent] = useState(0);
  const [potentialMattPercent, setPotentialMattPercent] = useState(0);
  const [potentialHPPercent, setPotentialHPPercent] = useState(0);
  const [potentialMPPercent, setPotentialMPPercent] = useState(0);
  const [potentialCritRatePercent, setPotentialCritRatePercent] = useState(0);
  const [potentialCritDmgPercent, setPotentialCritDmgPercent] = useState(0);
  const [potentialDropRatePercent, setPotentialDropRatePercent] = useState(0);
  const [potentialMesoRatePercent, setPotentialMesoRatePercent] = useState(0);
  // Flat Stats
  const [potentialStrFlat, setPotentialStrFlat] = useState(0);
  const [potentialDexFlat, setPotentialDexFlat] = useState(0);
  const [potentialIntFlat, setPotentialIntFlat] = useState(0);
  const [potentialLukFlat, setPotentialLukFlat] = useState(0);
  const [potentialAllStatFlat, setPotentialAllStatFlat] = useState(0);
  const [potentialDmgFlat, setPotentialDmgFlat] = useState(0);
  const [potentialBossDmgFlat, setPotentialBossDmgFlat] = useState(0);
  const [potentialIEDFlat, setPotentialIEDFlat] = useState(0);
  const [potentialAttFlat, setPotentialAttFlat] = useState(0);
  const [potentialMattFlat, setPotentialMattFlat] = useState(0);
  const [potentialHPFlat, setPotentialHPFlat] = useState(0);
  const [potentialMPFlat, setPotentialMPFlat] = useState(0);

  // Bonus Potential Stats
  // Percent Stats
  const [bonusPotentialStrPercent, setBonusPotentialStrPercent] = useState(0);
  const [bonusPotentialDexPercent, setBonusPotentialDexPercent] = useState(0);
  const [bonusPotentialIntPercent, setBonusPotentialIntPercent] = useState(0);
  const [bonusPotentialLukPercent, setBonusPotentialLukPercent] = useState(0);
  const [bonusPotentialAllStatPercent, setBonusPotentialAllStatPercent] = useState(0);
  const [bonusPotentialDmgPercent, setBonusPotentialDmgPercent] = useState(0);
  const [bonusPotentialBossDmgPercent, setBonusPotentialBossDmgPercent] = useState(0);
  const [bonusPotentialIEDPercent, setBonusPotentialIEDPercent] = useState(0);
  const [bonusPotentialAttPercent, setBonusPotentialAttPercent] = useState(0);
  const [bonusPotentialMattPercent, setBonusPotentialMattPercent] = useState(0);
  const [bonusPotentialHPPercent, setBonusPotentialHPPercent] = useState(0);
  const [bonusPotentialMPPercent, setBonusPotentialMPPercent] = useState(0);
  const [bonusPotentialCritRatePercent, setBonusPotentialCritRatePercent] = useState(0);
  const [bonusPotentialCritDmgPercent, setBonusPotentialCritDmgPercent] = useState(0);
  const [bonusPotentialDropRatePercent, setBonusPotentialDropRatePercent] = useState(0);
  const [bonusPotentialMesoRatePercent, setBonusPotentialMesoRatePercent] = useState(0);
  // Flat Stats
  const [bonusPotentialStrFlat, setBonusPotentialStrFlat] = useState(0);
  const [bonusPotentialDexFlat, setBonusPotentialDexFlat] = useState(0);
  const [bonusPotentialIntFlat, setBonusPotentialIntFlat] = useState(0);
  const [bonusPotentialLukFlat, setBonusPotentialLukFlat] = useState(0);
  const [bonusPotentialAllStatFlat, setBonusPotentialAllStatFlat] = useState(0);
  const [bonusPotentialDmgFlat, setBonusPotentialDmgFlat] = useState(0);
  const [bonusPotentialBossDmgFlat, setBonusPotentialBossDmgFlat] = useState(0);
  const [bonusPotentialIEDFlat, setBonusPotentialIEDFlat] = useState(0);
  const [bonusPotentialAttFlat, setBonusPotentialAttFlat] = useState(0);
  const [bonusPotentialMattFlat, setBonusPotentialMattFlat] = useState(0);
  const [bonusPotentialHPFlat, setBonusPotentialHPFlat] = useState(0);
  const [bonusPotentialMPFlat, setBonusPotentialMPFlat] = useState(0);

  // Soul Stats
  // TODO: how to categorize this? May have to invent a separate category for this...
  const [soulStats, setSoulStats] = useState(0);

  // If no second arg provided, then it will run first time + after any subsequent DOM changes
  // If second argument is provided, it will only run if that argument is not null.
  useEffect(() => {
    // Load the basic item information from API
    queryItemStats(props.itemID)
      .then(response => response.json())
      .then(item => {
        // Update General Information
        setName(item.description.name);
        setRequiredLevel(item.metaInfo.reqLevel);
        // Each region has different maximum hammer slots
        if (REGION == 'KMS') {
          setHammers(1);
        } else if (REGION == 'GMS' || REGION == 'MSEA' || REGION == 'CMS') {
          setHammers(2);
        } else if (REGION == 'TMS') {
          // TMS has 5 "silver hammers" + 1 "golden hammer"
          setHammers(6);
        }
        setSlots(item.metaInfo.tuc + hammers);
        setAttackSpeed(item.metaInfo.attackSpeed);
        setExclusiveEquip(item.metaInfo.only);    // unsure if "only" is the right flag
        setCategory(item.typeInfo.category);
        setSubcategory(item.typeInfo.subCategory);

        // Update Base Stats
        setBaseStr(item.metaInfo.incStr); 
        setBaseDex(item.metaInfo.incDex);
        setBaseInt(item.metaInfo.incInt); 
        setBaseLuk(item.metaInfo.incLuk);
        setBaseHP(item.metaInfo.incHP); 
        setBaseMP(item.metaInfo.incMP);
        setBaseAtt(item.metaInfo.incPAD); 
        setBaseMatt(item.metaInfo.incMAD);
      });

    // Load the item image directly from link
    setImageUrl(`https://maplestory.io/api/${REGION}/${VERSION}/item/${props.itemID}/icon`);

    // Update state with base stats accordingly

    // Account for user adjustable parameters (likely in return)
    // Don't forget that users should just adjust large knobs (e.g. Star Force, flames, etc.)
  }, [props.itemID]);

  return (
    <div>
      <Form>
        <FormGroup>
          {/* Item Name */}
          <Form.Row>
            <Col>
              <Form.Control>
                placeholder="Item Name"
              </Form.Control>
            </Col>
          </Form.Row>
          {/* Item Image / Required Level / Item Category */}
          <Form.Row>

          </Form.Row>
          {/* Star Force */}
          <Form.Row>

          </Form.Row>
          {/* Stats Window => Base | Flame | Star Force | Scrolling */}
          <Form.Row>

          </Form.Row>
          {/* Number/kind of scrolls applied and number of hammers applied */}
          <Form.Row>

          </Form.Row>
          {/* Potential */}
          <Form.Row>

          </Form.Row>
          {/* Bonus Potential */}
          <Form.Row>

          </Form.Row>
          {/* Soul Weapon, if applicable */}
          <Form.Row>

          </Form.Row>
        </FormGroup>
      </Form>
        {name}
        <img src={imageUrl} />
    </div>
  );
}

export default ItemTooltip;