import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import fetch from 'node-fetch';

@Injectable()
export class ApiService {
  private readonly BASE_URL = process.env.FRANKFURTER_BASE_URL || 'https://api.frankfurter.dev/v1';

  async getLatestRates(base: string = 'EUR', symbols?: string) {
    try {
      const params = new URLSearchParams();
      if (base) params.append('base', base);
      if (symbols) params.append('symbols', symbols);

      const url = `${this.BASE_URL}/latest?${params.toString()}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Frankfurter API Error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      throw new HttpException(
        error.message || 'Error fetching latest rates',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getHistoricalRates(date: string, base: string = 'EUR', symbols?: string) {
    try {
      const params = new URLSearchParams();
      if (base) params.append('base', base);
      if (symbols) params.append('symbols', symbols);

      const url = `${this.BASE_URL}/${date}?${params.toString()}`;
      const response = await fetch(url);

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Frankfurter API Error: ${errorBody || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      throw new HttpException(
        error.message || 'Error fetching historical rates',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async convertCurrency(from: string, to: string, amount: number) {
    try {
      // 1. Get rate
      const data = await this.getLatestRates(from, to);
      const rates = (data as any).rates;

      if (!rates || !rates[to]) {
        throw new Error(`Rate not found for ${to}`);
      }

      const rate = rates[to];
      const result = parseFloat((amount * rate).toFixed(2));

      return {
        from,
        to,
        amount,
        rate,
        result,
        date: (data as any).date,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Error converting currency',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
