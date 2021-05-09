import { Link as RouterLink, Link } from "react-router-dom";
import { useEffect, useLayoutEffect, useState } from "react";
import { Badge, Card, CardActions } from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import MenuBookIcon from "@material-ui/icons/MenuBook";
import Button from "@material-ui/core/Button";
import List from "../layout/List";
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';

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

  return <div>
    {/*{isPending && "Loading data"}*/}
    {error}
    <List columns={columns} data={data} component={(item) => OutlinedCard(item, ()=>{})}/>

    {/*{data.map(item => <div key={`quizLink-${item.slug}`}><Link to={`/course/${item.slug}`}>{item.title}</Link></div>)}*/}
  </div>

}


function OutlinedCard(lessonItem, onClick) {

  return (
    <Card variant="outlined">
      {/*<CardMedia*/}
      {/*  style={{*/}
      {/*    width: "auto",*/}
      {/*    maxHeight: "200px",*/}
      {/*  }}*/}
      {/*  component="img"*/}
      {/*  alt="Contemplative Reptile"*/}
      {/*  image="https://via.placeholder.com/500"*/}
      {/*  title="Contemplative Reptile"*/}
      {/*/>*/}
      <CardContent>
        <Typography>
          {lessonItem.title}
        </Typography>


      </CardContent>
      <CardActions>
        <Button color={"secondary"} component={RouterLink} startIcon={<DoubleArrowIcon/>} to={`/course/${lessonItem.slug}`} >Learn</Button>
      </CardActions>
    </Card>
  );
}



