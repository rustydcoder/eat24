(function($) {
  "use strict";

  $(document).ready(() => {
    let $flag = 0;

    // NAVBAR
    $(".burgers").click(() => {
      if ($flag == 0) {
        $(".burgers").addClass("toggleNav");
        $(".topNav").css("top", "0%");
        $flag = 1;
      } else {
        $(".burgers").removeClass("toggleNav");
        $(".topNav").css("top", "-70%");
        $flag = 0;
      }
    });

    // OVERLAY
    $(".image-container-one").hover(
      () => {
        $(".overlay-one").addClass("active-overlay");
        $(".image-container-one img").css({ width: "120%", height: "120%" });
      },
      () => {
        $(".overlay-one").removeClass("active-overlay");
        $(".image-container-one img").css({ width: "100%", height: "100%" });
      }
    );
    $(".image-container-two").hover(
      () => {
        $(".overlay-two").addClass("active-overlay");
        $(".image-container-two img").css({ width: "120%", height: "120%" });
      },
      () => {
        $(".overlay-two").removeClass("active-overlay");
        $(".image-container-two img").css({ width: "100%", height: "100%" });
      }
    );
  });

  // SCROLL EFFECT
  $(window).scroll(() => {
    if ($(window).scrollTop()) {
      $(".topNav").addClass("topNav__dark-theme");
    } else {
      $(".topNav").removeClass("topNav__dark-theme");
    }
  });

  // SMOOTH SCROLL
  smartScroll.init(
    {
      speed: 700,
      addActive: true,
      activeClass: "active",
      offset: 150
    },
    () => console.log("callback")
  );

  // RUNNING TEXT
  $(".notice").SimpleMarquee();
})(jQuery);

// TEXT SLIDESHOW
(() => {
  function textSlider(slideId) {
    const slides = document.getElementById(slideId);
    const slidesInner = slides.querySelector(".slides-inner");
    const text = slidesInner.querySelectorAll(".slide");
    const dashIndicators = slides.querySelector(".dashIndicators");

    let index = 0;
    const slidesHeight = slides.clientHeight / 2;

    const indicators = [];
    if (dashIndicators !== null) {
      for (let i = 0; i < text.length; i += 1) {
        const dash = document.createElement("li");
        dashIndicators.appendChild(dash);
        indicators.push(dash);
      }
      indicators[0].classList.add("activeDash");
    }

    const textArray = [];
    if (text !== null) {
      for (let i = 0; i < text.length; i++) {
        let result = text[i];
        textArray.push(result);
      }
      textArray[0].style.opacity = 1;
    }

    function textSlides() {
      index += 1;
      if (index === text.length) {
        index = 0;
      }
      slidesInner.style.transform = `translate3d(0, ${index *
        -slidesHeight}px, 0)`;

      textArray.forEach((el, i) => {
        if (i === index) {
          el.style.opacity = 1;
        } else {
          el.style.opacity = 0;
        }
      });

      indicators.forEach((indicator, i) => {
        if (i === index) {
          indicator.classList.add("activeDash");
        } else {
          indicator.classList.remove("activeDash");
        }
      });
    }
    setInterval(textSlides, 4000);
  }
  textSlider("banner");
})();

// SHOPPING CART
const shoppingCart = (function() {
  // Array
  let cart = [];

  // Class
  let Item = function(image, name, price, count) {
    this.image = image;
    this.name = name;
    this.price = price;
    this.count = count;
  };

  let obj = {};

  // addItemToCart(name,price,count)
  obj.addItemToCartAll = function(image, name, price, count) {
    for (let i in cart) {
      if (cart[i].name === name) {
        cart[i].count++;
        return;
      }
    }
    let item = new Item(image, name, price, count);
    cart.push(item);
    saveCart();
  };

  //addItemToCart(name)
  obj.addItemToCart = function(name) {
    for (let i in cart) {
      if (cart[i].name === name) {
        cart[i].count++;
        return;
      }
    }
  };

  // removeItemFromCart(name)
  obj.removeItemFromCart = function(name) {
    for (let i in cart) {
      if (cart[i].name === name) {
        cart[i].count--;
        if (cart[i].count < 1) {
          cart.splice(i, 1);
        }
        return;
      }
    }
    saveCart();
  };

  // removeItemFromCartAll(name)
  obj.removeItemFromCartAll = function(name) {
    for (let i in cart) {
      if (cart[i].name === name) {
        cart.splice(i, 1);
        return;
      }
    }
    saveCart();
  };

  // clearCart()
  obj.clearCart = function() {
    cart = [];
    saveCart();
  };

  // totalCount()
  obj.totalCount = function() {
    let totalCount = 0;
    for (let i in cart) {
      totalCount += cart[i].count;
    }
    return totalCount;
  };

  // totalCost()
  obj.totalCost = function() {
    let totalCost = 0;
    for (let i in cart) {
      totalCost += cart[i].price * cart[i].count;
    }
    return totalCost.toFixed(2);
  };

  // listCart()
  obj.listCart = function() {
    let cartCopy = [];
    for (let i in cart) {
      let item = cart[i];
      let itemCopy = {};
      for (let p in item) {
        itemCopy[p] = item[p];
      }
      itemCopy.total = (item.price * item.count).toFixed(2);
      cartCopy.push(itemCopy);
    }
    return cartCopy;
  };

  // saveCart()
  function saveCart() {
    sessionStorage.setItem("shoppingCart", JSON.stringify(cart));
  }

  // loadCart()
  function loadCart() {
    cart = JSON.parse(sessionStorage.getItem("shoppingCart"));
  }
  if (sessionStorage.getItem("shoppingCart") != null) {
    loadCart();
  }
  return obj;
})();

$(".cart-add-on").click(function(event) {
  event.preventDefault();
  let image = $(this).attr("data-image");
  let name = $(this).attr("data-name");
  let price = $(this).attr("data-price");
  shoppingCart.addItemToCartAll(image, name, price, 1);
  displayCart();
});

$("#clear-cart").click(() => {
  shoppingCart.clearCart();
  displayCart();
});

function displayCart() {
  let cartArray = shoppingCart.listCart();
  let output = "";
  for (let i in cartArray) {
    output +=
      "<tr>" +
      "<td>" +
      "<image src='" +
      cartArray[i].image +
      "'>" +
      "</td>" +
      "<td>" +
      cartArray[i].name +
      "</td>" +
      "<td>" +
      "<span class='cart-quantity-price'>" +
      "N" +
      cartArray[i].price +
      "</span>" +
      "</td>" +
      "<td class='cart-quantity-count'>" +
      "<button class='minus-Btn' data-name='" +
      cartArray[i].name +
      "'>" +
      "-" +
      "</button>" +
      "<input type='number' class='cart-quantity' value='" +
      cartArray[i].count +
      "' disabled>" +
      "<button class='add-Btn' data-name='" +
      cartArray[i].name +
      "'>" +
      "+" +
      "</button>" +
      "<span class='cart-total'>" +
      "N" +
      cartArray[i].total +
      "</span>" +
      "</td>" +
      "<td>" +
      "<button class='removeItem' data-name='" +
      cartArray[i].name +
      "'>" +
      "X" +
      "</button>" +
      "</td>" +
      "</tr>";
  }
  $(".show-cart").html(output);
  $(".total-price").html(shoppingCart.totalCost());
}

$(".show-cart").on("click", ".removeItem", function(event) {
  let name = $(this).attr("data-name");
  shoppingCart.removeItemFromCartAll(name);
  displayCart();
});

$(".show-cart").on("click", ".add-Btn", function(event) {
  let name = $(this).attr("data-name");
  shoppingCart.addItemToCart(name);
  displayCart();
});

$(".show-cart").on("click", ".minus-Btn", function(event) {
  let name = $(this).attr("data-name");
  shoppingCart.removeItemFromCart(name);
  displayCart();
});
displayCart();

// MODAL
(() => {
  const openModalButtons = document.querySelectorAll("[data-modal-target]");
  const closeModalButtons = document.querySelectorAll("[data-close-button]");
  const overlayModal = document.getElementById("overlayModal");

  openModalButtons.forEach(button => {
    button.addEventListener("click", () => {
      const modal = document.querySelector(button.dataset.modalTarget);
      openModal(modal);
    });
  });

  overlayModal.addEventListener("click", () => {
    const modals = document.querySelectorAll(".modal.activeModal");
    modals.forEach(modal => {
      closeModal(modal);
    });
  });

  closeModalButtons.forEach(button => {
    button.addEventListener("click", event => {
      event.preventDefault();
      const modal = button.closest(".modal");
      closeModal(modal);
    });
  });

  function openModal(modal) {
    if (modal == null) return;
    modal.classList.add("activeModal");
    overlayModal.classList.add("activeOverlayModal");
  }

  function closeModal(modal) {
    if (modal == null) return;
    modal.classList.remove("activeModal");
    overlayModal.classList.remove("activeOverlayModal");
  }
})();

// OPEN CART AND CLOSE CART
(() => {
  const openCart = document.getElementsByClassName("cart-link")[0];
  const addToCartBtn = document.querySelectorAll(".cart-add-on");
  const shoppingCart = document.getElementById("shopping-cart");
  const closeBtn = document.getElementById("closeShoppingCart");
  let x = 0;

  function glowCartLink(event) {
    event.preventDefault();
    if (x === 0) {
      openCart.classList.remove("item-added");
      shoppingCart.classList.add("openedCart");
      x = 1;
    } else {
      shoppingCart.classList.remove("openedCart");
      x = 0;
    }
  }

  function openShoppingCart() {
    openCart.classList.add("item-added");
  }

  openCart.addEventListener("click", glowCartLink);

  addToCartBtn.forEach(btn => {
    btn.addEventListener("click", () => {
      if (x === 0) {
        openShoppingCart();
      }
    });
  });

  closeBtn.addEventListener("click", () => {
    if (x === 1) {
      glowCartLink(event);
    }
  });
})();

// BIG FONT INTERACTIONS
(() => {
  let navLinks = document.querySelectorAll(".navLinks li");
  let bigFont = document.querySelector(".bigFont h2");
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      bigFont.innerHTML = link.innerText;
    });
  });
})();
