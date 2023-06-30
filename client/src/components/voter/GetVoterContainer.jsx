import { Card, CardTitle } from "reactstrap";
import VoterControl from "./VoterControl";
import './VoterContainer.css'
import GetVoterControl from "./GetVoterControl";

const GetVoterContainer = () => {
    return ( 
        <Card body id="getvoter-container">
            <CardTitle tag="h5"> Retrieves information from a voter </CardTitle>
            <GetVoterControl />
        </Card> 
      )
}

export default GetVoterContainer