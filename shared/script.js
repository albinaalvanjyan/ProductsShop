export async function getProducts() {
  const combinedProducts=fetch("https://dummyjson.com/products?limit=194").then(res => res.json()).then(({products}) => products.filter(prod => ["mens-shirts", "womens-dresses","womens-shoes","mens-shoes","womens-bags"].includes(prod.category)))

  return combinedProducts;
}

