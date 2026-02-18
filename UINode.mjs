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

    appendChild(childUINode, branch) {
        const index = this.branches.indexOf(branch);
        console.log(index);
        branch.appendChild(childUINode.element);
        this.node.children.push(childUINode.node);
    }

    removeChild(childUINOde) {
        const index = this.node.children.indexOf(childUINOde.node);
        if (index !== -1) {
            this.node.children.splice(index, 1);
        }
    }

    attachTo(parent) {
        this.element.style.position = 'static';
        this.parent = parent;
    }

    detach() {
        this.element.style.position = 'absolute';
        if (this.parent) {
            this.parent.removeChild(this);
        }
    }

    remove() {
        this.element.remove();
    }
}

export {UINode}