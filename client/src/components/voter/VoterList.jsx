import { React } from 'react'

import { ListGroup, ListGroupItem } from 'reactstrap';

const VoterList = ({ votersState }) => {
    
  return (
    <ListGroup id='voter-list'>
    { votersState.map(voterAddress => (
      <ListGroupItem key={voterAddress}>
        {voterAddress}
      </ListGroupItem>
    ))}
    </ListGroup> 
  )
}

export default VoterList