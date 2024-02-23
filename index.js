import { initBreakpointComputation } from "./screenBreakpoint.js";
import { isElementVisible } from "./utils/utils.js";

const thumbnailsCount = 4;
const CURRENT_PRODUCT_IMAGE_ELEM_ID = "currentProductImage";
const THUMBNAILS_ELEM_ID = "thumbnails";

document.addEventListener("DOMContentLoaded", onDomContentLoaded);
window.addEventListener("resize", manageThumbnailBorderWithWindowSizeChange);

let clickHandlerAssignedToThumbnails = false;
/**
 * HTMLElement used as border for thumbnail, seperate element used as element's border opacity is tied to element's opacity
 */
let thumbnailBorderElement;
/**
 * current clicked thumbnail element
 */
let clickedThumbnail;

let basketItemQuantity = 0;

let currentProductImageID = 0;
let addToCartClicked = false;

const ITEM_QUANTITY_KEY = "itemQuantity";

function onDomContentLoaded() {
  initBreakpointComputation();
  basketItemQuantity = localStorage.getItem(ITEM_QUANTITY_KEY);

  if (null === basketItemQuantity) basketItemQuantity = 0;
  onItemQuantityUpdate();
  if (basketItemQuantity > 0) {
    addToCartClicked = true;
    document.getElementById("addToCart")?.classList.add("opacity-50");
    document.getElementById("cartQuantity")?.classList.remove("hidden");
  }
  manageCart();
}

function onItemQuantityUpdate() {
  const itemCountElem = document.getElementById("itemCount");
  if (itemCountElem) itemCountElem.innerHTML = basketItemQuantity;
  if (addToCartClicked)
    localStorage.setItem(ITEM_QUANTITY_KEY, basketItemQuantity);
  const cartQuantity = document.getElementById("cartQuantity");
  if (cartQuantity) {
    if (basketItemQuantity > 0) manageBasketItemQuantityUI();
    else if (basketItemQuantity == 0) {
      cartQuantity.classList.add("hidden");
      const leadingDigitElem = document.getElementById("quantityLeadingDigit");
      leadingDigitElem.textContent = basketItemQuantity;

      document.getElementById("addToCart")?.classList.remove("opacity-50");
    }
  }
}

function manageBasketItemQuantityUI() {
  const leadingDigitElem = document.getElementById("quantityLeadingDigit");

  if (basketItemQuantity >= 1000000000) {
    leadingDigitElem.textContent = basketItemQuantity.toString()[0];
    const quantityShortScale = document.getElementById("quantityShortScale");
    const quantityPlus = document.getElementById("quantityPlus");
    quantityShortScale.innerText = "B";
    quantityPlus.textContent = basketItemQuantity % 1000000000 === 0 ? "" : "+";
  } else if (basketItemQuantity >= 1000000) {
    leadingDigitElem.textContent = basketItemQuantity.toString()[0];
    const quantityShortScale = document.getElementById("quantityShortScale");
    const quantityPlus = document.getElementById("quantityPlus");
    quantityShortScale.innerText = "M";
    quantityPlus.textContent = basketItemQuantity % 1000000 === 0 ? "" : "+";
  } else if (basketItemQuantity >= 1000) {
    leadingDigitElem.textContent = Math.floor(basketItemQuantity / 1000);
    const quantityShortScale = document.getElementById("quantityShortScale");
    const quantityPlus = document.getElementById("quantityPlus");
    quantityShortScale.innerText = "k";
    quantityPlus.textContent = basketItemQuantity % 1000 === 0 ? "" : "+";
  } else {
    leadingDigitElem.textContent = basketItemQuantity;
    const quantityShortScale = document.getElementById("quantityShortScale");
    const quantityPlus = document.getElementById("quantityPlus");
    quantityShortScale.innerText = "";
    quantityPlus.textContent = "";
  }
}

function manageCart() {
  const addToCart = document.getElementById("addToCart");

  if (addToCart) {
    addToCart.addEventListener("click", () => {
      addToCartClicked = true;
      if (basketItemQuantity == 0) {
        ++basketItemQuantity;
      }
      onItemQuantityUpdate();
      document.getElementById("cartQuantity")?.classList.remove("hidden");

      addToCart.classList.add("opacity-50");
    });
  }

  const decrease = document.getElementById("decrease");
  if (decrease) {
    decrease.addEventListener("click", () => {
      basketItemQuantity = Math.max(0, --basketItemQuantity);
      onItemQuantityUpdate();
    });
  }
  const increase = document.getElementById("increase");
  if (increase) {
    increase.addEventListener("click", () => {
      ++basketItemQuantity;
      onItemQuantityUpdate();
    });
  }
}

function assignClickHandlersForProductThumbnails() {
  if (clickHandlerAssignedToThumbnails) return;
  assignClickHandlerToImageCarouselButtons();
  assignClickHandlerToProductThumbnails();
}
function assignClickHandlerToImageCarouselButtons() {
  const prev = document.getElementById("previousThumbail");
  const next = document.getElementById("nextThumbnail");
  if (!prev || !next) return;

  prev.addEventListener("click", () => {
    const currentProductImage = document.getElementById(
      CURRENT_PRODUCT_IMAGE_ELEM_ID
    );

    if (currentProductImage) {
      if (currentProductImageID > 0) {
        --currentProductImageID;
        currentProductImage.src = `./images/image-product-${
          currentProductImageID + 1
        }.jpg`;
      }
    }
    managePrevAndNextButtonsOpacity(prev, next);
  });

  next.addEventListener("click", () => {
    const currentProductImage = document.getElementById(
      CURRENT_PRODUCT_IMAGE_ELEM_ID
    );

    if (currentProductImage) {
      if (currentProductImageID < thumbnailsCount - 1) {
        ++currentProductImageID;
        currentProductImage.src = `./images/image-product-${
          currentProductImageID + 1
        }.jpg`;
      }
    }
    managePrevAndNextButtonsOpacity(prev, next);
  });
}

function managePrevAndNextButtonsOpacity(prev, next) {
  console.log(currentProductImageID);

  if (currentProductImageID === 0) {
    prev.classList.remove("opacity-100");
    prev.classList.add("opacity-50");
  } else if (currentProductImageID === thumbnailsCount - 1) {
    next.classList.remove("opacity-100");
    next.classList.add("opacity-50");
  } else {
    prev.classList.add("opacity-100");
    prev.classList.remove("opacity-50");
    next.classList.add("opacity-100");
    next.classList.remove("opacity-50");
  }
}

function assignClickHandlerToProductThumbnails() {
  const thumbnails = queryThumbnails();
  if (!thumbnails) return;

  for (let i = 0, len = thumbnails.length; i < len; i++) {
    const element = thumbnails.item(i);
    if (i === 0) {
      clickedThumbnail = element;
      manageThumbnailBorderAtClick(element);
    }
    element.addEventListener("click", () => {
      const currentProductImage = document.getElementById(
        CURRENT_PRODUCT_IMAGE_ELEM_ID
      );
      if (currentProductImage)
        currentProductImage.src = `./images/image-product-${i + 1}.jpg`;
      clickedThumbnail = element;
      manageThumbnailBorderAtClick(element);
    });
  }

  clickHandlerAssignedToThumbnails = true;
}

/**
 * queries and returns thumbnails if available else returns null
 */
function queryThumbnails() {
  const thumbnails = document.getElementById(THUMBNAILS_ELEM_ID);
  return thumbnails && isElementVisible(thumbnails)
    ? thumbnails.children
    : null;
}

function manageThumbnailBorderAtClick(clickedThumbnail) {
  const thumbnails = queryThumbnails();
  if (!thumbnails) return;
  for (let i = 0, len = thumbnails.length; i < len; i++) {
    const element = thumbnails.item(i);

    element.classList.add("opacity-100");
    element.classList.remove("opacity-50");
  }

  clickedThumbnail.classList.add("opacity-50");

  if (!thumbnailBorderElement) {
    thumbnailBorderElement = document.createElement("div");
    thumbnailBorderElement.style.width = `${clickedThumbnail.offsetWidth}px`;
    thumbnailBorderElement.style.height = `${clickedThumbnail.offsetHeight}px`;
    thumbnailBorderElement.style.position = "absolute";
    thumbnailBorderElement.className =
      "bg-transparent border-2 border-orange rounded-lg laptop:rounded-2xl";

    document.body.appendChild(thumbnailBorderElement);
  }
  positionThumbnailBorder();
}

function positionThumbnailBorder() {
  if (!clickedThumbnail) return;
  const rect = clickedThumbnail.getBoundingClientRect();
  thumbnailBorderElement.style.width = `${clickedThumbnail.offsetWidth}px`;
  thumbnailBorderElement.style.height = `${clickedThumbnail.offsetHeight}px`;
  thumbnailBorderElement.style.left = `${rect.left + window.scrollX}px`;
  thumbnailBorderElement.style.top = `${rect.top + window.scrollY}px`;
}

function manageThumbnailBorderWithWindowSizeChange() {
  if (!thumbnailBorderElement) return;
  if (!clickedThumbnail) return;
  positionThumbnailBorder();
}

function windowBreakpointChangeListener(breakpoint) {
  assignClickHandlersForProductThumbnails();
  manageThumbnailBorderVisibilityOnBreakpointchange(breakpoint);
}

function manageThumbnailBorderVisibilityOnBreakpointchange(breakpoint) {
  if (breakpoint === "tablet" || breakpoint === "tablet-xs") {
    if (thumbnailBorderElement) {
      thumbnailBorderElement.classList.add("hidden");
      thumbnailBorderElement.classList.remove("block");
    }
  }
  if (
    breakpoint === "laptop" ||
    breakpoint === "laptop-xl" ||
    breakpoint === "laptop-2xl"
  ) {
    if (thumbnailBorderElement) {
      thumbnailBorderElement.classList.add("block");
      thumbnailBorderElement.classList.remove("hidden");
    }
  }
}

export { windowBreakpointChangeListener };
