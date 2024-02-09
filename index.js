import { initBreakpointComputation } from "./screenBreakpoint.js";
import { isElementVisible } from "./utils/utils.js";

const CURRENT_PRODUCT_IMAGE_ID = "currentProductImage";
const THUMBNAILS_ID = "thumbnails";

document.addEventListener("DOMContentLoaded", onDomContentLoaded);

let clickHandlerAssignedToThumbnails = false;

function onDomContentLoaded() {
  initBreakpointComputation();
}

function assignClickHandlerToProductThumbnails() {
  if (clickHandlerAssignedToThumbnails) return;

  const thumbnails = document.getElementById(THUMBNAILS_ID);
  if (thumbnails && isElementVisible(thumbnails)) {
    for (let i = 0, len = thumbnails.childElementCount; i < len; i++) {
      const element = thumbnails.children.item(i);
      element.addEventListener("click", () => {
        const currentProductImage = document.getElementById(
          CURRENT_PRODUCT_IMAGE_ID
        );
        if (currentProductImage)
          currentProductImage.src = `./images/image-product-${i + 1}.jpg`;
      });
    }
    clickHandlerAssignedToThumbnails = true;
  }
}

function windowBreakpointChangeListener(breakpoint) {
  assignClickHandlerToProductThumbnails();
}

export { windowBreakpointChangeListener };
