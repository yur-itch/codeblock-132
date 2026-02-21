import { ASTNode, Interpreter } from "./index.mjs";
import { UINodeManager } from "./UINodeManager.mjs";
import { Console } from "./console.mjs";
const manager = new UINodeManager();

// clone.classList.add("code-block");
// clone.classList.remove("block");

const palette = document.querySelector(".workspace__block-palette");
const editor = document.querySelector(".workspace__code-editor");
const editorConsole = new Console();

editorConsole.print("HELLO,WORLD!")
let draggingBlock = null; // какой блок сейчас тащим
let currentBranch = null; // состояние текущей ветки; Это память о прошлой ветке, над которой был курсор.
let offsetX = 0;
let offsetY = 0;

const numberBlock = palette.querySelector(".workspace__numberLiteral-block")
const stringBlock = palette.querySelector(".workspace__stringLiteral-block")
const boolBlock = palette.querySelector(".workspace__boolLiteral-block")
const variableBlock = palette.querySelector(".workspace__variable-block")
const assignBlock = palette.querySelector(".workspace__assign-block")
const plusBlock = palette.querySelector(".workspace__plus-block")
const greaterBlock = palette.querySelector(".workspace__gt-block")
const andBlock = palette.querySelector(".workspace__and-block")

numberBlock.addEventListener('pointerdown', (e) => {
    const uiNode = manager.spawnNode("numberLiteral", "Число")
    startDragging(uiNode, e, e.target);
});
stringBlock.addEventListener('pointerdown', (e) => {
    const uiNode = manager.spawnNode("stringLiteral", "Строка")
    startDragging(uiNode, e, e.target);
});
boolBlock.addEventListener('pointerdown', (e) => {
    const uiNode = manager.spawnNode("boolLiteral", "Булево")
    startDragging(uiNode, e, e.target);
});
variableBlock.addEventListener('pointerdown', (e) => {
    const uiNode = manager.spawnNode("variable", "Переменная")
    startDragging(uiNode, e, e.target);
});
assignBlock.addEventListener('pointerdown', (e) => {
    const uiNode = manager.spawnNode("assign", "=")
    startDragging(uiNode, e, e.target);
});
plusBlock.addEventListener('pointerdown', (e) => {
    const uiNode = manager.spawnNode("call", "+").setOperation(new ASTNode("variable", "+"));
    startDragging(uiNode, e, e.target);
});
greaterBlock.addEventListener('pointerdown', (e) => {
    const uiNode = manager.spawnNode("call", ">").setOperation(new ASTNode("variable", ">"));
    startDragging(uiNode, e, e.target);
});
andBlock.addEventListener('pointerdown', (e) => {
    const uiNode = manager.spawnNode("call", "and").setOperation(new ASTNode("variable", "and"));
    startDragging(uiNode, e, e.target);
});

function startDragging(uiNode, e, blockElement) {
    console.log(uiNode);
    e.stopPropagation(); /* чтобы клик не дошёл до palette document иначе могут начаться глюки */
    draggingBlock = uiNode;
    const rect = blockElement.getBoundingClientRect();
    editor.parentElement.append(uiNode.element);
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    uiNode.element.style.position = "absolute";
    uiNode.element.style.top  = (e.clientY - offsetY) + 'px';
    uiNode.element.style.left = (e.clientX - offsetX) + 'px';
}

function dragging(uiNode, e) {
    uiNode.element.style.left = (e.clientX - offsetX) + 'px';
    uiNode.element.style.top  = (e.clientY - offsetY) + 'px';
    const branch = getBranchUnderCursor(e.clientX, e.clientY);
    if(branch !== currentBranch) {
        if(currentBranch) {
            currentBranch.classList.remove('highlight');
        }
        if(branch) {
            branch.classList.add('highlight');
        }
        currentBranch = branch;
    }
}

editor.addEventListener('pointerdown', (e) => {
    if (e.target.classList.contains("workspace__input-number")) return;
    const blockElement = e.target.closest(".block");
    if (!blockElement) return;
    const uiNode = manager.getNode(blockElement.id);
    manager.detach(uiNode);
    startDragging(uiNode, e, blockElement);
    console.log(manager);
});

document.addEventListener('pointermove', (e) => {
    if (!draggingBlock) return;

    dragging(draggingBlock, e);
});

document.addEventListener('pointerup', (e) => {
    if (!draggingBlock) return;

    const branchElement = getBranchUnderCursor(e.clientX, e.clientY);

    const editorRect = editor.getBoundingClientRect();
    const isInsideEditor =
        e.clientX >= editorRect.left &&
        e.clientX <= editorRect.right &&
        e.clientY >= editorRect.top &&
        e.clientY <= editorRect.bottom;
    
    if (!isInsideEditor) {
        manager.removeNode(draggingBlock)
    } else if (branchElement && branchElement.parentElement !== draggingBlock.element) {
        const nodeBranchParent = manager.getNode(branchElement.parentElement.id);
        manager.attach(draggingBlock, nodeBranchParent, branchElement)
    } else {
        // пересчитываем координаты под editor
        const x = e.clientX - editorRect.left - offsetX;
        const y = e.clientY - editorRect.top  - offsetY;

        editor.appendChild(draggingBlock.element);

        draggingBlock.element.style.left = x + 'px';
        draggingBlock.element.style.top  = y + 'px';
    }

    if (currentBranch) { 
        currentBranch.classList.remove('highlight'); 
    }

    currentBranch = null; 
    draggingBlock = null;
});

function getBranchUnderCursor(x,y) {
    const branches = document.querySelectorAll(".workspace__branch");
    
    const maxLayerBranch = [...branches].filter(b => {
        const rect = b.getBoundingClientRect();
        const inside = 
            x >= rect.left &&
            x <= rect.right && 
            y >= rect.top && 
            y <= rect.bottom;
        return inside;
    })
    return maxLayerBranch ? maxLayerBranch.at(-1) : null;
}

const playButton = document.querySelector(".workspace__run")
playButton.addEventListener("click", e => {
    const roots = [...manager.activeBlocks.values()]
        .filter(elem => !elem.element.parentElement.closest(".block"))
    for (const root of roots) {
        const interp = new Interpreter(root.node);
        const result = interp.run();
        console.log(result);
        editorConsole.print(`${result.type} ${result.value}`);
    }
})