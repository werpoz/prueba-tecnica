import { IsString, IsOptional, IsNumber, IsNotEmpty, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetLatestRatesDto {
    @IsOptional()
    @IsString()
    base?: string = 'EUR';

    @IsOptional()
    @IsString()
    symbols?: string;
}

export class GetHistoricalRatesDto extends GetLatestRatesDto {
    @IsNotEmpty()
    @IsString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'Date must be in YYYY-MM-DD format' })
    date: string;
}

export class ConvertCurrencyDto {
    @IsNotEmpty()
    @IsString()
    from: string;

    @IsNotEmpty()
    @IsString()
    to: string;

    @IsNotEmpty()
    @IsNumber()
    amount: number;
}
