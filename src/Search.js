import React, { useState } from 'react'
import {Container, Row, Col, FormLabel, FormGroup, FormControl, Button } from 'react-bootstrap'

export const REGION = 'GMS', VERSION = 217;

const getItems = (name) => {
  /*
  Query a list of equipment items from maplestory.io API
    this.props.region: "GMS"
    this.props.version: "210.1.1"
    this.props.itemName: "Fafnir"           Capitalization is important

  event: form submit event

  TODO: Handle failed requests (e.g. equips that don't exist in previous versions)
  */
  const url = `https://maplestory.io/api/${REGION}/${VERSION}/item?searchFor=${name}`;
  console.log(url);
  
  // Return the promise function that has generatedItemLayouts as part of the promise
  return fetch(url);
}

const removeNonEquips = (response) => {
  // return array s.t. only equips are returned
  let results = [];
  response.forEach((item) => {
    if (item.typeInfo.overallCategory == 'Equip') {
      results.push(item);
    }
  });
  console.log(results);
  return results;
}

const removeDuplicates = (response) => {
  // return array s.t. duplicate items with same item names are removed
  let results = {};
  response.forEach((result) => {
    results[result.name] = results[results.name] || result;
  });
  return Array.from( Object.values(results) );
}

const generateItemLayouts = (items, setTooltipID) => {
  // Parse the list of JSON objects received from API and create array of item layouts
  const layouts = items.map((item) => {
    // TODO: Optimize image loading to load directly from Item object specifically?
    // This may be overlapping with item-specific tooltip api request
    let imgURL = `https://maplestory.io/api/${REGION}/${VERSION}/item/${item.id}/icon`;

    return (
      // List items should have unique keys, but certain Maple items have multiple IDs
      <li key={item.id} className="body-search-results">
        {/* Create a button that displays the name and image of the item 
            and updates the active Item Tooltip ID in Body.js when clicked */}
        <Button value={item.id} variant="light"
          onClick={e => setTooltipID(item.id)}> 
          {item.name}
          <img className="body-icons" src={imgURL} alt={item.name} />
        </Button>
      </li>
    );
  });
  return layouts;
}

// TODO: make a component for tooltip
const Search = (props) => {
  // useState returns a accessor variable / setter function pair
  const [name, setName] = useState(null);
  const [items, setItems] = useState(null);

  const onChangeItems = (event => {
    // getItems returns the fetch promise
    // NOTE: setItems() from useState is visible inside the promise!!!!
    event.preventDefault();
    getItems(name)
      .then(response => response.json()) 
      .then(response => {
        let equips = removeNonEquips(response);
        equips = removeDuplicates(equips);
        equips = equips.slice(0, props.maxNumItems); // limit how many items
        let equipsLayouts = generateItemLayouts(equips, props.setTooltipID);
        setItems(equipsLayouts);
      });
  });

  return (
    <div>
      <Container>
        <Row>
          <Col>
            {/* Search for Item form */}
            <form onSubmit={onChangeItems}> 
              <FormGroup role="form">
                <FormLabel>
                  Item Name
                </FormLabel>
                <FormControl type="text" placeholder="Fafnir Mercy"
                  onChange={e => setName(e.target.value)} // typing event calls setName function
                />
              </FormGroup>
              <Button variant="primary" type="submit"> 
                Search 
              </Button>
            </form>
          </Col>
        </Row>
        <Row>
          <Col>
            {/* Search Results (list of items) */}
            <ul> 
              {items}
            </ul>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Search;