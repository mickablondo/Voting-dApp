import React from 'react'
import {CardBody, CardColumns, Card, CardTitle, CardImg, CardSubtitle, CardText} from 'reactstrap'

import './VotingStatePanel.css';

const VotingStates = ({ votersState }) => {
  return ( 
    <CardColumns id="voting-state-panel">
      
      <Card>
        <CardImg alt="Voters participation image" src="/images/voting-state-panel/voting-icon-64.png" />
        <CardBody>
          <CardTitle tag="h5"> X % </CardTitle>
          <CardText className="mb-2 text-muted" tag="h6"> Participation (X votes) </CardText>
        </CardBody>
      </Card>

      <Card>
        <CardImg alt="Registred voters image" src="/images/voting-state-panel/groupe-icon-96.png" />
        <CardBody>
          <CardTitle tag="h5"> { votersState.length } </CardTitle>
          <CardText className="mb-2 text-muted" tag="h6"> Voters </CardText>
        </CardBody>
      </Card>

      <Card>
        <CardImg alt="Proposals image" src="/images/voting-state-panel/questions-icon-60.png" />
        <CardBody>
          <CardTitle tag="h5"> 777 </CardTitle>
          <CardText className="mb-2 text-muted" tag="h6"> Proposals </CardText>
        </CardBody>
      </Card>

    </CardColumns> 
  )
}

export default VotingStates