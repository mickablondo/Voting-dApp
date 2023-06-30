import React from 'react' 

const StateIcon = ({enabled}) => {
 
  return (
    <img className="state-icon" width="18px"
        alt={enabled? "enabled icon": "disabled icon"} 
        src={enabled? "/images/status-icon/green-circle-48.png": "/images/status-icon/yellow-circle-48.png"} 
        />
  )
}

export default StateIcon