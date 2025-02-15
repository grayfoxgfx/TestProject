using DataAccess.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Services;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace TestProjectAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController(IProductService _productService, ILogger<ProductsController> _logger) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            _logger.LogInformation("Getting all products");
            return await _productService.GetAllProductsAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            _logger.LogInformation("Getting product id: {id}", id);
            var product = await _productService.GetProductByIdAsync(new Product { Id = id });

            if (product == null)
            {
                _logger.LogInformation("Product id: {id} not found", id);
                return NotFound();
            }

            return product;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutProduct(int id, Product product)
        {
            if (id != product.Id)
            {
                _logger.LogInformation("Bad request for product id:{id}", id);
                return BadRequest();
            }

            try
            {
                product = await _productService.EditProductAsync(product);
                _logger.LogInformation("Product id: {product.Id} updated", product.Id);
            }
            catch (DbUpdateConcurrencyException ex)
            {
                if (!await ProductExists(id))
                {
                    _logger.LogInformation("Product id: {id} not found", id);
                    return NotFound();
                }
                else
                {
                    _logger.LogCritical(ex, "Update product failed {id}, {product}", id, product);
                    throw;
                }
            }

            return NoContent();
        }

        [HttpPost]
        public async Task<ActionResult<Product>> PostProduct(Product product)
        {
            await _productService.AddProductAsync(product);
            _logger.LogInformation("Product id: {product.Id} created", product.Id);
            return CreatedAtAction("GetProduct", new { id = product.Id }, product);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Product>> DeleteProduct(int id)
        {
            var product = await _productService.GetProductByIdAsync(new Product { Id = id });
            if (product == null)
            {
                _logger.LogInformation("Product id: {id} not found", id);
                return NotFound();
            }

            await _productService.DeleteProductAsync(product);
            _logger.LogInformation("Product id: {id} deleted", id);
            return product;
        }

        private async Task<bool> ProductExists(int id) =>
            (await _productService.GetProductByIdAsync(new Product { Id = id })).Id > 0;
    }
}