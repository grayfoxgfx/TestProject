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

namespace TestProjectAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ApiContext _context;
        private readonly ILogger _logger;
        private readonly IWebHostEnvironment _host;

        public ProductsController(ApiContext context, ILogger<ProductsController> logger, IWebHostEnvironment host)
        {
            _context = context;
            _logger = logger;
            _host = host;
        }

        // GET: api/Products
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            _logger.LogInformation("Getting all products");
            return await _context.Products.ToListAsync();
        }

        // GET: api/Products/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            _logger.LogInformation("Getting product id: {0}", id);
            var product = await _context.Products.FindAsync(id);

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

            _context.Entry(product).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                _logger.LogInformation("Product id: {0} updated", id);
            }
            catch (DbUpdateConcurrencyException ex)
            {
                if (!ProductExists(id))
                {
                    _logger.LogInformation("Product id: {0} not found", id);
                    return NotFound();
                }
                else
                {
                    _logger.LogCritical(ex,"Update product failed",id,product);
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
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Product id: {0} created", product.Id);
            return CreatedAtAction("GetProduct", new { id = product.Id }, product);
        }

        // DELETE: api/Products/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Product>> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                _logger.LogInformation("Product id: {0} not found", id);
                return NotFound();
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Product id: {0} deleted", product.Id);

            return product;
        }

        // POST: api/Products/Image
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost("image")]
        [DisableRequestSizeLimit]
        public async Task<IActionResult> SubirArchivo()
        {
            var file = Request.Form.Files[0];
            var filename = Guid.NewGuid() + ".jpg";

            List<IFormFile> files = new List<IFormFile> { file };
            long size = files.Sum(f => f.Length);

            // full path to file in temp location
            try
            {
                foreach (var formFile in files)
                {
                    var filePath = Path.Combine(_host.WebRootPath, "Images", filename);
                    if (formFile.Length > 0)
                    {
                        await using var stream = new FileStream(filePath, FileMode.Create);
                        await formFile.CopyToAsync(stream);
                    }
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new { ex.Message, ex.StackTrace });
            }

            return Ok(new Product(){ ImageUrl = filename});
        }

        private bool ProductExists(int id)
        {
            return _context.Products.Any(e => e.Id == id);
        }
    }
}
