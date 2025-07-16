export async function getProducts() {
    const mensResponse = await fetch('https://dummyjson.com/products/category/mens-shirts');
    const womensResponse = await fetch('https://dummyjson.com/products/category/womens-dresses');
    
    const mensData = await mensResponse.json();
    const womensData = await womensResponse.json();

    const combinedProducts = [...mensData.products, ...womensData.products];
  
    return combinedProducts;
  }
  