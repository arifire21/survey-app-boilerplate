"use client";
import React from "react";
import { Grid } from "@mui/joy";
import { useState, useEffect } from "react";
import Image from "next/image";

const items = () => {
  // Define a state variable "items" and a function "setItems" to update the state
  const [items, setItems] = useState([]);

  // Use the useEffect hook to fetch data from the API endpoint when the component mounts
  useEffect(() => {
    fetch("/api/pitsurvey", {
      method: "GET",
      headers: {
        "Content-Type": "application/json", // Set the request headers to indicate JSON format
      },
    })
      .then((res) => res.json()) // Parse the response data as JSON
      .then((data) => setItems(data)); // Update the state with the fetched data
  }, []);

  // Create a collection of JSX elements based on the fetched "items" data
  const collection = items.map((item) => {
    return (
      // Use the Material-UI Grid component to display each item in a grid layout
      <Grid key={item.id} id={item.id} xs={3}>
        {/* Display the item name and description */}
        <h2>{item.teamNumber}</h2>
        <p>{item.drivetrain}</p>
      </Grid>
    );
  });

  // Return the JSX elements wrapped in a Material-UI Grid container
  return (
    <Grid
      container
      rowSpacing={1}
      columnSpacing={{ xs: 1, sm: 2, md: 3 }}
    //   className={styles.grid}
    >
      {collection} {/* Render the collection of items */}
    </Grid>
  );
};

export default items;