import { UINode } from "./UINode.mjs";

class UINodeManager {
    constructor() {
        this.activeBlocks = new Map(); 
        
    }

    spawnNode(type, label) {
        const element = this.createElement(type, label)
        const uiNode = new UINode(type, element);
        return uiNode;
    }

    attach(parent, current) {
        parent.appendChild(current)
    }

    createElement(type, label, value = null)
    {
        const element = document.createElement("div");
        // TYPE
        element.classList.add(`workspace__${type}-block`);
        element.classList.add('block');
        element.classList.add('with-branch');
        element.style.position = 'absolute';
        const text = document.createElement("div");
        element.appendChild(text);
        text.innerHTML = label;
        text.classList.add('workspace__operation');
        const input = document.createElement("input");
        input.type = "number";
        input.className = "workspace__input-number"
        element.appendChild(input);
        input.value = value;
        return element
    }
}


// document.getElementById('palette-set').addEventListener('mousedown', (e) => {
//     const newBlock = manager.spawnBlock('set', e.clientX, e.clientY);
    
//     startDragging(newBlock, e);
// });

export {UINodeManager}