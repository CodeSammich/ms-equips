import {Button} from 'react-bootstrap'

export const getItems = (region, version, name) => {
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
  
  // Return the promise function that has generatedItemLayouts as part of the promise
  return fetch(url);
}

export const generateItemLayouts = (items, setTooltipID, setItemJob, region, version) => {
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
          onClick={e => {
            setTooltipID(item.id);                 // Item Number in API
            setItemJob(item.requiredJobs);         // NOTE: This is an array, because Xenons have two jobs (i.e. ["Thief", "Pirate"])
          }}> 
          {item.name}
          <img className="body-icons" src={imgURL} alt={item.name} />
        </Button>
      </li>
    );
  });
  return layouts;
}

export const getItemStats = (region, version, itemID) => {
  // Queries maplestory.io API for detailed item information
  // including the stats listed below, icons, etc.
  let url = `https://maplestory.io/api/${region}/${version}/item/${itemID}`;
  encodeURI(url);
  return fetch(url);
}
