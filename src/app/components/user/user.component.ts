import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChartData, ChartOptions } from 'chart.js';
import { OrderAndProductDto } from 'src/app/interfaces/order-and-product-dto';
import { SalesData } from 'src/app/interfaces/sales-data';

/**
 * Component that displays user-related information and charts for sales and orders.
 */
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {

  /** Last 4 user orders */
  last4Orders: OrderAndProductDto[] = [];

  /** Sales data per month */
  salesData: SalesData | null = null;

  /** Order data by status */
  ordersData: SalesData | null = null;

  /** Chart data for sales per month */
  chartDataSalesPerMonth: ChartData<'bar'> = { labels: [], datasets: [] };

  /** Chart data for orders by status */
  chartDataOrdersByStatus: ChartData<'bar'> = { labels: [], datasets: [] };

  /** Chart configuration options */
  chartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
  };

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Obtén los datos del resolver
    const resolvedData = this.route.snapshot.data['dashboardData'];

    this.last4Orders = resolvedData.last4Orders;
    this.salesData = resolvedData.salesData;
    this.ordersData = resolvedData.ordersData;

    // Configura los gráficos
    this.setupCharts();
  }

  /**
   * Configures the data for sales and orders charts.
   */
  private setupCharts(): void {
    if (this.salesData) {
      this.chartDataSalesPerMonth = {
        labels: this.salesData.labels,
        datasets: [
          {
            label: 'Orders per Month',
            data: this.salesData.values,
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
          },
        ],
      };
    }

    if (this.ordersData) {
      this.chartDataOrdersByStatus = {
        labels: this.ordersData.labels,
        datasets: [
          {
            label: 'Orders by status',
            data: this.ordersData.values,
            backgroundColor: ['#36A2EB', '#FF6384'],
            borderColor: ['#36A2EB', '#FF6384'],
            borderWidth: 2,
          },
        ],
      };
    }
  }
}