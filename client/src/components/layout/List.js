import React from 'react'
import styled from 'styled-components'
import { useAsyncDebounce, useFilters, useGlobalFilter, useTable } from 'react-table'
import { Grid, TextField } from "@material-ui/core";
// A great library for fuzzy filtering/sorting items

// Define a default UI for filtering
function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length
  const [value, setValue] = React.useState(globalFilter)
  const onChange = useAsyncDebounce(value => {
    setGlobalFilter(value || undefined)
  }, 0)

  return (
    <TextField fullWidth id="outlined-basic"
               label="Search"
               variant="outlined"
               value={value || ""}
               onChange={e => {
                 setValue(e.target.value);
                 onChange(e.target.value);
               }}
               placeholder={`${count} records...`}/>

  )
}

// Define a default UI for filtering
function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}) {
  const count = preFilteredRows.length

  return (
    <input
      value={filterValue || ''}
      onChange={e => {
        setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${count} records...`}
    />
  )
}

function fuzzyTextFilterFn(rows, id, filterValue) {
  return "matchSorter(rows, filterValue, { keys: [row => row.values[id]] })"
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = val => !val

// Our table component
function Table({ columns, data, component, gridSizes }) {
  const filterTypes = React.useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows, id, filterValue) => {
        return rows.filter(row => {
          const rowValue = row.values[id]
          return rowValue !== undefined
            ? String(rowValue)
              .toLowerCase()
              .startsWith(String(filterValue).toLowerCase())
            : true
        })
      },
    }),
    []
  )

  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    []
  )

  const {
    rows,
    state,
    preGlobalFilteredRows,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      defaultColumn, // Be sure to pass the defaultColumn option
      filterTypes,
    },
    useFilters, // useFilters!
    useGlobalFilter // useGlobalFilter!
  )

  return (
    <>


      {defaultEmptyColumns[0].accessor !== columns[0].accessor && <GlobalFilter
        preGlobalFilteredRows={preGlobalFilteredRows}
        globalFilter={state.globalFilter}
        setGlobalFilter={setGlobalFilter}
      />}


      <Grid
        style={{ marginTop: "10px" }}
        container
        spacing={4}
        // className={classes.gridContainer}
        justify="center"
      >
        {rows.map(({ original }, i) => (
          <Grid key={`listItem-${i}`} item {...gridSizes}>
            {component(original)}
          </Grid>
        ))}

        {state.globalFilter && rows.length === 0 &&
        <Grid key={`not-found-item`} item xs={12} sm={12} md={13} lg={12} xl={12}>
          No item correspond to search criteria
        </Grid>}


      </Grid>


    </>
  )
}

// Define a custom filter filter function!
function filterGreaterThan(rows, id, filterValue) {
  return rows.filter(row => {
    const rowValue = row.values[id]
    return rowValue >= filterValue
  })
}

// This is an autoRemove method on the filter function that
// when given the new filter value and returns true, the filter
// will be automatically removed. Normally this is just an undefined
// check, but here, we want to remove the filter if it's not a number
filterGreaterThan.autoRemove = val => typeof val !== 'number'

const defaultEmptyColumns = [
  {
    Header: 'a',
    accessor: 'b'
  }
];

const defaultGridItemSizes = {
  xs: 12,
  sm: 6,
  md: 3,
  lg: 2,
  xl: 2
}

export default function List({ columns = defaultEmptyColumns, data, component, gridSizes = defaultGridItemSizes }) {
  return (<Table columns={columns} data={data} component={component} gridSizes={gridSizes}/>
  )
}

