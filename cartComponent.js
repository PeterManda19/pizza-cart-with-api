const cartComponent = () => {
  const apiUrl = "https://pizza-api.projectcodex.net/api/pizzas";
  const localStorageKey = "perfectPizzaCart";

  return {
    cart: [],
    showPayButton: false,
    paymentAmount: 0.00,
    isPaymentValid: true,
    pizzas: [],
    message: '',

    init() {
      axios.get(apiUrl).then((result) => {
        const allPizzas = result.data.pizzas;
        this.pizzas = allPizzas.filter(pizza =>
          pizza.size === 'small' || pizza.size === 'medium' || pizza.size === 'large'
        );
      });

      this.loadCartFromLocalStorage();
    },

    addToCart(pizzaName, pizzaPrice) {
      if (!this.showPayButton) {
        const existingPizza = this.cart.find(
          (item) => item.name === pizzaName && item.price === pizzaPrice
        );

        if (existingPizza) {
          existingPizza.quantity++;
          existingPizza.amount = existingPizza.price * existingPizza.quantity;
        } else {
          this.cart.push({
            name: pizzaName,
            price: pizzaPrice,
            quantity: 1,
            amount: pizzaPrice,
          });
        }

        this.saveCartToLocalStorage();
      }
    },

    removeFromCart(pizzaName, pizzaPrice) {
      if (!this.showPayButton) {
        const index = this.cart.findIndex(
          (item) => item.name === pizzaName && item.price === pizzaPrice
        );
        if (index !== -1) {
          const pizza = this.cart[index];
          if (pizza.quantity > 1) {
            pizza.quantity--;
            pizza.amount = pizza.price * pizza.quantity;
          } else {
            this.cart.splice(index, 1);
          }
        }

        this.saveCartToLocalStorage();
      }
    },

    calculateTotal() {
      if (this.cart.length === 0) {
        return "0.00";
      }

      let total = 0;
      for (const pizza of this.cart) {
        total += pizza.price * pizza.quantity;
      }
      return total.toFixed(2);
    },

    checkout() {
      if (this.cart.length === 0 || !this.isPaymentValid) return;

      const paymentAmount = parseFloat(this.paymentAmount);
      const totalCost = parseFloat(this.calculateTotal());

      if (!isNaN(paymentAmount) && paymentAmount >= totalCost) {
        this.message = "Payment successful! Enjoy your pizzas!";
        this.cart = [];
        this.showPayButton = false;
        this.paymentAmount = 0.00;
        this.saveCartToLocalStorage();
      } else {
        this.message = "Sorry, the payment amount is not sufficient.";
      }
    },

    getCartItemCost(pizzaName, pizzaPrice) {
      const pizza = this.cart.find(
        (item) => item.name === pizzaName && item.price === pizzaPrice
      );
      if (pizza) {
        return (pizza.price * pizza.quantity).toFixed(2);
      }
      return "0.00";
    },

    saveCartToLocalStorage() {
      localStorage.setItem(localStorageKey, JSON.stringify(this.cart));
    },

    loadCartFromLocalStorage() {
      const cartData = localStorage.getItem(localStorageKey);
      if (cartData) {
        this.cart = JSON.parse(cartData);
      }
    },
    
    pizzas: [
      {
        id: 1,
        name: "Small Pizza",
        price: 47.90,
        size: "small",
        description: "Delicious small pizza for one person.",
      },
      {
        id: 2,
        name: "Medium Pizza",
        price: 79.90,
        size: "medium",
        description: "Perfect medium pizza for a group.",
      },
      {
        id: 3,
        name: "Large Pizza",
        price: 114.90,
        size: "large",
        description: "Extra-large pizza for a big party.",
      },
    ],

    validatePayment() {
      const paymentAmount = parseFloat(this.paymentAmount);
      const totalCost = parseFloat(this.calculateTotal());
      this.isPaymentValid = !isNaN(paymentAmount) && paymentAmount >= totalCost;
    },

    pay() {
      if (this.paymentAmount >= this.calculateTotal()) {
        this.message = "Enjoy your pizzas!";
        this.cart = [];
        this.showPayButton = false;
        this.paymentAmount = 0.00;
        this.saveCartToLocalStorage();
      } else {
        this.message = "Sorry, the payment amount is not sufficient.";
      }
    },
  };
};

const cart = cartComponent();
cart.init();

// Function to get pizza image URL based on size
function getPizzaImage(size) {
  const imageUrls = {
    small: "asserts/small.png",
    medium: "asserts/medium.png",
    large: "asserts/large.png",
  };

  return imageUrls[size] || "pizza4.png";
}

// Example usage:
//cart.addToCart("Pepperoni Pizza", 0.00);
console.log(cart.calculateTotal());
