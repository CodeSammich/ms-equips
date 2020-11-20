import React, { useState } from 'react'

class Search extends React.Component {
  constructor(props) {
    super(props);

    // This binding is necessary to make `this` be available inside getItems callback scope
    // 
    // 1. Binds an object (e.g. `this`, aka the Search object) to a function (getItems)
    // 2. Reference that object (Search) using the keyword `this`
    //
    // Result: `this` inside getItems() and its callbacks/promises is the Search object
    this.updateName = this.updateName.bind(this);
    this.updateRegion = this.updateRegion.bind(this);
    this.updateVersion = this.updateVersion.bind(this);
    this.getItems = this.getItems.bind(this);
    this.removeDuplicates = this.removeDuplicates.bind(this);
    this.generateItemLayouts = this.generateItemLayouts.bind(this);

    // state is a special field that allows this.setState() to save data from promises
    this.state = {
      region: "GMS",
      version: 217,
      name: null,
      results: null,
      maxNumResult: 5
    }
  }

  updateName(event) {
    /*
    Updates the form input with previously submitted text

    event: form submit event
    */
    this.setState({
      name: event.target.value
    });
  }

  updateRegion(event) {
    /*
    Updates the form input with previously submitted text

    event: form submit event
    */
    this.setState({
      region: event.target.value
    });
  }

  updateVersion(event) {
    /*
    Updates the form input with previously submitted text

    event: form submit event
    */
    this.setState({
      version: event.target.value
    });
  }

  removeDuplicates(response) {
    // filter response to remove duplicate items with same item, capping at maxNumResult
    this.map = new Map();
    let items = response.filter(
      item => {
        // Add each element to a Map and filter out all duplicate names + extra results
        // return true == keep in the items array
        if (this.map.get(item.name) == undefined && this.map.size < this.state.maxNumResult) {
          this.map.set(item.name, item.name);
          return true;
        }
        return false;
      }
    );
    return items;
  }

  generateItemLayouts(items) {
    // Parse the list of JSON objects received from API and create array of item layouts
    items = items.map((item) => {
      let imgURL = `https://maplestory.io/api/${this.state.region}/` 
        + `${this.state.version}/item/`
        + `${item.id}/icon`;
      
      return (
        // List items should have unique keys, but certain Maple items have multiple IDs
        <li key={item.id} style={{ listStyleType: "none"}}>
          {item.name}
          <img className="body-icons" src={imgURL} />
        </li>
      ) 
    });
    return items;
  }

  getItems(event) {
    /*
    Query a list of equipment items based on search
      this.props.region: "GMS"
      this.props.version: "210.1.1"
      this.props.itemName: "Fafnir"           Capitalization is important

    event: form submit event

    TODO: Handle failed requests (e.g. equips that don't exist in previous versions)
    */
    // prevent default form behavior from HTML
    event.preventDefault();

    const url = `https://maplestory.io/api/${this.state.region}`
      + `/${this.state.version}/item?searchFor=${this.state.name}`;
    console.log(url);
    
    fetch(url)
      .then(response => response.json()) 
      .then(response => {
        let items = this.removeDuplicates(response);
        items = this.generateItemLayouts(items);

        // setState is required to save information at the end of a promise
        this.setState({
          results: items
        });
      });
  }

  // TODO: make a component for tooltip
  render() {
    return (
      <div className="body-search">
        {/* Search for Item form */}
        <form onSubmit={this.getItems}>
          <div className="form-group">
            <label for="itemName">
              Item Name: 
            </label>
            <input id="itemName" type="text" value={this.state.name} 
              onChange={this.updateName} placeholder="Fafnir Mercy"/>
          </div>
          <div className="form-group">
            <label for="region">
              Region: 
            </label>
            <input id="region" type="text" value={this.state.region} 
              onChange={this.updateRegion} />
          </div>
          <div className="form-group">
            <label for="version">
              Version: &nbsp;
              <input type="text" value={this.state.version} 
                onChange={this.updateVersion} />
            </label>
            <button id="version" type="submit" value="Submit" 
              className="btn btn-primary"/>
          </div>
        </form>
        {/* Search Results (list of items) */}
        <ul>
          {this.state.results}
        </ul>
      </div>
    )
  }
}

export default Search;