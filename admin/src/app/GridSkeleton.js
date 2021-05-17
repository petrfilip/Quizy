import React from 'react';
import { Grid } from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";



const defaultGridItemSizes = {
  xs: 12,
  sm: 6,
  md: 3,
  lg: 2,
  xl: 2
}

const GridSkeleton = ({gridItemSizes = defaultGridItemSizes, numberOfItems = 9, itemHeight = 80, spacing = 4}) => {
  return (
    <Grid
      style={{ marginTop: "10px" }}
      container
      spacing={spacing}
      justify="center"
    >
      {Array.from(new Array(numberOfItems))
        .map((item, i) => <Grid key={`skeletonItem-${i}`} item {...gridItemSizes}>
          <Skeleton animation="wave" variant="rect" height={itemHeight}/>
        </Grid>)}

    </Grid>
  );
};

export default GridSkeleton;