import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
})
export class SearchPipe implements PipeTransform {
  transform(data: any[], searchValue: string, key: string): any[] {
    if (!data) return [];
    if (!searchValue) return data;
    searchValue = searchValue.toLowerCase();
    let arrayData = data.filter((data) => {
      return data[key].toLowerCase().includes(searchValue);
    });
    return arrayData;
  }
}
