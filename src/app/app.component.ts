import { Component } from '@angular/core';
import { CurrencyService } from './services/currency.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  selectedCurrency: string = 'USD';

  constructor(private currencyServices: CurrencyService) {}
  sendCurrency(event: string) {
    this.currencyServices.setCurrency(event);
  }
}
