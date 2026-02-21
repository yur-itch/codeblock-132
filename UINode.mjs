import { ASTNode, Interpreter } from "./index.mjs"

class UINode {
    constructor(type, element, value = null, branches = null) {
        this.element = element;
        this.node = new ASTNode(type, value);
        this.parent = null;
        this.branches = branches;
    }

    setBranches(branches)
    {
        this.branches = branches;
    }

    setOperation(variable)
    {
        this.node.children[0] = variable;
        return this;
    }

    canAppendChild(childUINode, branch) {
        const index = this.branches.indexOf(branch);
        switch (this.node.token) {
            case "assign": {
                return ((index === 0) && !(this.node.children[0])) || ((index === 1) && !(this.node.children[0]))
            }
        }
    }

    appendChild(childUINode, branch) {
        const offset = this.node.token == "call" ? 1 : 0;
        const index = this.branches.indexOf(branch);
        console.log(`Node added to branch with index: ${index}`);
        branch.appendChild(childUINode.element);
        this.node.children[index + offset] = childUINode.node;
    }

    removeChild(childUINOde) {
        const index = this.node.children.indexOf(childUINOde.node);
        if (index !== -1) {
            this.node.children.splice(index, 1);
        }
    }

    attachTo(parent) {
        this.element.style.position = "static";
        this.parent = parent;
    }

    detach() {
        if (this.parent) {
            this.parent.removeChild(this);
        }
    }

    remove() {
        this.element.remove();
    }
}

export {UINode}