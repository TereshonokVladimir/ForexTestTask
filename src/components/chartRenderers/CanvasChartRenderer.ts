import { Bar } from '../../models/Bar';

export class CanvasChartRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private chartHeight: number;
  private chartWidth: number;
  private data: Bar[] = [];
  private barWidth: number = 10;
  private barGap: number = 2;
  private visibleBars: number = 50;
  private startIndex: number = 0;

  constructor(canvasId: string) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')!;
    this.chartHeight = this.canvas.height;
    this.chartWidth = this.canvas.width;
  }

  setData(data: Bar[]): void {
    this.data = data;
  }

  renderChart(): void {
    this.clearCanvas();
    this.drawBars();
  }

  clearCanvas(): void {
    this.ctx.clearRect(0, 0, this.chartWidth, this.chartHeight);
  }

  drawBars(): void {
    const barsToRender = this.data.slice(this.startIndex, this.startIndex + this.visibleBars);
    const barSpacing = this.barWidth + this.barGap;
    let x = 0;
    for (const bar of barsToRender) {
      const y = this.chartHeight - ((bar.close - 100) / 100) * this.chartHeight;
      const barHeight = (bar.close - bar.open) / 100 * this.chartHeight;
      this.ctx.fillStyle = bar.close > bar.open ? 'green' : 'red';
      this.ctx.fillRect(x, y, this.barWidth, barHeight);
      x += barSpacing;
    }
  }

  // New methods
  getBarWidth(): number {
    return this.barWidth;
  }

  getBarGap(): number {
    return this.barGap;
  }

  highlightDataPoint(x: number, y: number): void {
    const radius = 5;
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
    this.ctx.fillStyle = 'yellow';
    this.ctx.fill();
  }
  
  updateChartDimensions(): void {
    this.chartHeight = this.canvas.height;
    this.chartWidth = this.canvas.width;
    this.renderChart(); 
  }
}
