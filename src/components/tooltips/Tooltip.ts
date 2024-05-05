// Tooltip.ts
import { Bar } from '../../models/Bar';

export class Tooltip {
  private tooltip: HTMLDivElement;

  constructor() {
    this.tooltip = document.createElement('div');
    this.tooltip.classList.add('tooltip');
    document.body.appendChild(this.tooltip);
  }

  displayTooltip(bar: Bar, x: number, y: number): void {
    const tooltipContent = `Open: ${bar.open.toFixed(4)}<br>
                            High: ${bar.high.toFixed(4)}<br>
                            Low: ${bar.low.toFixed(4)}<br>
                            Close: ${bar.close.toFixed(4)}<br>
                            Timestamp: ${new Date(bar.timestamp * 1000).toLocaleString()}`;
    this.tooltip.innerHTML = tooltipContent;
    this.tooltip.style.display = 'block';
    this.tooltip.style.top = `${y}px`;
    this.tooltip.style.left = `${x}px`;
  }

  hideTooltip(): void {
    this.tooltip.style.display = 'none';
  }
}
