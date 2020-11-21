import Search from './Search'

const Body = () => {
  // TODO: replace hardcoded value of region, version, etc. with props params
  return (
    /*
      Currently meant to be the main body
      Should probably add/refactor a header menu or a footer credits 
    */
    <header className="App-header">
      <Search region="GMS" version="217" itemName="Fafnir%20Mercy" />
    </header>
  );
}

export default Body;