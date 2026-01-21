import { Controller, Get, Post, Body, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiService } from './api.service';
import { GetLatestRatesDto, GetHistoricalRatesDto, ConvertCurrencyDto } from './dto/api-operations.dto';

@Controller('forex')
export class ApiController {
  constructor(private readonly apiService: ApiService) { }

  @Get('latest')
  async findAll(@Query() query: GetLatestRatesDto) {
    return this.apiService.getLatestRates(query.base, query.symbols);
  }

  @Get('historical')
  async historical(@Query() query: GetHistoricalRatesDto) {
    return this.apiService.getHistoricalRates(query.date, query.base, query.symbols);
  }

  @Post('convert')
  async convert(@Body() body: ConvertCurrencyDto) {
    return this.apiService.convertCurrency(body.from, body.to, body.amount);
  }
}
