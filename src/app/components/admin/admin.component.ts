import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChartData, ChartOptions } from 'chart.js';
import { SalesData } from 'src/app/interfaces/sales-data';
import { TopSelling } from 'src/app/interfaces/top-selling';
import { I18nService } from 'src/app/services/i18n.service';


/**
 * Component responsible for displaying the admin dashboard.
 * It visualizes sales data, order statistics, and top-selling products using charts.
 *
 * @export
 * @class AdminComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  /** Data for orders grouped by status */
  ordersData: SalesData | null = null;

  /** Data for sales grouped by month */
  salesData: SalesData | null = null;

  /** List of top-selling products */
  topSelling: TopSelling[] = [];

  /** Chart data for sales per month */
  chartDataSalesPerMonth: ChartData<'bar'> = { labels: [], datasets: [] };

  /** Chart data for orders categorized by status */
  chartDataOrdersByStatus: ChartData<'bar'> = { labels: [], datasets: [] };

  /** Chart data for top-selling products */
  chartDataTopSelling: ChartData<'bar'> = { labels: [], datasets: [] };

  /** Chart options for all graphs */
  chartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
  };

  /**
   * Creates an instance of AdminComponent.
   * @param {ActivatedRoute} route - Provides access to route data, including resolved dashboard data.
   */
  constructor(
    private route: ActivatedRoute,
  ) { 
    
  }

  /**
   * Lifecycle hook that runs on component initialization.
   * Retrieves and processes dashboard data from the route resolver.
   */
  ngOnInit(): void {
    // Retrieve data from the resolver
    const resolvedData = this.route.snapshot.data['dashboardData'];

    this.ordersData = resolvedData.ordersData;
    this.salesData = resolvedData.salesData;
    this.topSelling = resolvedData.topSelling;

    // Initialize chart configurations
    this.setupCharts();
    this.setupTopSellingChart();
  }

  /**
   * Configures the charts for sales per month and orders by status.
   * Populates the `chartDataSalesPerMonth` and `chartDataOrdersByStatus` properties.
   * 
   * @private
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
              label: 'Orders by Status',
              data: this.ordersData.values,
              backgroundColor: ['#36A2EB', '#FF6384'],
              borderColor: ['#36A2EB', '#FF6384'],
              borderWidth: 2,
            },
          ],
        };
      }
  }

  /**
   * Configures the chart for top-selling products.
   * Populates the `chartDataTopSelling` property.
   *
   * @private
   */
  private setupTopSellingChart(): void {
    if (this.topSelling.length > 0) {
      this.chartDataTopSelling = {
        labels: this.topSelling.map(product => product.productName),
        datasets: [
          {
            label: 'Top Selling Products',
            data: this.topSelling.map(product => product.totalSales),
            backgroundColor: 'rgba(255, 206, 86, 0.5)',
            borderColor: 'rgba(255, 206, 86, 1)',
            borderWidth: 2,
          },
        ],
      };
    }
  }

}
