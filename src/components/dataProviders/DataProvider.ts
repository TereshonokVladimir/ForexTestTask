import { Bar } from '../../models/Bar';

interface DataProvider {
  fetchData(apiUrl: string): Promise<Bar[]>;
}

export { DataProvider };
