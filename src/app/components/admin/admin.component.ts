import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChartData, ChartOptions } from 'chart.js';
import { SalesData } from 'src/app/interfaces/sales-data';
import { TopSelling } from 'src/app/interfaces/top-selling';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  ordersData: SalesData | null = null;
  salesData: SalesData | null = null;
  topSelling: TopSelling[] = [];
  chartDataSalesPerMonth: ChartData<'bar'> = { labels: [], datasets: [] };
  chartDataOrdersByStatus: ChartData<'bar'> = { labels: [], datasets: [] };
  chartDataTopSelling: ChartData<'bar'> = { labels: [], datasets: [] };  

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

    this.ordersData = resolvedData.ordersData;
    this.salesData = resolvedData.salesData;
    this.topSelling = resolvedData.topSelling;

    // Configura los gráficos
    this.setupCharts();
    this.setupTopSellingChart(); 
  }
  
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
