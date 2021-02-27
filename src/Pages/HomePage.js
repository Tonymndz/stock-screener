import { getMultipleStocks, numCmptFormat, trendingStocks20, Link, change2Percent, numCommaFormat } from '../Api'
import { useQuery } from 'react-query'
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
  const { data: stocks, isLoading, error } = useQuery(`${trendingStocks20.join(" ")}`, () => getMultipleStocks(trendingStocks20))
  if (isLoading) return <CircularProgress />
  if (error) return <Alert severity="error">Unable to get stock data after 3 attempts...</Alert>

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
              <span className="font-bold text-gray-100 text-md tracking-wide  font-serif">EMPLOYEES</span>
            </TableCell>
            <TableCell align="right" className='border-solid border border-gray-700'>
              <span className="font-bold text-gray-100 text-md tracking-wide font-serif">SECTOR</span>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {stocks.map(({ image, symbol, companyName, price, changes,  volAvg, mktCap, fullTimeEmployees, sector }) =>
            <TableRow key={symbol}>
              <TableCell component="th" scope="row">
                <div className="flex">
                  <img src={image} alt={symbol + 'logo'} className="h-8 mr-2"/>
                  <div className="">
                    <Link to={`/profile/${symbol}`}>
                      <span className='block leading-3 text-blue-400 font-semibold'>{symbol}</span>
                    </Link>
                    <span className="text-gray-400">{companyName}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell align="right">
                <span className="font-semibold text-gray-200 font-mono">{price ? '$'+numCommaFormat(price) : '—'}</span>
                </TableCell>
              <TableCell align="right">
                <span className={`${ changes >= 0 ? 'text-green-800 bg-green-300' : 'text-red-900 bg-red-200'} rounded-full px-3 py-1 font-sans`}>{changes ? change2Percent(price, changes)+'%' : '—'}</span>
                </TableCell>
              <TableCell align="right">
                <span className="font-semibold text-gray-200 font-mono">{volAvg ? '$'+numCmptFormat(volAvg) : '—'}</span>
                </TableCell>
              <TableCell align="right">
                <span className="font-semibold text-gray-200 font-sans">{mktCap ? numCmptFormat(mktCap) : '—'}</span>
                </TableCell>
              <TableCell align="right">
                <span className="font-semibold text-gray-200 font-sans">{fullTimeEmployees ? numCmptFormat(fullTimeEmployees) : '—'}</span>
                </TableCell>
              <TableCell align="right">
                <span className="font-semibold text-gray-200 font-serif">{sector || '—'}</span>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  </div>
}

export default HomePage