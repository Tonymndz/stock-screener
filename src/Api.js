import axios from 'axios'
import { Link as RouterLink } from 'react-router-dom'
import { Link as MaterialUILink } from '@material-ui/core'

const API_URL = 'https://financialmodelingprep.com'
const API_KEY = '493ccb87fb242d4be9448548654bf037'

// to="/characters", Having '/' in the beginning replaces whole pathname else adds to pathname
export const Link = (props) => <MaterialUILink component={RouterLink} to={props.to}>{props.children}</MaterialUILink>

export const getMatchingStocks = async (symbol) => (await axios.get(`${API_URL}/api/v3/search?query=${symbol}&limit=10&apikey=${API_KEY}`)).data
export const getStock = async (symbol) => (await axios.get(`${API_URL}/api/v3/profile/${symbol}?apikey=${API_KEY}`)).data[0]
export const getStockQuota = async (symbol) => (await axios.get(`${API_URL}/api/v3/quote/${symbol}?apikey=${API_KEY}`)).data[0]
export const getMultipleStockQuotas = async (symbols) => (await axios.get(`${API_URL}/api/v3/quote/${symbols.join(",")}?apikey=${API_KEY}`)).data
export const getMultipleStocks = async (symbols) => (await axios.get(`${API_URL}/api/v3/profile/${symbols.join(",")}?apikey=${API_KEY}`)).data
export const getStockNews = async (symbol) => (await axios.get(`${API_URL}/api/v3/stock_news?tickers=${symbol}&limit=4&apikey=${API_KEY}`)).data
export const getStockRating = async (symbol) => (await axios.get(`${API_URL}/api/v3/rating/${symbol}?apikey=${API_KEY}`)).data[0]
export const getTrendingStocks = async () => (await axios.get(`${API_URL}/api/v3/actives?apikey=${API_KEY}`)).data
export const getStockHistory = async (symbol) => (await axios.get(`${API_URL}/api/v3/historical-price-full/${symbol}?apikey=${API_KEY}`)).data

export const cutLongText = (text, maxLength) => text <= maxLength ? text : `${text.slice(0, maxLength)}...`
export const homeStockSymbols = ['TSLA', 'AAPL', 'MSFT', 'GOOG', 'FB', 'GME', 'JPM', 'BABA',' WMT',
 'NVDA', 'V', 'NFLX', 'NKE', 'ADBE', 'KO', 'CSCO', 'MCD', 'UPS', 'ABNB', 'HD']

const fmtCmpt = Intl.NumberFormat("en", { notation: "compact" });
const fmtComma = Intl.NumberFormat("en", { notation: "standard" });

export function numCmptFormat(value) {
  const num = parseFloat(value).toFixed(2);
  return Math.abs(num) >= 1000 ? fmtCmpt.format(num) : num
}

export function numCommaFormat(value) {
  const num = parseFloat(value).toFixed(2);
  return fmtComma.format(num)
}

export function ratingColors(textRating) {
  switch (textRating.toLowerCase()) {
    case 'strong buy': return 'text-green-400'
    case 'buy': return 'text-green-500'
    case 'neutral': return 'text-gray-400'
    case 'sell': return 'text-gray-500'
    case 'strong sell': return 'text-red-400'
    default: return 'text-gray-400'
  }
}

export const change2Percent = (price, changeDollarAmount) => ((price / (price - changeDollarAmount) - 1) * 100).toFixed(2)

// Solves most of your date problems -> Date.parse("2021-02-19")