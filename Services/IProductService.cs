using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Models;

namespace Services
{
    public interface IProductService
    {
        Task<Product> GetProductByIdAsync(Product product);
        Task<List<Product>> GetAllProductsAsync();
        Task<Product> AddProductAsync(Product product);
        Task<Product> EditProductAsync(Product product);
        Task<Product> DeleteProductAsync(Product product);
    }
}
