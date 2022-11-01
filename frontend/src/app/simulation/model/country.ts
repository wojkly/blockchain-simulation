export class Country {
  constructor(
    public readonly name: string,
    public readonly electricityPrice: number,
    public readonly enumName: string,
  ) {
  }
}

export function getRandomCountryEnumName(): string {
  return COUNTRY_ENUM_NAMES[Math.floor(Math.random() * COUNTRY_ENUM_NAMES.length)];

}export function getPriceByEnumName(enumName: string): number {
  let result = COUNTRIES.find(value => value.enumName === enumName);
  if (!result) {
    return 1;
  }
  return result.electricityPrice;
}
export const COUNTRY_ENUM_NAMES = ['ROMANIA','POLAND','SPAIN','GERMANY','GREAT_BRITAIN'];

export const COUNTRIES = [
  new Country('Rumunia', 1, 'ROMANIA'),
  new Country('Polska', 2, 'POLAND'),
  new Country('Hiszpania', 3, 'SPAIN'),
  new Country('Niemcy', 4, 'GERMANY'),
  new Country('Wielka Brytania', 5, 'GREAT_BRITAIN'),
];
