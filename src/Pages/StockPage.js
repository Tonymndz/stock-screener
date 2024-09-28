import { format } from "date-fns";
import { useState } from 'react';
import { useQuery } from 'react-query'
import moment from 'moment'
import { getStock, getStockQuota, getStockNews, getStockRating, getTrendingStocks, cutLongText, getStockHistory, numCmptFormat, ratingColors, Link, change2Percent, numCommaFormat } from '../Api'
import ReactHighcharts from 'react-highcharts/ReactHighstock.src'
import { CircularProgress } from "@material-ui/core";
import { Alert } from "@material-ui/lab";

function StockPage(props) {
//   console.log("StockPage(props)");
  const { id: symbol } = props.match.params
  const { data: stock, isLoading, error } = useQuery(`${symbol} Profile`, () => getStock(symbol))
//   console.log("symbol:", symbol);
//   console.log("stock:", stock);
  if (isLoading) return <CircularProgress />
  if (error || !stock || Object.keys(stock).length === 0) return <Alert severity="error">Unable to get stock data after 3 attempts or malformatted Stock Data...</Alert>
  
  const { image: logo, price, companyName, changes } = stock
  return <div className='mx-4 mb-4 text-white'>
    <StockChart logo={logo} price={price} symbol={symbol} companyName={companyName} changes={changes} />
    <About {...stock} />
    <News symbol={symbol} />
    <Ratings symbol={symbol} />
    <TrendingStocks />
  </div>
}

function StockChart({ symbol, logo, price, companyName, changes }) {
  const { data: stockHistorical, isLoading, error } = useQuery(`${symbol} Historical`, () => getStockHistory(symbol))
  if (isLoading) return <CircularProgress />
  if (error || !stockHistorical || stockHistorical[0] || Object.keys(stockHistorical).length === 0 || stockHistorical.hasOwnProperty("Error Message")) 
      return <Alert severity="error">Unable to get stock data after 3 attempts or malformatted Stock Data...</Alert>
  const percentChange = change2Percent(price, changes);
  const stockTitleProps = { percentChange, logo, companyName, symbol, price }
  if (!stockHistorical || Object.keys(stockHistorical).length === 0) return <StockTitle {...stockTitleProps} />

  const wantedDataFormat = stockHistorical.historical.map(stock => [Date.parse(stock.date), stock.close]).reverse()
  const options = { style: "currency", currency: "USD" };
  const numberFormat = new Intl.NumberFormat("en-US", options);
  const chartConfig = {
    yAxis: [
      {
        offset: 20,
        labels: {
          formatter: function () {
            return numberFormat.format(this.value);
          },
          x: -15,
          style: {
            color: "#ccc",
            position: "absolute"
          },
          align: "left"
        }
      }
    ],
    xAxis: [
      {
        lineColor: '#404246',
        tickColor: '#404246',
        labels: {
          style: {
            color: "#ccc",
          },
        }
      }
    ],
    tooltip: {
      shared: true,
      formatter: function () {
        return (
          numberFormat.format(this.y, 0) +
          "</b><br/>" +
          format(this.x, "MMMM dd yyyy")
        );
      }
    },
    plotOptions: {
      series: {
        showInNavigator: true,
        gapSize: 6
      }
    },
    chart: {
      height: 600
    },
    credits: {
      enabled: false
    },
    rangeSelector: {
      buttons: [
        {
          type: "month",
          count: 3,
          text: "3m"
        },
        {
          type: "month",
          count: 6,
          text: "6m"
        },
        {
          type: "month",
          count: 9,
          text: "9m"
        },
        {
          type: "month",
          count: 12,
          text: "1yr"
        },
        {
          type: "all",
          text: "All"
        }
      ],
      selected: 1
    },
    series: [
      {
        name: "Price",
        type: "spline",

        data: wantedDataFormat,
        tooltip: {
          valueDecimals: 2
        }
      }
    ]
  };

  return <div>
    <StockTitle {...stockTitleProps} />
    <ReactHighcharts config={chartConfig}></ReactHighcharts>
  </div>
}

const StockTitle = ({ percentChange, logo, companyName, symbol, price }) => 
  <div className="flex justify-between">
    <div className='flex'>
      <img className='w-16 p-auto m-auto inline-block rounded-md mr-2 mb-2' src={logo} alt='' />
      <div className="">
        <h1 className='text-lg font-bold text-gray-100 tracking-wide leading-8 md:text-4xl'>{symbol}</h1>
        <h1 className='text-blue-100 text-base mb-1 md:text-2x1'>{companyName}</h1>
      </div>
    </div>
    <div className="mr-2 grid sm:flex items-center">
      <h1 className='inline-block text-xl font-bold text-gray-100 tracking-wide ml-1 md:text-4xl'>${numCommaFormat(price)}</h1>
      <h1 className={`${percentChange >= 0 ? 'text-green-400' : 'text-red-400'} inline-block mr-2 text-base font-bold text-gray-100 tracking-wide ml-1 md:text-3xl`}>({percentChange >= 0 ? '+' + percentChange : percentChange }% today)</h1>
    </div>
  </div>



function About({ description, ceo, fullTimeEmployees, city, ipoDate, exchange, country, mktCap, volAvg, symbol, sector, companyName }) {
  const [expand, setExpand] = useState(false);
  const { data: stockQuota, isLoading, error } = useQuery(`${symbol} Quota`, () => getStockQuota(symbol));
  if (isLoading) return <CircularProgress />
  if (error || !stockQuota || stockQuota[0] || Object.keys(stockQuota).length === 0 || stockQuota.hasOwnProperty("Error Message")) 
      return <Alert severity="error">Unable to get stock data after 3 attempts or malformatted Stock Data...</Alert>
  
//   console.log("stockQuota: ", stockQuota)
  const { dayLow, dayHigh, yearHigh, yearLow } = stockQuota;
  return <div className="">
    <h2 className='mt-5 mb-1 text-3xl font-bold text-gray-100 tracking-wide ml-1'>About</h2>
    <hr className='border-gray-500 mb-2' />
    {description && <ReadMore 
      isExpanded={expand}
      more={<p className='mb-5 text-blue-100'>{description}</p>}
      less={<p className='mb-5 text-blue-100'>{cutLongText(description, 300)}<span className='text-green-500 hover:text-green-200 underline cursor-pointer' onClick={() => setExpand(true)}>Show More</span></p>}
    />}
    <div className="grid gap-6 grid-cols-3 sm:grid-cols-5">
      <div className="">
        <h3 className='text-gray-100 text-lg font-semibold tracking-wider leading-4'>CEO</h3>
        <p className="text-blue-100">{ceo || '—'}</p>
        <h3 className='text-gray-100 text-lg font-semibold tracking-wider leading-4 mt-3'>Country</h3>
        <p className="text-blue-100">{country || '—'}</p>
        <h3 className='text-gray-100 text-lg font-semibold tracking-wide leading-4 mt-3'>Year High</h3>
        <p className="text-blue-100">{yearHigh ? '$' + numCmptFormat(yearHigh) : '—'}</p>
      </div>
      <div className="">
        <h3 className='text-gray-100 text-lg font-semibold tracking-wider leading-4'>Employees</h3>
        <p className="text-blue-100">{fullTimeEmployees ? numCmptFormat(fullTimeEmployees) : '—'}</p>
        <h3 className='text-gray-100 text-lg font-semibold tracking-wider leading-4 mt-3'>Market Cap</h3>
        <p className="text-blue-100">{mktCap ? '$' + numCmptFormat(mktCap) : '—'}</p>
        <h3 className='text-gray-100 text-lg font-semibold tracking-wider leading-4 mt-3'>Year Low</h3>
        <p className="text-blue-100">{yearLow ? '$' + numCmptFormat(yearLow) : '—'}</p>
      </div>
      <div className="">
        <h3 className='text-gray-100 text-lg font-semibold tracking-wider leading-4'>Headquarters</h3>
        <p className="text-blue-100">{city || '—'}</p>
        <h3 className='text-gray-100 text-lg font-semibold tracking-wider leading-4 mt-3'>Average Volume</h3>
        <p className="text-blue-100">{volAvg ? '$' + numCmptFormat(volAvg) : '—'}</p>
        <h3 className='text-gray-100 text-lg font-semibold tracking-wider leading-4 mt-3'>Day High</h3>
        <p className="text-blue-100">{dayHigh ? '$' + numCmptFormat(dayHigh) : '—'}</p>
      </div>
      <div className="">
        <h3 className='text-gray-100 text-lg font-semibold tracking-wider leading-4'>IPO Date</h3>
        <p className="text-blue-100">{ipoDate ? moment(ipoDate).format("MMMM Do YYYY") : '—'}</p>
        <h3 className='text-gray-100 text-lg font-semibold tracking-wider leading-4 mt-3'>Symbol</h3>
        <p className="text-blue-100">{symbol || '—'}</p>
        <h3 className='text-gray-100 text-lg font-semibold tracking-wider leading-4 mt-3'>Day Low</h3>
        <p className="text-blue-100">{dayLow ? '$' + numCmptFormat(dayLow) : '—'}</p>
      </div>
      <div className="">
        <h3 className='text-gray-100 text-lg font-semibold tracking-wider leading-4'>Exchange</h3>
        <p className="text-blue-100">{exchange || '—'}</p>
        <h3 className='text-gray-100 text-lg font-semibold tracking-wider leading-4 mt-3'>Sector</h3>
        <p className="text-blue-100">{sector || '—'}</p>
        <h3 className='text-gray-100 text-lg font-semibold tracking-wider leading-4 mt-3'>Company Name</h3>
        <p className="text-blue-100">{companyName || '—'}</p>
      </div>
    </div>
  </div>
}
function News({ symbol }) {
  const { data: news, isLoading, error } = useQuery(`${symbol} News`, () => getStockNews(symbol))
//   console.log("news: ", news)
  if (isLoading) return <CircularProgress />
  if (error || !news || Object.keys(news).length === 0 || news.hasOwnProperty("Error Message")) 
      return <Alert severity="error">Unable to get stock data after 3 attempts or malformatted Stock Data...</Alert>

  return <div className=''>
    <h2 className='mt-5 mb-1 text-3xl font-bold text-gray-100 tracking-wide ml-1'>News</h2>
    <hr className='border-gray-500 mb-2' />
    <div className="grid gap-6 grid-cols-0 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {news.map(singleNews => <SingleNews key={singleNews.text} {...singleNews} />)}
    </div>
  </div>
}

function SingleNews({ image, title, site, publishedDate, url, text, symbol }) {
  return <a className='flex' href={url} title={title} target="_blank" rel="noopener noreferrer">
    <div>
      <p className='mb-1'>
        <span className='text-gray-100 text-base font-semibold tracking-wider leading-4'>{site}</span>
        {' - '}{moment(publishedDate).format("MMMM Do YYYY")}</p>
      <h1 className='text-gray-100 text-lg font-semibold tracking-wide leading-5 mb-1'>{cutLongText(title, 30)}</h1>
      <p className='text-blue-100'>{cutLongText(text, 100)}</p>
    </div>
    <div>
      <img className='w-max mt-5' src={image} alt={`${site} news on ${symbol}`}/>
    </div>
  </a>
}

function Ratings({ symbol }) {
  const { data: stockRating, isLoading, error } = useQuery(`${symbol} Rating`, () => getStockRating(symbol))
  if (isLoading) return <CircularProgress />
  if (error || !stockRating || stockRating[0] || Object.keys(stockRating).length === 0 || stockRating.hasOwnProperty("Error Message")) 
    return <Alert severity="error">Unable to get stock ratings after 3 attempts...</Alert>

    // console.log("stockRating: ", stockRating)
  const {
    ratingDetailsDCFRecommendation, ratingDetailsROERecommendation,
    ratingDetailsROARecommendation, ratingDetailsDERecommendation,
    ratingDetailsPERecommendation, ratingDetailsPBRecommendation
  } = stockRating;

  return <div className="mt-2">
    <h2 className='mb-1 text-3xl font-bold text-gray-100 tracking-wide ml-1'>Ratings</h2>
    <hr className='border-gray-500 mb-3' />
    <div className="grid gap-6 grid-cols-3 sm:grid-cols-6">
      <div className="">
        <h3 className='text-gray-100 text-lg font-semibold tracking-wider leading-4'>DFC</h3>
        <p className={`text-lg ${ratingColors(ratingDetailsDCFRecommendation)}`}>{ratingDetailsDCFRecommendation || '—'}</p>
      </div>
      <div className="">
        <h3 className='text-gray-100 text-lg font-semibold tracking-wider leading-4'>ROE</h3>
        <p className={`text-lg ${ratingColors(ratingDetailsROERecommendation)}`}>{ratingDetailsROERecommendation || '—'}</p>
      </div>
      <div className="">
        <h3 className='text-gray-100 text-lg font-semibold tracking-wider leading-4'>ROA</h3>
        <p className={`text-lg ${ratingColors(ratingDetailsROARecommendation)}`}>{ratingDetailsROARecommendation || '—'}</p>
      </div>
      <div className="">
        <h3 className='text-gray-100 text-lg font-semibold tracking-wider leading-4'>DER</h3>
        <p className={`text-lg ${ratingColors(ratingDetailsDERecommendation)}`}>{ratingDetailsDERecommendation || '—'}</p>
      </div>
      <div className="">
        <h3 className='text-gray-100 text-lg font-semibold tracking-wider leading-4'>PER</h3>
        <p className={`text-lg ${ratingColors(ratingDetailsPERecommendation)}`}>{ratingDetailsPERecommendation || '—'}</p>
      </div>
      <div className="">
        <h3 className='text-gray-100 text-lg font-semibold tracking-wider leading-4'>PBR</h3>
        <p className={`text-lg ${ratingColors(ratingDetailsPBRecommendation)}`}>{ratingDetailsPBRecommendation || '—'}</p>
      </div>
    </div>
  </div>
}

function TrendingStocks() {
  const { data: trendingStocks, isLoading, error } = useQuery('Trending Stocks', getTrendingStocks)
  if (isLoading) return <CircularProgress />
  if (error || !trendingStocks || Object.keys(trendingStocks).length === 0 || trendingStocks.hasOwnProperty("Error Message")) 
    return <Alert severity="error">Unable to get stock ratings after 3 attempts...</Alert>

  return <div className='mt-2'>
    <h2 className='mt-5 mb-1 text-3xl font-bold text-gray-100 tracking-wide ml-1'>Trending Stocks</h2>
    <hr className='border-gray-500 mb-3' />
    <div className="grid gap-5 grid-cols-3 sm:grid-cols-6 md:grid-cols-6 lg:grid-cols-9  xl:grid-cols-13 ">
      {trendingStocks.slice(0, 18).map(trendingStock => <TrendingStock key={trendingStock.ticker} {...trendingStock} />)}
    </div>
  </div>
}

const TrendingStock = ({ ticker, price, companyName, changesPercentage }) => {
  return <Link to={`profile/${ticker}`}>
    <div className='pl-2 py-1 text-white rounded-sm border-gray-700 border' style={{ background: '#131515'}}>
      <h2 className='font-semibold tracking-wide leading-4'>{companyName ? cutLongText(companyName, 20) : '—'}</h2>
      <h1>{price ? '$'+numCmptFormat(price) : '—'}</h1>
      <h3 className={`${changesPercentage.includes('-') ? 'text-red-400' : 'text-green-400'}`}>{formattedChangesPercentage(changesPercentage)}</h3>
    </div>
  </Link>
}

function ReadMore({ isExpanded, more, less }) {
  return isExpanded ? more : less
}

function formattedChangesPercentage(changesPercentage) {
  if (!changesPercentage) return "—";
  return changesPercentage.startsWith("-") ? `${numCommaFormat(changesPercentage)}%` : `+${numCommaFormat(changesPercentage)}%`
}

export default StockPage