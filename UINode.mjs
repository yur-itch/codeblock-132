import { ASTNode, Interpreter, EvalError } from "index.mjs"

class UINode {
    constructor(parent, type, name, value) {
        this.element = document.createElement("div");
        this.element.classList.add('workspace__stringLiteral-block');
        this.element.classList.add('block');
        this.element.classList.add('with-branch');
        const text = document.createElement("div");
        this.element.style.position = 'absolute';
        text.innerHTML = name;
        text.classList.add('workspace__operation');
        this.element.appendChild(text);
        this.parent = parent;
        parent.appendChild(this.element);
        this.children = [];

        this.node = new ASTNode
    }

    appendChild(childUINode) {
        this.node.children.push(childUINode.node);
        const contrainer = this.element.querySelector(".workspace__branch");
        contrainer.appendChild(this.element);
    }
}