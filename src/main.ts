import { parse } from "./parser-parens.ts";
import "./style.css";
import { VirtuRobDomNode, diffDom } from "./virtu-rob-dom.ts";

const openViewGrammarButton = document.querySelector<HTMLButtonElement>(
  "#open-view-grammar-button"
)!!!;
const nextInDomTextArea = document.querySelector<HTMLTextAreaElement>(
  "#next-in-dom-text-area"
)!!!;
const currentInDomTextArea = document.querySelector<HTMLTextAreaElement>(
  "#current-in-dom-text-area"
)!!!;
const instructionsHeader = document.querySelector<HTMLHeadingElement>(
  "#instructions-header"
)!!!;
const instructionsButton = document.querySelector<HTMLButtonElement>(
  "#instructions-button"
)!!!;
const instructionsJS = document.querySelector<HTMLPreElement>(
  "#instructions-javascript"
)!!!;
const parseErrorMessage = document.querySelector<HTMLDivElement>(
  "#parse-error-message"
)!!!;
const modalCloseButton = document.querySelector<HTMLDivElement>(
  "#modal-close-button"
)!!!;
const modal = document.querySelector<HTMLDivElement>("#modal")!!!;

nextInDomTextArea.oninput = updateAppState;
instructionsButton.onclick = updateDom;
openViewGrammarButton.onclick = () => viewModal(true);
modalCloseButton.onclick = () => viewModal(false);
modal.onclick = () => viewModal(false);

let parseResult: {
  text: string;
  vDom: VirtuRobDomNode[];
  diffInstructions: string;
} | null = null;
let currentVirtualDOMContents: VirtuRobDomNode[] = [];

function viewModal(visible: boolean) {
  modal.hidden = !visible;
}

function updateDom() {
  if (parseResult === null) return;

  currentInDomTextArea.value = parseResult.text;
  currentVirtualDOMContents = parseResult.vDom;
  eval(parseResult.diffInstructions);
  instructionsJS.innerHTML = "";
  parseResult = null;
}

function updateAppState() {
  try {
    const text = nextInDomTextArea.value;
    const vDom = parse(text);
    const diffInstructions = [
      'const root = document.getElementById("dom-zone-root");',
    ]
      .concat(diffDom([], currentVirtualDOMContents, vDom))
      .join("\n");

    // Update app state
    parseResult = { diffInstructions, vDom, text };

    // Update visual state
    instructionsJS.innerText = diffInstructions;

    instructionsHeader.hidden = false;
    instructionsButton.hidden = false;
    instructionsJS.hidden = false;
    parseErrorMessage.hidden = true;
  } catch (e) {
    // Update app state
    parseResult = null;

    // Update visual state
    parseErrorMessage.innerText = `${e}`;

    instructionsHeader.hidden = true;
    instructionsButton.hidden = true;
    instructionsJS.hidden = true;
    parseErrorMessage.hidden = false;
  }
}

updateAppState();
