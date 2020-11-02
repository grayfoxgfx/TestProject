using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DataAccess.Models;
using DataAccess.Models.Contexts;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Logging;
using Services;

namespace TestProjectAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _productService;
        private readonly ILogger _logger;
        private readonly IWebHostEnvironment _host;

        public ProductsController(IProductService productService, ILogger<ProductsController> logger, IWebHostEnvironment host)
        {
            _productService = productService;
            _logger = logger;
            _host = host;
        }

        // GET: api/Products
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            _logger.LogInformation("Getting all products");
            return await _productService.GetAllProductsAsync();
        }

        // GET: api/Products/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            _logger.LogInformation("Getting product id: {0}", id);
            var product = await _productService.GetProductByIdAsync(id);

            if (product == null)
            {
                _logger.LogInformation("product id: {0} not found", id);
                return NotFound();
            }

            return product;
        }

        // PUT: api/Products/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProduct(int id, Product product)
        {
            if (id != product.Id)
            {
                _logger.LogInformation("BAd request for product id:{0}", id);
                return BadRequest();
            }

            try
            {
                product = await _productService.EditProductAsync(product);
                _logger.LogInformation("Product id: {0} updated", product.Id);
            }
            catch (DbUpdateConcurrencyException ex)
            {
                if (!ProductExists(id).Result)
                {
                    _logger.LogInformation("Product id: {0} not found", id);
                    return NotFound();
                }
                else
                {
                    _logger.LogCritical(ex, "Update product failed", id, product);
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Products
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<Product>> PostProduct(Product product)
        {
            await _productService.AddProductAsync(product);
            _logger.LogInformation("Product id: {0} created", product.Id);
            return CreatedAtAction("GetProduct", new { id = product.Id }, product);
        }

        // DELETE: api/Products/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Product>> DeleteProduct(int id)
        {
            var product = await _productService.GetProductByIdAsync(id);
            if (product == null)
            {
                _logger.LogInformation("Product id: {0} not found", id);
                return NotFound();
            }

            await _productService.DeleteProductAsync(product);

            _logger.LogInformation("Product id: {0} deleted", id);

            return product;
        }

        // POST: api/Products/Image
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost("image")]
        [DisableRequestSizeLimit]
        public async Task<IActionResult> SubirArchivo()
        {
            if (Request.Form.Files.Any())
            {
                var file = Request.Form.Files[0];
                if (file == null)
                    return BadRequest("No file found");
                var filename = Guid.NewGuid() + ".jpg";

                // full path to file in temp location
                try
                {
                    _logger.LogInformation("Uploading product image");
                    var filePath = Path.Combine(_host.WebRootPath, "Images", filename);
                    Console.WriteLine(Directory.CreateDirectory(Path.GetDirectoryName(filePath)));
                    Directory.CreateDirectory(Path.GetDirectoryName(filePath));
                    if (file.Length > 0)
                    {
                        await using var stream = new FileStream(filePath, FileMode.Create);
                        await file.CopyToAsync(stream);
                    }
                }
                catch (Exception ex)
                {
                    return BadRequest(new { ex.Message, ex.StackTrace });
                }

                return Ok(new Product() { ImageUrl = filename });
            }
            else
            {
                return BadRequest("No file found, Request doesn't contain a file");
            }
        }

        private async Task<bool> ProductExists(int id)
        {
            var product = await _productService.GetProductByIdAsync(id);
            return product.Id > 0;
        }
    }
}
