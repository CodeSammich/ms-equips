import {Nav, NavDropdown, Navbar} from 'react-bootstrap'

const RegionSelect = (props) => {
  // TODO: Scrape the API for the latest version numbers for each region and update when region is selected
  // https://browse-old.maplestory.io/
  //
  // OR give users the ability to simply type in their version numbers...
  //
  // How to get the version number is quite hard
  const handleSelect = (event) => {
    props.setRegion(event);
  }
  
  return (
    <div className="body-navbar">
      <Navbar expand="md" fixed="top">
        <Navbar.Brand> MapleStory Equip Simulator</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <NavDropdown title={props.region} onSelect={handleSelect}>
              <NavDropdown.Item eventKey="GMS">GMS</NavDropdown.Item>
              <NavDropdown.Item eventKey="KMS">KMS</NavDropdown.Item>
              <NavDropdown.Item eventKey="MSEA">MSEA</NavDropdown.Item>
              {/* TODO: Support TMS / CMS (Chinese encoding for scrolls is annoying) */}
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};

export default RegionSelect;