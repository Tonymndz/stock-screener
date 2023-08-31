import { getMultipleStockQuotas, numCmptFormat, homeStockSymbols, Link, change2Percent, numCommaFormat, getStock } from '../Api'
import { useQuery, useQueries } from 'react-query'
import { CircularProgress, Table, TableBody, TableCell as MuiTableCell , TableContainer, TableHead, TableRow, withStyles} from '@material-ui/core';
import { Alert } from '@material-ui/lab';

const HomePage = () => {
  return <div className='mb-4 mx-2'>
    <h1 className='my-7 ml-7 text-5xl font-bold text-green-500'>
      <span className="text-white">Stock</span> Screener
    </h1>
    {/* <Footer /> */}
    <TableOfTrendingStocks />
  </div>
}

const TableCell = withStyles({
  root: { 
    'border-bottom': '1px solid #374151'
  }
})(MuiTableCell);

const TableOfTrendingStocks = () => {
  // console.log("homeStockSymbols: ", homeStockSymbols)
  const { data: stocks, isLoading, error } = useQuery(`${homeStockSymbols.join(" ")}`, () => getMultipleStockQuotas(homeStockSymbols))
  // const { data: stocks, isLoading, error } = useQueries(homeStockSymbols.map(symbol => ({ queryKey: `HomeStocks: ${symbol}`, queryFn: () => getStock(symbol)}) ))
  // const stocksFetched = useQueries(homeStockSymbols.map(symbol => ({ queryKey: `HomeStocks: ${symbol}`, queryFn: () => getStock(symbol)}) ))
  // console.log("Stocks", wat)
  // for (let stockFetched in stocksFetched) {
  //   const { data: stock, isLoading, error } = stockFetched;
    if (isLoading) return <CircularProgress />
    if (error) return <Alert severity="error">Unable to get stock data after 3 attempts...</Alert>
  // }

  // return


  // homeStockSymbols.map(({ data: stocks, isLoading, error }) => {

  // })
  // if (isLoading) return <CircularProgress />
  // if (error) return <Alert severity="error">Unable to get stock data after 3 attempts...</Alert>
  // return <div></div>

  return <div>
    <TableContainer>
      <Table size="small" aria-label="a dense table">
        <TableHead >
          <TableRow>
            <TableCell className='border-solid border border-gray-700 font-serif'>
            <span className="font-bold text-gray-100 text-md tracking-wider font-serif">TICKER</span>
            </TableCell>
            <TableCell align="right" className='border-solid border border-gray-700'>
              <span className="font-bold text-gray-100 text-md tracking-wide font-serif">PRICE</span>
            </TableCell>
            <TableCell align="right" className='border-solid border border-gray-700'>
              <span className="font-bold text-gray-100 text-md tracking-wide font-serif">CHG %</span>
            </TableCell>
            <TableCell align="right" className='border-solid border border-gray-700'>
              <span className="font-bold text-gray-100 text-md tracking-wide font-serif">VOL</span>
            </TableCell>
            <TableCell align="right" className='border-solid border border-gray-700'>
              <span className="font-bold text-gray-100 text-md tracking-wide font-serif">MKT Cap</span>
            </TableCell>
            <TableCell align="right" className='border-solid border border-gray-700'>
              <span className="font-bold text-gray-100 text-md tracking-wide  font-serif">DAY LOWEST</span>
            </TableCell>
            <TableCell align="right" className='border-solid border border-gray-700'>
              <span className="font-bold text-gray-100 text-md tracking-wide font-serif">DAY HIGHEST</span>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {stocks.map(({ symbol, name, price, change, avgVolume, marketCap, dayHigh, dayLow }) =>
            <TableRow key={symbol}>
              <TableCell component="th" scope="row">
                <div className="flex">
                  <img src={`https://financialmodelingprep.com/image-stock/${symbol}.png`} alt={symbol + 'logo'} className="h-8 mr-2"/>
                  <div className="">
                    <Link to={`/stock-screener/profile/${symbol}`}>
                      <span className='block leading-3 text-blue-400 font-semibold'>{symbol}</span>
                    </Link>
                    <span className="text-gray-400">{name}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell align="right">
                <span className="font-semibold text-gray-200 font-mono">{price ? '$'+numCommaFormat(price) : '—'}</span>
                </TableCell>
              <TableCell align="right">
                <span className={`${ change >= 0 ? 'text-green-800 bg-green-300' : 'text-red-900 bg-red-200'} rounded-full px-3 py-1 font-sans`}>{change ? change2Percent(price, change)+'%' : '—'}</span>
                </TableCell>
              <TableCell align="right">
                <span className="font-semibold text-gray-200 font-mono">{avgVolume ? '$'+numCmptFormat(avgVolume) : '—'}</span>
                </TableCell>
              <TableCell align="right">
                <span className="font-semibold text-gray-200 font-mono">{marketCap ? numCmptFormat(marketCap) : '—'}</span>
                </TableCell>
              <TableCell align="right">
                <span className="font-semibold text-gray-200 font-sans">{dayLow ? '$'+numCommaFormat(dayLow) : '—'}</span>
                </TableCell>
              <TableCell align="right">
                <span className="font-semibold text-gray-200 font-sans">{dayHigh ? '$'+numCommaFormat(dayHigh) : '—'}</span>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  </div>
}

export default HomePage