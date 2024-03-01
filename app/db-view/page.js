"use client"
import MenuButton from "@/components/menu-button";
import items from "@/components/pit-render";
import { Grid } from "@mui/joy";
import { useState, useEffect } from "react";

export default function ViewDBPage() {
    const [loading, isLoading] = useState(true)
    const [items, setItems] = useState([]);

    useEffect(() => {
        fetch("/api/pitsurvey", {
          method: "GET",
          headers: {
            "Content-Type": "application/json", // Set the request headers to indicate JSON format
          },
        })
          .then((res) => res.json()) // Parse the response data as JSON
          .then((data) => {setItems(data), console.log(data)}); // Update the state with the fetched data
          isLoading(false)
      }, []);

        // Create a collection of JSX elements based on the fetched "items" data
        // const columns = 
        const collection = items.map((item) => {
            return (
            // Use the Material-UI Grid component to display each item in a grid layout
            <Grid key={item.id} id={item.id} xs={3}>
                {/* Display the item name and description */}
                <h3>{item.team_num}</h3>
                <p>Drivetrain: <strong>{item.drivetrain}</strong></p>
                <p>Preferred Start Position(s): <strong>{item.preferred_pos}</strong></p>
                <p>Has Vision Tracking: <strong>{item.vision}</strong></p>
                <p>Scores in Amp or Speaker: <strong>{item.score_height}</strong></p>
                <p>Pickup at floor or HPS: <strong>{item.pickup_pos}</strong></p>
                <p>Can climb: <strong>{item.can_climb}</strong></p>
                <p>Can help others climb: <strong>{item.score_height}</strong></p>
                <p>Survey by: <strong>{item.name}</strong></p>
            </Grid>
            );
        });

    return(
        <>
        <MenuButton/>
        
        <h1>Survey Results</h1>
        <h2>Pit Survey</h2>

        {loading
        ? (<p>Loading...</p>)
        : (
            <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          //   className={styles.grid}
          >
            {collection} {/* Render the collection of items */}
          </Grid>
        )}

        <h2>Match Survey</h2>
        <p>Coming soon!</p>
        </>
    )
}