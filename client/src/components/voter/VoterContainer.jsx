import { Row, Card, CardTitle } from "reactstrap";
import VoterControl from "./VoterControl";
import VoterList from "./VoterList";

import './VoterContainer.css'

const VoterComponent = ({ votersState, isOwnerState }) => {
  return ( 
    <Card body id="voter-container">
        <CardTitle tag="h5"> Voters </CardTitle>
        <VoterList votersState={votersState} />
        { isOwnerState && ( <VoterControl votersState={votersState} /> )}      
    </Card> 
  )
}

export default VoterComponent