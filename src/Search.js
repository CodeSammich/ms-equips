import React, { useState } from 'react'
import {FormLabel, FormGroup, FormControl, Button } from 'react-bootstrap'

const REGION = 'GMS', VERSION = 217, MAXNUMITEMS = 5;

const getItems = (name) => {
  /*
  Query a list of equipment items from maplestory.io API
    this.props.region: "GMS"
    this.props.version: "210.1.1"
    this.props.itemName: "Fafnir"           Capitalization is important

  event: form submit event

  TODO: Handle failed requests (e.g. equips that don't exist in previous versions)
  */
  const url = `https://maplestory.io/api/${REGION}`
    + `/${VERSION}/item?searchFor=${name}`;
  console.log(url);
  
  // Return the promise function that has generatedItemLayouts as part of the promise
  return fetch(url);
}

const removeDuplicates = (response) => {
  // return array s.t. duplicate items with same item names are removed
  let results = {};
  response.forEach((result) => {
    results[result.name] = results[results.name] || result;
  });
  return Array.from( Object.values(results) );
}

const generateItemLayouts = (items) => {
  // Parse the list of JSON objects received from API and create array of item layouts
  const layouts = items.map((item) => {
    let imgURL = `https://maplestory.io/api/${REGION}/` 
      + `${VERSION}/item/`
      + `${item.id}/icon`;
    return (
      // List items should have unique keys, but certain Maple items have multiple IDs
      <li key={item.id} style={{ listStyleType: "none"}}>
        {item.name}
        <img className="body-icons" src={imgURL} alt={item.name} />
      </li>
    );
  });
  return layouts;
}

// TODO: make a component for tooltip
const Search = () => {
  // useState returns a accessor variable / setter function pair
  const [name, setName] = useState(null);
  const [items, setItems] = useState(null);

  const onChangeItems = (event) => {
    // getItems returns the fetch promise
    // NOTE: setItems() from useState is visible inside the promise!!!!
    event.preventDefault();
    console.log("changeItems");
    getItems(name)
      .then(response => response.json()) 
      .then(response => {
        let resultItems = removeDuplicates(response, MAXNUMITEMS);
        resultItems = resultItems.slice(0, MAXNUMITEMS); // limit how many items
        resultItems = generateItemLayouts(resultItems, REGION, VERSION);
        setItems(resultItems);
      });
  };

  return (
    <div className="body-search">
      {/* Search for Item form */}
      <form onSubmit={onChangeItems}> 
        <FormGroup role="form">
          <FormLabel>Item Name</FormLabel>
          <FormControl type="text" placeholder="Fafnir Mercy"
            onChange={e => setName(e.target.value)} // typing event calls setName function
          />
          <Button variant="primary" type="submit"> Search </Button>
        </FormGroup>
      </form>
      {/* Search Results (list of items) */}
      <ul>
        {items}
      </ul>
    </div>
  )
}

export default Search;