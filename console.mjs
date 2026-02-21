
class Console
{
    constructor() {
        this.output = document.querySelector(".workspace__output");
        this.input = document.querySelector(".workspace__input");
        // this.input.addEventListener("keydown", (e) => {
        //     if(e.key !== "Enter") return;
        //     console.log(e.key)
        // });
        this.input.remove();
    }
    print(text) {
        this.output.innerHTML += `<div>> ${text}</div>`;
        // output.innerHTML += `<div>Команда "${text}" выполнена</div>`;
        // input.value = '';
    }
}
export {Console}