const { Users, Products } = require("../../db");

const getCarts = async (id) => {
  const carts = await Users.findAll({
    where: {
      id: id,
    },
    include: { model: Products },
  });

  let filtrado = carts[0]?.Products?.filter((cart) => {
    return cart.user_products?.isCart === true;
  });
  return filtrado;
};

const createCart = async ({ UserId, ProductId, ProductSize }) => {
  const cart = await Users.findOne({ where: { id: UserId } });

  const existingCart = await Users.findOne({
    where: {
      id: UserId,
    },
    include: { model: Products, where: { id: ProductId } },
  });

  if (existingCart) {
    await existingCart.Products[0]?.user_products?.update({ isCart: true });
    existingCart.Products.sizes = ProductSize;
    console.log(existingCart.Products.sizes);
    return existingCart;
  }

  await cart.addProduct(ProductId, {
    through: { isCart: true },
  });

  const cartSize = await Users.findOne({
    where: {
      id: UserId,
    },
    include: { model: Products, where: { id: ProductId } },
  });
  cartSize.Products.sizes = ProductSize;

  return cartSize;
};

const deleteFromCart = async ({ UserId, ProductId }) => {
  const cart = await Users.findOne({
    where: {
      id: UserId,
    },
    include: { model: Products, where: { id: ProductId } },
  });

  let deleted = await cart?.Products[0]?.user_products?.update({
    isCart: false,
  });
  return deleted;
};

module.exports = {
  getCarts,
  createCart,
  deleteFromCart,
};
