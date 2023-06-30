import { Card, CardTitle } from "reactstrap";
import VoterControl from "./VoterControl";
import VoterList from "./VoterList";
import EnumWorkflowStatus from "../EnumWorkflowStatus";

import './VoterContainer.css'
import StateIcon from "../stateIcon/StateIcon";

const VoterComponent = ({ votersState, isOwnerState, currentStatus }) => {
 
  return ( 
    <Card body id="voter-container">
        <CardTitle tag="h5"> 
          Voters 
          &nbsp;
          <StateIcon enabled={currentStatus === EnumWorkflowStatus.RegisteringVoters} /> 
        </CardTitle>
        <VoterList votersState={votersState} />
        { isOwnerState && ( <VoterControl votersState={votersState} currentStatus={currentStatus} /> )}      
    </Card> 
  )
}

export default VoterComponent