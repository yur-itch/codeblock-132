import { ASTNode, Interpreter } from "./index.mjs"

class UINode {
    constructor(type, element, value = null) {

        this.element = element;
        this.node = new ASTNode(type, value);
        this.parent = null;
    }

    appendChild(childUINode) {
        this.node.children.push(childUINode.node);
        const contrainer = this.element.querySelector(".workspace__branch");
        contrainer.appendChild(this.element);
    }

    setParent(parent)
    {
        this.parent = parent;
        parent.appendChild(this.element);
        this.children = [];

    }
}

export {UINode}