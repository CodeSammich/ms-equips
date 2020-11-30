import {Button, Col, Form, FormGroup, FormLabel} from 'react-bootstrap'
import {REGION, VERSION} from './Search'
import React, { useEffect, useState } from 'react'

import PotentialLine from './PotentialLine'
import ScrollsMenu from './ScrollsMenu'
import {getItemStats} from './apis'

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
  const [slots, setSlots] = useState(0);                       // TODO: further testing after region support to make sure value is updated at the right time 
  const [hammers, setHammers] = useState(2);                   // TODO: change this beyond GMS default for all regions
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');

  // Job Information Possibilities
  // Array of required jobs:
  //    ["Beginner"] => Common equipment
  //    ["Bowman"] => Regular Job specific equipment
  //    ["Thief", "Pirate"] => Xenon-specific
  const [job, setJob] = useState(props.itemJob);               // Item required job, not user's job

  // User Interface Specific Variables
  // TODO: Make sure to compute star force stats and update the SF readonly fields appropriately
  const [starForce, setStarForce] = useState(0);
  const [scrollType, setScrollType] = useState('Type');            // See ScrollsMenu, defaults to label for menu
  const [primaryStat, setPrimaryStat] = useState('Stat');          // For scrolling only. See ScrollsMenu, defaults to label for menu

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
  // Primarily using state over hooks because in child component PotentialLine, because there are very many menu items that can be selected
  // So the state inside the child component is handling all permutations of potential settings and updating only partial states.
  //
  // tldr; Separating into separate component because there will only ever be 6 potentials that use only a subset of these fields.
  let initialPotentialState = {
    // Default PotentialLine component Dropdown menu names. Prevents input field from crashing with a new item.
    "Line 1": 0,
    "Line 2": 0,
    "Line 3": 0,

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
    potential2LukPerTenLevel: 0,
    potential1AttPerTenLevel: 0,
    potential1MattPerTenLevel: 0
  };

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

  // Helper Functions
  // Toggle to force useEffect() to re-run and reset all the states
  const [isReset, setIsReset] = useState(false);
  const resetAllStates = () => {
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

    // Star Force / Scrolling UI 
    setStarForce(0);
    setScrollType('Type');              // Changing this value triggers useEffect() in ScrollsMenu
    setPrimaryStat('Stat');              

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
  }

  const calculateScrollStats = () => {
    // Scrolling mechanics info from: https://strategywiki.org/wiki/MapleStory/Spell_Trace_and_Star_Force
    //
    // Update the stats using the selected scroll on all slots. Please see ScrollsMenu for fields and supported scrolls.

    setScrollStr(0);
    setScrollDex(0);
    setScrollInt(0);
    setScrollLuk(0);
    setScrollAtt(0);
    setScrollMatt(0);
    setScrollHP(0);
    setScrollMP(0);

    // How much each scroll adds depending on item level / scroll type
    let statMultiplier = 0;
    let attMultiplier = 0;
    let hpMultiplier = 0; 

    // TODO: Extract the massive if statement into a JSON 
    // Spell Trace Logic
    if (scrollType.includes('Spell Trace')) {
      if (category == 'Armor') {
        if (subcategory == 'Glove') {
          // Glove scrolls only adjust ATT/MATT
          if (scrollType == '30% Spell Trace') {
            if (requiredLevel < 75) {
              attMultiplier = 2;
            } else {
              attMultiplier = 3;
            }
          } 
          else if (scrollType == '70% Spell Trace') {
            if (requiredLevel < 75) {
              attMultiplier = 1;
            } else {
              attMultiplier = 2;
            }
          } 
          else if (scrollType == '100% Spell Trace') {
            if (requiredLevel < 75) {
              attMultiplier = 0;
            } else {
              attMultiplier = 1;
            }
          } 
          
          setScrollAtt(attMultiplier * slots);
          setScrollMatt(attMultiplier * slots);
        } else {
          // Regular armor stats have Stat and HP, and extra HP for DA
          if (scrollType == '30% Spell Trace') {
            if (requiredLevel < 75) {
              statMultiplier = 3;
              hpMultiplier = 30;
              if (primaryStat == 'HP') {
                hpMultiplier += 150;
              }
            } else if (requiredLevel < 115) {
              statMultiplier = 5;
              hpMultiplier = 70;
              if (primaryStat == 'HP') {
                hpMultiplier += 250;
              }
            } else {
              statMultiplier = 7;
              hpMultiplier = 120;
              if (primaryStat == 'HP') {
                hpMultiplier += 350;
              }
            }
          } 
          else if (scrollType == '70% Spell Trace') {
            if (requiredLevel < 75) {
              statMultiplier = 2;
              hpMultiplier = 15;
              if (primaryStat == 'HP') {
                hpMultiplier += 100;
              }
            } else if (requiredLevel < 115) {
              statMultiplier = 3;
              hpMultiplier = 40;
              if (primaryStat == 'HP') {
                hpMultiplier += 150;
              }
            } else {
              statMultiplier = 4;
              hpMultiplier = 70;
              if (primaryStat == 'HP') {
                hpMultiplier += 200;
              }
            }
          }
          else if (scrollType == '100% Spell Trace') {
            if (requiredLevel < 75) {
              statMultiplier = 1;
              hpMultiplier = 5;
              if (primaryStat == 'HP') {
                hpMultiplier += 50;
              }
            } else if (requiredLevel < 115) {
              statMultiplier = 2;
              hpMultiplier = 20;
              if (primaryStat == 'HP') {
                hpMultiplier += 100;
              }
            } else {
              statMultiplier = 3;
              hpMultiplier = 30;
              if (primaryStat == 'HP') {
                hpMultiplier += 150;
              }
            }
          } 

          // Update appropriate stats
          if (primaryStat == 'STR') {
            setScrollStr(slots * statMultiplier);
            setScrollHP(slots * hpMultiplier);
          }
          else if (primaryStat == 'DEX') {
            setScrollDex(slots * statMultiplier);
            setScrollHP(slots * hpMultiplier);
          }
          else if (primaryStat == 'INT') {
            setScrollInt(slots * statMultiplier);
            setScrollHP(slots * hpMultiplier);
          }
          else if (primaryStat == 'LUK') {
            setScrollLuk(slots * statMultiplier);
            setScrollHP(slots * hpMultiplier);
          }
          else if (primaryStat == 'HP') {
            setScrollHP(slots * hpMultiplier);
          }

          if (slots >= 4) {
            // "On the 4th success, if you used Spell Traces, you will receive +1 ATT/MATT"
            setScrollAtt(1);
            setScrollMatt(1);
          }
        }
      } 
      else if (category == 'Accessory') {
        if (scrollType == '30% Spell Trace') {
          if (requiredLevel < 75) {
            statMultiplier = 3;
            hpMultiplier = 150;
          }
          else if (requiredLevel < 115) {
            statMultiplier = 4;
            hpMultiplier = 200;
          }
          else {
            statMultiplier = 5;
            hpMultiplier = 250;
          }
        } 
        else if (scrollType == '70% Spell Trace') {
          if (requiredLevel < 115) {
            statMultiplier = 2;
            hpMultiplier = 100;
          }
          else {
            statMultiplier = 3;
            hpMultiplier = 150;
          }
        } 
        else if (scrollType == '100% Spell Trace') {
          if (requiredLevel < 115) {
            statMultiplier = 1;
            hpMultiplier = 50;
          }
          else {
            statMultiplier = 2;
            hpMultiplier = 100;
          }
        } 

        // Update appropriate stats for Spell Traces
        if (primaryStat == 'STR') {
          setScrollStr(slots * statMultiplier);
        }
        else if (primaryStat == 'DEX') {
          setScrollDex(slots * statMultiplier);
        }
        else if (primaryStat == 'INT') {
          setScrollInt(slots * statMultiplier);
        }
        else if (primaryStat == 'LUK') {
          setScrollLuk(slots * statMultiplier);
        }
        else if (primaryStat == 'HP') {
          setScrollHP(slots * hpMultiplier);
        }
      }
      else if (category == 'Other') {
        if (subcategory == 'Mechanical Heart') {
          if (scrollType == '30% Spell Trace') {
            if (requiredLevel < 75) {
              attMultiplier = 3
            }
            else if (requiredLevel < 115) {
              attMultiplier = 5
            }
            else {
              attMultiplier = 7
            }
          } 
          else if (scrollType == '70% Spell Trace') {
            if (requiredLevel < 75) {
              attMultiplier = 2
            }
            else if (requiredLevel < 115) {
              attMultiplier = 3
            }
            else {
              attMultiplier = 5
            }
          } 
          else if (scrollType == '100% Spell Trace') {
            if (requiredLevel < 75) {
              attMultiplier = 1
            }
            else if (requiredLevel < 115) {
              attMultiplier = 2
            }
            else {
              attMultiplier = 3
            }
          } 

          // Update appropriate stats
          setScrollAtt(slots * attMultiplier);
          setScrollMatt(slots * attMultiplier);
        }
      }
      else if (category == 'One-Handed Weapon' || category == 'Two-Handed Weapon' || category == 'Unknown') {
        // For notes on Unknown, please see calculateStarForceStats() comments about Adele weapons
        if (scrollType == '15% Spell Trace') {
          if (requiredLevel < 75) {
            attMultiplier = 5;
            statMultiplier = 2;
            hpMultiplier = 100;
          }
          else if (requiredLevel < 115) {
            attMultiplier = 7;
            statMultiplier = 3;
            hpMultiplier = 150;
          }
          else {
            attMultiplier = 9;
            statMultiplier = 4;
            hpMultiplier = 200;
          }
        }
        else if (scrollType == '30% Spell Trace') {
          if (requiredLevel < 75) {
            attMultiplier = 3;
            statMultiplier = 1;
            hpMultiplier = 50;
          }
          else if (requiredLevel < 115) {
            attMultiplier = 5;
            statMultiplier = 2;
            hpMultiplier = 100;
          }
          else {
            attMultiplier = 7;
            statMultiplier = 3;
            hpMultiplier = 150;
          }
        } 
        else if (scrollType == '70% Spell Trace') {
          if (requiredLevel < 75) {
            attMultiplier = 2;
          }
          else if (requiredLevel < 115) {
            attMultiplier = 3;
            statMultiplier = 1;
            hpMultiplier = 50;
          }
          else {
            attMultiplier = 5;
            statMultiplier = 2;
            hpMultiplier = 100;
          }
        } 
        else if (scrollType == '100% Spell Trace') {
          if (requiredLevel < 75) {
            attMultiplier = 1;
          }
          else if (requiredLevel < 115) {
            attMultiplier = 2;
          }
          else {
            attMultiplier = 3;
            statMultiplier = 1;
            hpMultiplier = 50;
          }
        } 

        // Update appropriate stats
        setScrollAtt(slots * attMultiplier);
        setScrollMatt(slots * attMultiplier);

        if (primaryStat == 'STR') {
          setScrollStr(slots * statMultiplier);
        }
        else if (primaryStat == 'DEX') {
          setScrollDex(slots * statMultiplier);
        }
        else if (primaryStat == 'INT') {
          setScrollInt(slots * statMultiplier);
        }
        else if (primaryStat == 'LUK') {
          setScrollLuk(slots * statMultiplier);
        }
        else if (primaryStat == 'HP') {
          setScrollHP(slots * hpMultiplier);
        }
      }
    }
    else {
      // Special Scrolls (non-Spell Trace)
      if (scrollType == 'Basic Gollux Scroll') {
        statMultiplier = 1;
        attMultiplier = 2;
      } 
      else if (scrollType == 'Advanced Gollux Scroll') {
        statMultiplier = 3;
        attMultiplier = 4;
      }
      else if (scrollType == '9th Anniversary Prime Scroll') {
        if (category.includes('Weapon') 
            || 
           (category == 'Unknown' && job == 'Warrior' && !name.includes('Emblem'))) {    // Adele Weapon lol
            statMultiplier = 3;
            attMultiplier = 10;
        }
        else if (category == 'Accessory' || category == 'Armor') {
          statMultiplier = 10;
        }
      }
      else if (scrollType == 'Fragment of Distorted Time') {
        statMultiplier = 3;
        attMultiplier = 3;
        hpMultiplier = 40;
      }

      // Update stats for Special Scrolls
      setScrollStr(slots * statMultiplier);
      setScrollDex(slots * statMultiplier);
      setScrollInt(slots * statMultiplier);
      setScrollLuk(slots * statMultiplier);
      setScrollAtt(slots * attMultiplier);
      setScrollMatt(slots * attMultiplier);
      setScrollHP(slots * hpMultiplier);
    }
  }

  // TODO: Update Star Force values
  const calculateStarForceStats = () => {
    // Star Force mechanics info: https://strategywiki.org/wiki/MapleStory/Spell_Trace_and_Star_Force#Star_Force_Enhancement
    //
    // Update Star Force stats based on how many stars the user inputs in the hook
    // For different kinds of Star Force, you can filter by job first to determine what stats to add.
    // 
    // e.g. "Thief" => DEX, LUK
    // e.g. "Thief" + "Pirate" => STR, DEX, LUK
    // e.g. "Beginner" => STR, DEX, INT, LUK
    //
    // For weapons, there is an extra ATT/MATT component. You can filter by "category" and "job".
    //
    // e.g. Thief weapon => "One-handed-weapon" + "Thief" 
    // e.g. Xenon weapon => "One-handed-weapon" + "Thief" + "Pirate"
    //
    // Special Case: 
    //       Adeles do not have properly tagged weapons (i.e. "category" => unknown)
    //       Therefore, for Adele weapons, "category" = "Unknown" 
    //                                    "name" => remove all with "Emblem"
    //       Emblems are the only other equips with "Warrior" and "Unknown" as a category.
    //
    //       This is an EXTREMELY INFURIATING inconsistency on Nexon's part, because the data is not properly labeled. 
    //
    // Special Case:
    //       Tyrants have a special Star Force stat system. Please see StrategyWiki link above.
    //
  }

  useEffect(() => {
    calculateScrollStats();
  }, [primaryStat, scrollType, starForce, slots]);

  useEffect(() => {
    // Reset all the states since a new item was loaded
    resetAllStates();

    // Update Hammer information
    changeHammerDependingOnRegion();

    // Load the basic item information from API/local JSON and set the new state information
    getItemStats(props.region, props.version, props.itemID)
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
        setJob(props.itemJob);                   // this is passed from Search b/c direct item ID query doesn't contain job

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
              <Button variant="dark" onClick={e => setIsReset(true)}>
                Reset 
              </Button>
            </Col>
          </Form.Row>

          {/* Required Level / Attack Speed / Unique Equip / Item Category */}
          <Form.Row>
            <Col>
              <FormLabel> Job </FormLabel>
              <Form.Control readOnly size="sm" type="text" value={job}/>
            </Col>
            <Col>
              <FormLabel> Level </FormLabel>
              <Form.Control readOnly size="sm" type="text" value={requiredLevel}/>
            </Col>
            <Col>
              <FormLabel> Speed </FormLabel>
              <Form.Control readOnly size="sm" type="text" value={attackSpeed}/>
            </Col>
            <Col>
              <FormLabel> Exclusive </FormLabel>
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
              <FormLabel> Scrolls </FormLabel>
              <ScrollsMenu 
                stat={primaryStat}
                setPrimaryStat={setPrimaryStat}
                type={scrollType}
                setScrollType={setScrollType} 
                slots={slots}
                setSlots={setSlots}
                id={props.itemID}
                itemName={name}
                category={category}
                job={job}
              />
            </Col>
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
                id={props.itemID}
              />
              <PotentialLine 
                name = 'Line 2'
                potentialLine = {potentialLine2}
                setPotentialLine = {setPotentialLine2}
                id={props.itemID}
              />
              <PotentialLine 
                name = 'Line 3'
                potentialLine = {potentialLine3}
                setPotentialLine = {setPotentialLine3}
                id={props.itemID}
              />
            </Col>
            <Col>
              <FormLabel> Bonus Potential </FormLabel>
              <PotentialLine 
                name = 'Line 1'
                potentialLine = {bonusPotentialLine1}
                setPotentialLine = {setBonusPotentialLine1}
                id={props.itemID}
              />
              <PotentialLine 
                name = 'Line 2'
                potentialLine = {bonusPotentialLine2}
                setPotentialLine = {setBonusPotentialLine2}
                id={props.itemID}
              />
              <PotentialLine 
                name = 'Line 3'
                potentialLine = {bonusPotentialLine3}
                setPotentialLine = {setBonusPotentialLine3}
                id={props.itemID}
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