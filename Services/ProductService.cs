using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Models;
using DataAccess.Models.Repository;
using Microsoft.EntityFrameworkCore;

namespace Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _productRepository;

        public ProductService(IProductRepository productRepository)
        {
            _productRepository = productRepository;
        }

        public async Task<Product> GetProductByIdAsync(int id)
        {
            return await _productRepository.GetProductByIdAsync(id);
        }

        public async Task<List<Product>> GetAllProductsAsync()
        {
            return await _productRepository.GetAll().ToListAsync();
        }

        public async Task<Product> AddProductAsync(Product product)
        {
            return await _productRepository.AddAsync(product);
        }

        public async Task<Product> EditProductAsync(Product product)
        {
            return await _productRepository.UpdateAsync(product);
        }

        public async Task<Product> DeleteProductAsync(Product product)
        {
            return await _productRepository.DeleteAsync(product);
        }
    }
}
