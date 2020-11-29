import {Alert, Button, Col, Container, FormControl, FormGroup, FormLabel, Row, Text} from 'react-bootstrap'
import React, { useState } from 'react'
import {generateItemLayouts, getItems} from './apis'

export const REGION = 'GMS', VERSION = 217;

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
        let equipsLayouts = generateItemLayouts(equips, props.setTooltipID, props.setItemJob, props.region, props.version);
        if (equipsLayouts.length > 0) {
          setItems(equipsLayouts);
        } else {
          // No items were found, so send to the catch condition
          throw Error("Item not found.");
        }
      })
      .catch((error) => {
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
            <form className="body-search" onSubmit={onChangeItems}> 
              <FormGroup role="form">
                <FormLabel>
                  Item Name
                </FormLabel>
                <FormControl type="text" placeholder="Fafnir Mercy"
                  onChange={e => setName(e.target.value)} // typing event calls setName function
                />
              </FormGroup>
              <Button variant="dark" type="submit"> 
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