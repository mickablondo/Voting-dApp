import { Card, CardTitle } from "reactstrap";
import './VoterContainer.css'
import GetVoterControl from "./GetVoterControl";
import './GetVoterContainer.css'

const GetVoterContainer = () => {
    return ( 
        <div id="get-voter-container" style={{ display: 'flex' }}>
            <Card body id="getvoter-container">
                <CardTitle tag="h5"> Retrieves information from a voter </CardTitle>
                <GetVoterControl />
            </Card> 
        </div>
      )
}

export default GetVoterContainer