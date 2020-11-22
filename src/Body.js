import React, { useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import Search from './Search'
import ItemTooltip from './ItemTooltip'

const Body = () => {
  // TODO: replace hardcoded value of region, version, etc. with props params
  const [tooltipID, setTooltipID] = useState(null)
  return (
    /*
      Currently meant to be the main body
      Should probably add/refactor a header menu or a footer credits 
    */
    <header className="App-header">
      <Container>
        <Row>
          {/* Each column will auto space depending on how many are loaded */}
          <Col>
            <Search setTooltipID={setTooltipID} maxNumItems={5} />
          </Col>
          <Col>
            {/* Only load itemTooltip if tooltipID is not null */}
            { tooltipID && <ItemTooltip itemID={tooltipID} /> }
          </Col> 
          <Col>
            {/* <EquipmentWindow */}
          </Col>
        </Row>
      </Container>
    </header>
  );
}

export default Body;