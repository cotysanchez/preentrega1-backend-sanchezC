
const {faker}= require("@faker-js/faker");

const generateProducts = ()=>{
    return {
      id: faker.database.mongodbObjectId(),
      title: faker.commerce.productName(),
      department: faker.commerce.department(),
      description: faker.commerce.productDescription(),
      price: faker.commerce.price(),
      image:faker.image.url(),
      stock: parseInt(faker.string.numeric()),
      //category: faker.commerce.category(),
    };

}
module.exports = generateProducts;
