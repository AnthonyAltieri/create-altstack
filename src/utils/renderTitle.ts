import gradient from "gradient-string";
import { TITLE_TEXT } from "~/consts.js";

const altStackGradient = gradient(["#7c3aed", "#3b82f6", "#06b6d4"]);

export function renderTitle() {
  console.log(altStackGradient.multiline(TITLE_TEXT));
}
