import { windowBreakpointChangeListener } from "./index.js";
import { tailwindBreakpoints } from "./tailwind.config.js";
import { extractNumericPartsFromString } from "./utils/utils.js";

const TABLET_XS = "tablet-xs";
const TABLET = "tablet";
const LAPTOP = "laptop";
const LAPTOP_XL = "laptop-xl";
const LAPTOP_2XL = "laptop-2xl";

let breakpoint;
const screens = [];

function initBreakpointComputation() {
  screens[0] = extractNumericPartsFromString(tailwindBreakpoints["tablet-xs"]);
  screens[1] = extractNumericPartsFromString(tailwindBreakpoints["tablet"]);
  screens[2] = extractNumericPartsFromString(tailwindBreakpoints["laptop"]);
  screens[3] = extractNumericPartsFromString(tailwindBreakpoints["laptop-xl"]);
  screens[4] = extractNumericPartsFromString(tailwindBreakpoints["laptop-2xl"]);
  computeWindowBreakpoint();
}

window.addEventListener("resize", computeWindowBreakpoint);

function computeWindowBreakpoint() {
  let currentBreakpoint = computeCurrentWindowBreakpoint();

  if (breakpoint != currentBreakpoint) {
    breakpoint = currentBreakpoint;
    windowBreakpointChangeListener(breakpoint);
  }
}

function computeCurrentWindowBreakpoint() {
  const w = window.innerWidth;
  if (w <= screens[0]) return TABLET_XS;
  if (w <= screens[1]) return TABLET;
  if (w < screens[2]) return LAPTOP;
  if (w < screens[3]) return LAPTOP_XL;
  else return LAPTOP_2XL;
}

export { initBreakpointComputation };
