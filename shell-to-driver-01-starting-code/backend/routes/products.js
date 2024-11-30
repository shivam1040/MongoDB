const Router = require('express').Router;
const mongo = require("mongodb")

const router = Router();
const db = require("../db");
const { query } = require('express');
const dec128 = mongo.Decimal128
const oId = mongo.ObjectId

const products = [
  {
    _id: 'fasdlk1j',
    name: 'Stylish Backpack',
    description:
      'A stylish backpack for the modern women or men. It easily fits all your stuff.',
    price: 79.99,
    image: 'http://localhost:3100/images/product-backpack.jpg'
  },
  {
    _id: 'asdgfs1',
    name: 'Lovely Earrings',
    description:
      "How could a man resist these lovely earrings? Right - he couldn't.",
    price: 129.59,
    image: 'http://localhost:3100/images/product-earrings.jpg'
  },
  {
    _id: 'askjll13',
    name: 'Working MacBook',
    description:
      'Yes, you got that right - this MacBook has the old, working keyboard. Time to get it!',
    price: 1799,
    image: 'http://localhost:3100/images/product-macbook.jpg'
  },
  {
    _id: 'sfhjk1lj21',
    name: 'Red Purse',
    description: 'A red purse. What is special about? It is red!',
    price: 159.89,
    image: 'http://localhost:3100/images/product-purse.jpg'
  },
  {
    _id: 'lkljlkk11',
    name: 'A T-Shirt',
    description:
      'Never be naked again! This T-Shirt can soon be yours. If you find that buy button.',
    price: 39.99,
    image: 'http://localhost:3100/images/product-shirt.jpg'
  },
  {
    _id: 'sajlfjal11',
    name: 'Cheap Watch',
    description: 'It actually is not cheap. But a watch!',
    price: 299.99,
    image: 'http://localhost:3100/images/product-watch.jpg'
  }
];

// Get list of products products
router.get('/', (req, res, next) => {
  // Return a list of dummy products
  // Later, this data will be fetched from MongoDB
  // const queryPage = req.query.page;
  // const pageSize = 5;
  // let resultProducts = [...products];
  // if (queryPage) {
  //   resultProducts = products.slice(
  //     (queryPage - 1) * pageSize,
  //     queryPage * pageSize
  //   );
  // }
  const page = req.query.page
const productsx = []
  db.getDb().db().collection("products").find().skip((page-1)*1).limit(1).forEach(p => {
      p.price = p.price.toString()
      productsx.push(p)
      return p
    }).then(r=>{
      console.log(r)
      res.json(productsx);
    }).catch(e=>{
      console.log(e)
    })
  })

// Get single product
router.get('/:id', (req, res, next) => {
  const product = products.find(p => p._id === req.params.id);
  db.getDb().db().collection("products").findOne({_id:new oId(req.params.id)}).then(p => {
    p.price = p.price.toString()
    res.json(p);
  }).catch(e=>{
    console.log(e)
  })
});

// Add new product
// Requires logged in user
router.post('', (req, res, next) => {
  const newProduct = {
    name: req.body.name,
    description: req.body.description,
    price: dec128.fromString(req.body.price.toString()), // store this as 128bit decimal in MongoDB
    image: req.body.image
  };
  db.getDb().db().collection("products").insertOne(newProduct).then(r=>{
    console.log(r)
  }).catch(e=>{
    console.log(e)
  })
})

// Edit existing product
// Requires logged in user
router.patch('/:id', (req, res, next) => {
  const updatedProduct = {
    name: req.body.name,
    description: req.body.description,
    price: dec128.fromString(req.body.price), // store this as 128bit decimal in MongoDB
    image: req.body.image
  };
  db.getDb().db().collection("products").updatedOne({_id:new oId(req.params.id)},{$set:updatedProduct}).then().catch()
  res.status(200).json({ message: 'Product updated', productId: 'DUMMY' });
});

// Delete a product
// Requires logged in user
router.delete('/:id', (req, res, next) => {
  db.getDb().db().collection("products").deleteOne(_id:new oId(req.params.id))
  res.status(200).json({ message: 'Product deleted' });
});

module.exports = router;
