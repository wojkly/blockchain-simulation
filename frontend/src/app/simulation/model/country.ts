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
}
export function getPriceByEnumName(enumName: string): number {
  let result = COUNTRIES.find(value => value.enumName === enumName);
  if (!result) {
    return 1;
  }
  return result.electricityPrice;
}
export function getCountryNameByEnumName(enumName: string): any {
  let result = COUNTRIES.find(value => value.enumName === enumName);
  if (!result) {
    return 1;
  }
  return result.name;
}
export const COUNTRY_ENUM_NAMES = ['ROMANIA','POLAND','SPAIN','GERMANY','GREAT_BRITAIN'];

export const COUNTRIES = [
  new Country('Romania', 1, 'ROMANIA'),
  new Country('Poland', 2, 'POLAND'),
  new Country('Spain', 3, 'SPAIN'),
  new Country('Germany', 4, 'GERMANY'),
  new Country('Great Britain', 5, 'GREAT_BRITAIN'),
];
