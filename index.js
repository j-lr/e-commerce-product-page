import { initBreakpointComputation } from "./screenBreakpoint.js";
import { isElementVisible } from "./utils/utils.js";

const CURRENT_PRODUCT_IMAGE_ID = "currentProductImage";
const THUMBNAILS_ID = "thumbnails";

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

function onDomContentLoaded() {
  initBreakpointComputation();
}

function assignClickHandlerToProductThumbnails() {
  if (clickHandlerAssignedToThumbnails) return;

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
        CURRENT_PRODUCT_IMAGE_ID
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
  const thumbnails = document.getElementById(THUMBNAILS_ID);
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
      "bg-transparent rounded-xl border-2 border-orange";
    document.body.appendChild(thumbnailBorderElement);
  }
  positionThumbnailBorder();
}

function positionThumbnailBorder() {
  if (!clickedThumbnail) return;
  const rect = clickedThumbnail.getBoundingClientRect();
  thumbnailBorderElement.style.left = `${rect.left}px`;
  thumbnailBorderElement.style.top = `${rect.top}px`;
}

function manageThumbnailBorderWithWindowSizeChange() {
  if (!thumbnailBorderElement) return;
  if (!clickedThumbnail) return;
  positionThumbnailBorder();
}

function windowBreakpointChangeListener(breakpoint) {
  assignClickHandlerToProductThumbnails();
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
