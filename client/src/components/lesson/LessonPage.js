import { Link as RouterLink } from "react-router-dom";
import { useLayoutEffect, useState } from "react";
import { Card, CardActions, CardMedia, Container } from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import List from "../layout/List";
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import LessonItemCard from "./LessonItemCard";

export default function LessonPage() {

  const [data, setData] = useState([])
  const [isPending, setIsPending] = useState(true)
  const [error, setError] = useState()

  useLayoutEffect(() => {
    fetch(`${process.env.REACT_APP_BASE_URI}/lessons`)
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        throw new Error(`Unable to get data: ${response.statusText}`)
      })
      .then(json => setData(json))
      .catch((err) => setError(err.message))
      .finally(() => setIsPending(false))

  }, [])


  const columns = [
    {
      Header: 'Title',
      accessor: 'title'
    }
  ];

  return <Container maxWidth={"lg"}>
    <Typography variant="h2">All lessons</Typography>
    {/*{isPending && "Loading data"}*/}
    {error}
    <List columns={columns} data={data} component={(item) => LessonItemCard(item, ()=>{})}/>
  </Container>

}




