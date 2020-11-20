import React from 'react'

class Search extends React.Component {
  constructor(props) {
    super(props);

    // This binding is necessary to make `this` be available inside getItems callback scope
    // 
    // 1. Binds an object (e.g. `this`, aka the Search object) to a function (getItems)
    // 2. Reference that object (Search) using the keyword `this`
    //
    // Result: `this` inside getItems() and its callbacks/promises is the Search object
    this.getItems = this.getItems.bind(this);

    // state is a special field that allows this.setState() to save data from promises
    this.state = {
      items: null
    }
  }

  getItems() {
    /*
    Query a list of equipment items based on search
      region: "GMS"
      version: "210.1.1"
      itemName: "Fafnir"           Capitalization is important

    TODO: Handle failed requests
    */
    const url = `https://maplestory.io/api/${this.props.region}/${this.props.version}/item?searchFor=${this.props.itemName}`;
    console.log(url);
    
    fetch(url)
      .then(response => response.json()) 
      .then(response => {
        console.log(typeof(response));

        // Parse the JSON object and create an array 
        const items = response.map((item) => 
          // List items should have unique keys, but certain Maple items have multiple IDs
          <li key={item.id}>
            {item.name}
          </li>
        );

        // Update state information. This is required to save information at the end of a promise
        this.setState({
          items: items 
        });
      });
  }

  render() {
    return (
      <div>
        <button onClick={this.getItems}>
          Search Items
        </button>
        <ul>
          {this.state.items}
        </ul>
      </div>
    )
  }
}

export default Search;