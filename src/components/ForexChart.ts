import { Bar } from '../models/Bar';
import { JsonDataProvider } from './dataProviders/JsonDataProvider';
import { CanvasChartRenderer } from './chartRenderers/CanvasChartRenderer';
import { Tooltip } from './tooltips/Tooltip';
import { InputHandler } from './inputHandlers/InputHandlers';

class ForexChart {
  private canvas: HTMLCanvasElement;
  private data: Bar[] = [];
  private dataProvider: JsonDataProvider;
  private visibleBars: number = 50;
  private startIndex: number = 0;
  private isDragging: boolean = false;
  private dragStartX: number = 0;
  private highlightedDataPointIndex: number | null = null;
  private chartRenderer: CanvasChartRenderer;
  private tooltip: Tooltip;
  private rangeInputHandler: InputHandler | null = null;
  private xAxisLabel: HTMLDivElement | null = null;
  private yAxisLabel: HTMLDivElement | null = null;
  private chartHeight: number = 0;
  private chartWidth: number = 0;

  constructor(canvasId: string, apiUrl: string) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    this.chartHeight = this.canvas.height;
    this.chartWidth = this.canvas.width;
    this.dataProvider = new JsonDataProvider(apiUrl);
    this.chartRenderer = new CanvasChartRenderer(canvasId);
    this.tooltip = new Tooltip();
    this.setupEventListeners();
    this.loadData();
    this.setupRangeInputHandler();
    this.setupAxisLabels();
  }

  private setupEventListeners(): void {
    this.canvas.addEventListener('wheel', this.handleWheel.bind(this));
    this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
    this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  private async loadData(): Promise<void> {
    try {
      this.data = await this.dataProvider.fetchData();
      this.renderChart();
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  private renderChart(): void {
    this.chartRenderer.setData(this.data);
    this.chartRenderer.renderChart();
    this.updateAxisLabels();
    this.highlightDataPoint();
  }

  private updateAxisLabels(): void {
    if (!this.xAxisLabel || !this.yAxisLabel) return;

    const startDate = new Date(this.data[this.startIndex].timestamp * 1000);
    const endDate = new Date(this.data[this.startIndex + this.visibleBars - 1].timestamp * 1000);
    const xAxisLabelText = `Timestamp Range: ${startDate.toLocaleString()} - ${endDate.toLocaleString()}`;
    this.xAxisLabel.textContent = xAxisLabelText;

    const minPrice = Math.min(...this.data.slice(this.startIndex, this.startIndex + this.visibleBars).map(bar => bar.low));
    const maxPrice = Math.max(...this.data.slice(this.startIndex, this.startIndex + this.visibleBars).map(bar => bar.high));
    const yAxisLabelText = `Price Range: ${minPrice.toFixed(4)} - ${maxPrice.toFixed(4)}`;
    this.yAxisLabel.textContent = yAxisLabelText;
  }

  private highlightDataPoint(): void {
    if (this.highlightedDataPointIndex !== null) {
      const highlightedBar = this.data[this.highlightedDataPointIndex];
      const x = (this.highlightedDataPointIndex - this.startIndex) * (this.chartRenderer.getBarWidth() + this.chartRenderer.getBarGap());
      const y = this.chartHeight - ((highlightedBar.close - 100) / 100) * this.chartHeight;

      this.chartRenderer.highlightDataPoint(x, y);
      this.tooltip.displayTooltip(highlightedBar, x, y);
    }
  }

  private handleWheel(event: WheelEvent): void {
    const deltaY = event.deltaY;
    if (deltaY < 0) {
      this.zoomIn();
    } else {
      this.zoomOut();
    }
    this.renderChart();
  }

  private zoomIn(): void {
    if (this.visibleBars > 10) {
      this.visibleBars -= 5;
    }
  }

  private zoomOut(): void {
    if (this.visibleBars < this.data.length) {
      this.visibleBars += 5;
    }
  }

  private handleMouseDown(event: MouseEvent): void {
    this.isDragging = true;
    this.dragStartX = event.clientX;
  }

  private handleMouseMove(event: MouseEvent): void {
    if (this.isDragging) {
      const mouseX = event.clientX - this.canvas.getBoundingClientRect().left;
      const deltaX = mouseX - this.dragStartX;
      const barsDragged = Math.floor(deltaX / (this.chartRenderer.getBarWidth() + this.chartRenderer.getBarGap()));
      if (barsDragged !== 0) {
        this.startIndex -= barsDragged;
        this.renderChart();
        this.dragStartX = mouseX;
      }
    } else {
      const mouseX = event.clientX - this.canvas.getBoundingClientRect().left;
      const mouseY = event.clientY - this.canvas.getBoundingClientRect().top;
      const barIndex = Math.floor(mouseX / (this.chartRenderer.getBarWidth() + this.chartRenderer.getBarGap())) + this.startIndex;

      if (barIndex >= this.startIndex && barIndex < this.startIndex + this.visibleBars) {
        this.highlightedDataPointIndex = barIndex;
      } else {
        this.highlightedDataPointIndex = null;
      }

      this.renderChart();
    }
  }

  private handleMouseUp(event: MouseEvent): void {
    this.isDragging = false;
  }

  private handleResize(): void {
    this.chartHeight = this.canvas.height;
    this.chartWidth = this.canvas.width;
    this.chartRenderer.updateChartDimensions();
    this.renderChart();
  }

  private setupRangeInputHandler(): void {
    this.rangeInputHandler = new InputHandler(this.createRangeInput(), () => {
      if (!this.rangeInputHandler) return;
      this.visibleBars = parseInt((this.rangeInputHandler.element as HTMLInputElement).value);
      this.renderChart();
    });
  }

  private setupAxisLabels(): void {
    this.xAxisLabel = this.createAxisLabel('axis-label', 'x-axis-label');
    this.yAxisLabel = this.createAxisLabel('axis-label', 'y-axis-label');
  }

  private createRangeInput(): HTMLInputElement {
    const input = document.createElement('input');
    input.type = 'range';
    input.min = '1';
    input.max = this.data.length.toString();
    input.value = this.visibleBars.toString();
    document.body.appendChild(input);
    return input;
  }

  private createAxisLabel(...classNames: string[]): HTMLDivElement {
    const label = document.createElement('div');
    label.classList.add(...classNames);
    document.body.appendChild(label);
    return label;
  }
}

export { ForexChart };
