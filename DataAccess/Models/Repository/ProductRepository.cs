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
        public ProductRepository(ApiContext context) : base(context)
        {
        }

        public Task<Product> GetProductByIdAsync(int id)
        {
            return GetAll().FirstOrDefaultAsync(x => x.Id == id);
        }
    }
}
