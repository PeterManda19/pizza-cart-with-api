// Test cartComponent functions
describe('cartComponent', () => {
  let cart;

  beforeEach(() => {
    cart = cartComponent();
    cart.loadCartFromLocalStorage(); // Load initial cart data
  });

  afterEach(() => {
    localStorage.clear(); // Clear local storage after each test
  });

  it('should add a pizza to the cart', () => {
    cart.addToCart('Small Pizza', 47.90);
    assert.strictEqual(cart.cart.length, 1);
    assert.strictEqual(cart.cart[0].name, 'Small Pizza');
    assert.strictEqual(cart.cart[0].price, 47.90);
    assert.strictEqual(cart.cart[0].quantity, 1);
  });

  it('should remove a pizza from the cart', () => {
    cart.addToCart('Small Pizza', 47.90);
    cart.addToCart('Medium Pizza', 79.90);
    cart.removeFromCart('Small Pizza', 47.90);
    assert.strictEqual(cart.cart.length, 1);
    assert.strictEqual(cart.cart[0].name, 'Medium Pizza');
    assert.strictEqual(cart.cart[0].price, 79.90);
    assert.strictEqual(cart.cart[0].quantity, 1);
  });

  it('should calculate the total cost of items in the cart', () => {
    cart.addToCart('Small Pizza', 47.90);
    cart.addToCart('Medium Pizza', 79.90);
    cart.addToCart('Large Pizza', 114.90);
    assert.strictEqual(cart.calculateTotal(), '242.70');
  });

  it('should display a success message and clear the cart on successful payment', () => {
    cart.addToCart('Small Pizza', 47.90);
    cart.paymentAmount = 100.00;
    cart.checkout();
    assert.strictEqual(cart.message, 'Payment successful! Enjoy your pizzas!');
    assert.strictEqual(cart.cart.length, 0);
    assert.strictEqual(cart.paymentAmount, 0.00);
  });

  it('should display an error message if the payment amount is insufficient', () => {
    cart.addToCart('Small Pizza', 47.90);
    cart.paymentAmount = 30.00;
    cart.checkout();
    assert.strictEqual(cart.message, 'Sorry, the payment amount is not sufficient.');
    assert.strictEqual(cart.cart.length, 1);
    assert.strictEqual(cart.paymentAmount, 30.00);
  });
});
