import React from 'react'
import {CardBody, CardColumns, Card, CardTitle, CardImg, CardSubtitle, CardText} from 'reactstrap'

import './VotingStatePanel.css';

const VotingStates = () => {
  return ( 
    <CardColumns id="participation-panel">
      
      <Card>
        <CardImg alt="Voters participation image" src="/images/voting-state-panel/voting-icon-64.png" />
        <CardBody>
          <CardTitle tag="h5"> 65% </CardTitle>
          <CardText className="mb-2 text-muted" tag="h6"> Participation (122 votes) </CardText>
        </CardBody>
      </Card>

      <Card>
        <CardImg alt="Registred voters image" src="/images/voting-state-panel/groupe-icon-96.png" />
        <CardBody>
          <CardTitle tag="h5"> 200 </CardTitle>
          <CardText className="mb-2 text-muted" tag="h6"> Voters </CardText>
        </CardBody>
      </Card>

      <Card>
        <CardImg alt="Proposals image" src="/images/voting-state-panel/questions-icon-60.png" />
        <CardBody>
          <CardTitle tag="h5"> 3 </CardTitle>
          <CardText className="mb-2 text-muted" tag="h6"> Proposals </CardText>
        </CardBody>
      </Card>

    </CardColumns> 
  )
}

export default VotingStates