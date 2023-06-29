import { Card, CardTitle } from "reactstrap";
import VoterControl from "./VoterControl";
import VoterList from "./VoterList";

import './VoterContainer.css'

const VoterComponent = ({ votersState, isOwnerState, currentStatus }) => {

  return ( 
    <Card body id="voter-container">
        <CardTitle tag="h5"> Voters </CardTitle>
        <VoterList votersState={votersState} />
        { isOwnerState && ( <VoterControl votersState={votersState} currentStatus={currentStatus} /> )}      
    </Card> 
  )
}

export default VoterComponent