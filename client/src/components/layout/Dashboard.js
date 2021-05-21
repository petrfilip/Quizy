import React from 'react';
import { Container, Typography } from "@material-ui/core";
import useExam from "./ExamHook";

function Dashboard(props) {

  return (
    <Container maxWidth={"lg"}>
      <Typography variant="h2">Dashboard</Typography>
    </Container>
  );
}

export default Dashboard;