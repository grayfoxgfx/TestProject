using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Models.Contexts;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Models.Repository
{
    public class ProductRepository : Repository<Product>, IProductRepository
    {
        public ProductRepository(ProductsContext context) : base(context)
        {
        }        
    }
}
