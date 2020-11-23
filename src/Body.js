import { Col, Container, Row } from 'react-bootstrap'
import React, { useState } from 'react'

import ItemTooltip from './ItemTooltip'
import RegionSelect from './RegionSelect'
import Search from './Search'

const Body = () => {
  // TODO: replace hardcoded value of region, version, etc. with props params
  const [tooltipID, setTooltipID] = useState(null);
  const [region, setRegion] = useState('GMS');
  const [version, setVersion] = useState(217);
  return (
    /*
      Currently meant to be the main body
      Should probably add/refactor a header menu or a footer credits 
    */
    <body className="App-header">
      <Container fluid className="vh-100">
        <Row>
          {/* Screen is divided in 12 sections. Each tag (xs, sm..) => screen sizes */}
          <RegionSelect region={region} setRegion={setRegion} version={version} setVersion={setVersion} />
        </Row>
        <Row>
          <Col xs={4} sm={4} md={3} lg={3} xl={3}>
            {/* Search Bar */}
            <Search region={region} version={version} setTooltipID={setTooltipID} maxNumItems={5} />
          </Col>
          <Col xs={6} sm={6} md={9} lg={8} xl={8}>
            {/* Detailed Item Tooltip, only loads if there is a tooltip ID */}
            { tooltipID && <ItemTooltip region={region} version={version} itemID={tooltipID} /> }
          </Col> 
          {/* <EquipmentWindow */}
        </Row>
      </Container>
    </body>
  );
}

export default Body;