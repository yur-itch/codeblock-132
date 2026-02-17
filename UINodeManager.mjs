import { UINode } from "./UINode.mjs";

class UINodeManager {
    constructor() {
        this.activeBlocks = new Map(); 
    }
    
    spawnNode(type, label) {
        const value = null;
        const element = document.createElement("div");
        const uiNode = new UINode(type, element);
        
        element.classList.add(`workspace__${type}-block`);
        element.classList.add('block');
        element.classList.add('with-branch');
        element.id = uiNode.node.id;
        element.style.position = 'absolute';
        const text = document.createElement("div");
        text.innerHTML = label;
        text.classList.add('workspace__operation');
        switch (type) {
            case "numberLiteral": {
                element.appendChild(text);
                const input = document.createElement("input");
                input.type = "number";
                input.className = "workspace__input-number"
                element.appendChild(input);
                input.addEventListener("change", (e) => {
                    uiNode.node.value = Number.parseFloat(e.target.value);
                    console.log(uiNode.node);
                })
                break;
            }
            case "stringLiteral": {
                element.appendChild(text);
                const input = document.createElement("input");
                input.type = "text";
                input.className = "workspace__input-number"
                element.appendChild(input);
                input.value = value;
                break;
            }
            case "assign": {
                const left = document.createElement("div");
                left.classList.add("workspace__branch");
    
                const right = document.createElement("div");
                right.classList.add("workspace__branch");
    
                element.appendChild(left);
                element.appendChild(text);
                element.appendChild(right);
                break;
            }
        }
        this.activeBlocks.set(uiNode.node.id, uiNode);
        console.log(this.activeBlocks)
        return uiNode;
    }

    attach(parent, current) {
        parent.appendChild(current)
    }

    createElement(type, label, value = null) {
    }
}


// document.getElementById('palette-set').addEventListener('mousedown', (e) => {
//     const newBlock = manager.spawnBlock('set', e.clientX, e.clientY);
    
//     startDragging(newBlock, e);
// });

export {UINodeManager}