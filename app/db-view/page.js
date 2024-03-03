"use client"
import MenuButton from "@/components/menu-button";
import { CircularProgress } from "@mui/joy";
import { useState, useEffect } from "react";

export default function ViewDBPage() {
    const [loading, isLoading] = useState(true)
    const [fetchedResults, setResults] = useState([]);
    const [isEmpty, setEmpty] = useState(false)

    const getData = async () => {
      await fetch("/api/pit-result", {
        method: "GET",
        headers: {
        "Content-Type": "application/json", // Set the request headers to indicate JSON format
        },
      })
      .then((res) => res.json()) // Parse the response data as JSON
      .then((data) => {setResults(data.results), console.log(data.results), console.log( typeof data.results)})
      .catch( err => console.log(err) ); // Update the state with the fetched data

      if(fetchedResults.length == 0){
        setEmpty(true)
      }
      isLoading(false)
    }

    useEffect(() => {
      getData()
    }, []);

    return(
        <>
        <MenuButton/>
        
        <h1>Survey Results</h1>
        <h2>Pit Survey</h2>

        {loading
        ? <div style={{display:'flex', textAlign:'center'}}>
            <p>Loading...   </p><CircularProgress variant="soft" size="sm"/>
          </div>
        : isEmpty
        ? <p>No results yet!</p>
        : (
          <div className="pit-results-container">
          {fetchedResults.map((item, index) => {
            return(
            <div key={index} className="item-container">
              <h3 className="pit-results-number">{item.team_number}</h3>
              <p>Drivetrain: <strong>{item.drivetrain}</strong></p>
              <p>Preferred Start Position(s): <strong>{item.preferred_pos}</strong></p>
              <p>Has Vision Tracking: <strong>{item.vision}</strong></p>
              <p>Scores in Amp or Speaker: <strong>{item.score_height}</strong></p>
              <p>Pickup at floor or HPS: <strong>{item.pickup_pos}</strong></p>
              <p>Can climb: <strong>{item.can_climb}</strong></p>
              <p>Can help others climb: <strong>{item.help_climb}</strong></p>
              <p>Can score while climbing: <strong>{item.score_climb}</strong></p>
              <small>Survey by: <strong>{item.name}</strong></small>
            </div>
            )
          })}
          </div>
        )}
          
        
        <h2>Match Survey</h2>
        <p>Coming soon!</p>
        </>
    )
}