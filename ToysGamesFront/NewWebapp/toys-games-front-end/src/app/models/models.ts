
export class Product {
    apiUrl: string;
    id: number;
    name: string;
    description: string;
    ageRestriction: number;
    company: string;
    price: number;
    imageUrl: string;

    constructor()
    {
      this.apiUrl = '';
      this.id = 0;
      this.name = '';
      this.description = '';
      this.ageRestriction = 0;
      this.company = '';
      this.price = 0;
      this.imageUrl = '';
    }
}
