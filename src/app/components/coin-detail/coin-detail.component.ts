import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { CurrencyService } from 'src/app/services/currency.service';

@Component({
  selector: 'app-coin-detail',
  templateUrl: './coin-detail.component.html',
  styleUrls: ['./coin-detail.component.scss'],
})
export class CoinDetailComponent implements OnInit {
  coinData: any;
  coinId!: string;
  days: number = 1;
  currency: string = 'USD';

  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        label: `Price Trends`,
        backgroundColor: 'rgba(148,159,177,0.2)',
        borderColor: '#e1b44b',
        pointBackgroundColor: '#e1b44b',
        pointBorderColor: '#e1b44b',
        pointHoverBackgroundColor: '#e1b44b',
        pointHoverBorderColor: '#e1b44b',
      },
    ],
    labels: [],
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    elements: {
      point: {
        radius: 1,
      },
    },

    plugins: {
      legend: { display: true },
    },
  };
  public lineChartType: ChartType = 'line';
  @ViewChild(BaseChartDirective) myLineChart!: BaseChartDirective;

  constructor(
    private api: ApiService,
    private activatedRoute: ActivatedRoute,
    private currencyServices: CurrencyService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((val) => {
      this.coinId = val['id'];
    });
    this.getCoinData();
    this.getGraphData(this.days);
    this.currencyServices.getCurrency().subscribe((val) => {
      this.currency = val;
      this.getGraphData(this.days);
      this.getCoinData();
    });
  }

  getCoinData() {
    this.api.getCurrencyById(this.coinId).subscribe((res) => {
      if (this.currency === 'EUR') {
        res.market_data.current_price.usd = res.market_data.current_price.eur;
        res.market_data.market_cap.usd = res.market_data.market_cap.eur;
      }

      this.coinData = res;
    });
  }
  getGraphData(days: number) {
    this.days = days;
    this.api
      .getGraphicalCurrencyData(this.coinId, this.currency, this.days)
      .subscribe((res) => {
        setTimeout(() => {
          this.myLineChart.chart?.update();
        }, 200);
        this.lineChartData.datasets[0].data = res.prices.map((a: any) => {
          return a[1];
        });
        this.lineChartData.labels = res.prices.map((a: any) => {
          let date = new Date(a[0]);
          let time =
            date.getHours() > 12
              ? `${date.getHours() - 12} : ${date.getMinutes()}PM`
              : `${date.getHours()} : ${date.getMinutes()}AM`;
          return this.days === 1 ? time : date.toLocaleDateString();
        });
      });
  }
}
