import { ForexChart } from './components/ForexChart';

const canvasId = 'chartCanvas';
const apiUrl = 'https://beta.forextester.com/data/api/Metadata/bars/chunked?Broker=Advanced&Symbol=EURUSD&Timeframe=1&Start=57674&End=59113&UseMessagePack=false';

const forexChart = new ForexChart(canvasId, apiUrl);