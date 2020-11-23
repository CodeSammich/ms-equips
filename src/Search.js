import {Alert, Button, Col, Container, FormControl, FormGroup, FormLabel, Row, Text} from 'react-bootstrap'
import React, { useState } from 'react'

export const REGION = 'GMS', VERSION = 217;

const getItems = (region, version, name) => {
  /*
  Query a list of equipment items from maplestory.io API
    this.props.region: "GMS"
    this.props.version: "210.1.1"
    this.props.itemName: "Fafnir"           Capitalization is important

  event: form submit event

  TODO: Handle failed requests (e.g. equips that don't exist in previous versions)
  */
  let url = `https://maplestory.io/api/${region}/${version}/item?searchFor=${name}`;
  url = encodeURI(url); // converts spaces to %20, for example
  console.log(url);
  
  // Return the promise function that has generatedItemLayouts as part of the promise
  return fetch(url);
}

const removeNonEquips = (response) => {
  // May end up removing this function because certain equips are not tagged as equips
  // return array s.t. only equips are returned
  let results = [];
  response.forEach((item) => {
    if (item.typeInfo.overallCategory === 'Equip' || item.typeInfo.overallCategory === 'Unknown') {
      // Some items are not labeled properly.. so this function may not be a good idea?
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

const generateItemLayouts = (items, setTooltipID, region, version) => {
  // Parse the list of JSON objects received from API and create array of item layouts
  const layouts = items.map((item) => {
    // TODO: Optimize image loading to load directly from Item object specifically?
    // This may be overlapping with item-specific tooltip api request
    let imgURL = `https://maplestory.io/api/${region}/${version}/item/${item.id}/icon`;
    imgURL = encodeURI(imgURL);

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
    getItems(props.region, props.version, name)
      .then(response => response.json()) 
      .then(response => {
        let equips = removeNonEquips(response);
        equips = removeDuplicates(equips);
        equips = equips.slice(0, props.maxNumItems); // limit how many items
        let equipsLayouts = generateItemLayouts(equips, props.setTooltipID, props.region, props.version);
        if (equipsLayouts.length > 0) {
          setItems(equipsLayouts);
        } else {
          // No items were found, so send to the catch condition
          throw Error("Item not found.");
        }
      })
      .catch((error) => {
        console.log('item not found');
        setItems(
          // Update items this with a DNE alert, because API returned 500 error.
          <Alert className="small-font" variant="danger">
            Item not found. Please double check region.
          </Alert>
        )
      });
  });

  return (
    <div>
      <Container>
        <Row>
          <Col>
            {/* Search for Item form */}
            <form class="body-search" onSubmit={onChangeItems}> 
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