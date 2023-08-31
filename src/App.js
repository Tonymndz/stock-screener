import { useState } from 'react';
import HomePage from './Pages/HomePage';
import StockPage from './Pages/StockPage';
import { Route, Switch, useHistory } from 'react-router-dom';
import { Alert, Autocomplete } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core';
import { useQuery } from 'react-query'
import { Link, getMatchingStocks } from './Api'
import Logo from './StockIcon.png'

const App = () => {
  return <div className="App min-h-screen">
    <NavBar />
    <Switch>
      <Route path='/stock-screener/profile/:id' exact component={StockPage} />
      <Route path='/stock-screener' exact component={HomePage} />
    </Switch>
  </div>;
}

const useStyles = makeStyles(theme => ({
  paper: {
    border: "5px solid rgb(25, 26, 26)",
    backgroundColor: "#1d1e1e",
    color: "white",
    fontSize: '16px'
  },
}));

const NavBar = () => {
  const classes = useStyles();
  const history = useHistory()
  const [text, setText] = useState('')
  const { data: stockNames, error } = useQuery(`${text}`, () => getMatchingStocks(text))
  if (error) return <Alert severity="error">Unable to get stock data after 3 attempts...</Alert>
  return <div className="flex pt-1 pb-1 mb-4">
    <Link to='/stock-screener' className='inline-block'>
      <img className='inline-block rounded-md w-14 pl-1 ml-1 mr-3' src={Logo} alt=''/>
    </Link>
    <Autocomplete
      autoComplete
      style={{ width: '100%', color:'white'}}
      classes={classes}
      inputValue={text}
      noOptionsText={null}
      onInputChange={(evt, input) => setText(input)}
      options={stockNames || []}
      onChange={(evt, option) => option && history.push(`stock-screener/profile/${option.symbol}`)} // Runs when you pick an option OR after an option has been picked and text is deleted
      getOptionLabel={(option) => `${option.symbol} - ${option.name || ''}` }
      renderInput={(params) =>
        <div className='pr-2 pt-1' ref={params.InputProps.ref}>
          <input style={{ borderRadius: '9px', padding: '10px', width: '100%', background: '#1d1e1e', color: 'white' }}
            {...params.inputProps} placeholder="Search Stocks" />
        </div>
      }
    />
  </div>
}

export default App;
