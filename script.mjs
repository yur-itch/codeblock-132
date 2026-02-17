import { UINodeManager } from "./UINodeManager.mjs";
// делаем клон наших блоков
// const clone = block.cloneNode(true);
const manager = new UINodeManager();

// clone.classList.add("code-block");
// clone.classList.remove("block");

const palette = document.querySelector(".workspace__block-palette");
const editor = document.querySelector(".workspace__code-editor");

let draggingBlock = null; // какой блок сейчас тащим
let currentBranch = null; // состояние текущей ветки; Это память о прошлой ветке, над которой был курсор.
// где внутри блока был клик
let offsetX = 0;
let offsetY = 0;
// pointerdown - сообщает, что произошло нажатие
// e — объект события (координаты мыши, target, тип события и т.д.)
// e.target - элемент, по которому нажали
const numberBlock = palette.querySelector(".workspace__numberLiteral-block")
const stringBlock = palette.querySelector(".workspace__stringLiteral-block")
const assignBlock = palette.querySelector(".workspace__assign-block")
numberBlock.addEventListener('pointerdown', (e) => {
    const uiNode = manager.spawnNode("numberLiteral", "Число")
    startDragging(uiNode, e);
});
stringBlock.addEventListener('pointerdown', (e) => {
    const uiNode = manager.spawnNode("stringLiteral", "Строка")
    startDragging(uiNode, e);
});
assignBlock.addEventListener('pointerdown', (e) => {
    const uiNode = manager.spawnNode("assign", "=")
    startDragging(uiNode, e);
});

function startDragging(uiNode, e) {
    editor.parentElement.append(uiNode.element);
    draggingBlock = uiNode;
    const block = e.target.closest(".block")
    const rect = block.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    uiNode.element.style.position = "absolute"
    uiNode.element.style.top  = (e.clientY - offsetY) + 'px';
    uiNode.element.style.left = (e.clientX - offsetX) + 'px';
}

editor.addEventListener('pointerdown', (e) => { 
    /* если кликнули: по блоку → вернёт блок по ветке / пустоте → null */ 
    const block = e.target.closest(".block");
    //console.log(e.target, block)
    if (!block) return;
    /* чтобы клик не дошёл до palette 
    document иначе могут начаться глюки */
    e.stopPropagation();

    draggingBlock = manager.activeBlocks.get(block.id);
    console.log(block.id)
    console.log(draggingBlock)

    const rect = block.getBoundingClientRect();

    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    document.body.appendChild(block);

    block.style.position = 'absolute';
    block.style.left = (e.clientX - offsetX) + 'px';
    block.style.top  = (e.clientY - offsetY) + 'px';

});

document.addEventListener('pointermove', (e) => {
    if (!draggingBlock) return; // если не тянем — ничего не делаем

    // просто обновляем его позицию при движении мыши
    draggingBlock.element.style.left = (e.clientX - offsetX) + 'px';
    draggingBlock.element.style.top  = (e.clientY - offsetY) + 'px';

    //кладем блоки в ветку
    const branch = getBranchUnderCursor(e.clientX, e.clientY); 
    /* e.clientX, e.clientY — позиция курсора в окне
getBranchUnderCursor(x, y):
перебирает все .workspace__branch
проверяет: попал ли курсор внутрь прямоугольника ветки
если да → возвращает DOM-элемент ветки
если нет → null*/

    if(branch !== currentBranch){ // проверяем изменилась ли на самом деле ветка
        if(currentBranch){ // проверка на null
            currentBranch.classList.remove('highlight');
            //удаляем у старой ветки класс
        }
        /*Если курсор сейчас над веткой:
добавляем ей визуальный класс
Если branch === null:
ничего не делаем (курсор в пустоте) */
        if(branch){
            branch.classList.add('highlight');
        }
        currentBranch = branch;
        /* запомнили, над какой веткой курсор
следующий pointermove будет сравнbваться с ней */
    }
    /* Ты делаешь это КАЖДЫЙ кадр:
Узнать, над какой веткой курсор
Если ветка изменилась:
убрать подсветку старой
подсветить новую
Запомнить новую ветку */
});

document.addEventListener('pointerup', (e) => {
    if (!draggingBlock) return;

    const branch = getBranchUnderCursor(e.clientX, e.clientY);

    const editorRect = editor.getBoundingClientRect(); // координаты editor
    // проверка на то, находится ли блок в зоне editor
    const isInsideEditor =
        e.clientX >= editorRect.left &&
        e.clientX <= editorRect.right &&
        e.clientY >= editorRect.top &&
        e.clientY <= editorRect.bottom;
    
    // если находится, то добавляем его в editor
    if (!isInsideEditor) {
        // иначе - удаляем

        draggingBlock.remove();
    } else if (branch){
        branch.appendChild(draggingBlock.element);
        draggingBlock.element.style.position = 'static';
    } else{
        // пересчитываем координаты под editor
        const x = e.clientX - editorRect.left - offsetX;
        const y = e.clientY - editorRect.top  - offsetY;

        // СНАЧАЛА мы кладём блок в editor
        editor.appendChild(draggingBlock.element);
        // ПОТОМ задаём left/top, потому что система координат меняется
        // (раньше система координат нашего блока зависела от body, щас от editor)
        draggingBlock.element.style.left = x + 'px';
        draggingBlock.element.style.top  = y + 'px';
    }

    if (currentBranch) { 
        currentBranch.classList.remove('highlight'); 
        currentBranch = null; 
    }

    draggingBlock = null; // блок больше не двигаем
});

/* palette — шаблоны

editor — рабочая зона

cloneNode создаёт независимый блок для editor

pointerdown / move / up делают drag

offsetX/Y обеспечивают правильное позиционирование при перетаскивании*/

// Дальше делаем прилипание блоков через Snap
// Snap - это проверка расстояния между блоками

// кладем блоки в ветку:

function getBranchUnderCursor(x,y){
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
