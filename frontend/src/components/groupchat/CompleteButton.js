import React from 'react'

import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'

const CompleteButton = ({ handleComplete }) => {

  return (
    <form onSubmit={handleComplete} >
      <Grid container m={3} spacing={3}>
        <Grid item xs={2}>
          <Button
            appearance='primary'
            type='submit'
          >
            Complete Task
          </Button>
        </Grid>
      </Grid>
    </form >
  )
}

export default CompleteButton