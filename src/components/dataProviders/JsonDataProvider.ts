// JsonDataProvider.ts
import { Bar } from '../../models/Bar';

export class JsonDataProvider {
  private readonly apiUrl: string;

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  async fetchData(): Promise<Bar[]> {
    try {
      const response = await fetch(this.apiUrl);
      const json = await response.json();
      return json.bars;
    } catch (error) {
      console.error('Error fetching data:', error);
      return [];
    }
  }
}
