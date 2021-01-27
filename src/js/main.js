"use strict";
let filterToDoGlobal="all";

class StorageOperator{
    constructor() {
        this.toDoArray = JSON.parse(localStorage.getItem("TodoList")) || []
        // console.log(this.toDoArray)
    }
    getMaxIndex(){
        let max = 0;
        for(let elem of this.toDoArray){
            console.log("elem iterator", elem.index)
            if (elem.index > max) max = elem.index
        }
        return max
    }
    showAllElements(filter){
        document.getElementById("todolist").innerHTML="";
        console.log("filter", filter)
        for(let elem of this.toDoArray){

            const fooElem = new TodoObject(elem.text, elem.index, elem.complete)
            switch (filter){
                case "unfinished":
                    if (fooElem.complete===false){
                        fooElem.writeObject()
                    }
                    break;
                case "completed":
                    if (fooElem.complete===true){
                        fooElem.writeObject()
                    }
                    break;
                default:
                    fooElem.writeObject()
            }
        }
    }

    addElement(todoObj){
        this.toDoArray.push(todoObj)
        todoObj.index = this.getMaxIndex() + 1
        localStorage.setItem("TodoList", JSON.stringify(this.toDoArray))
    }

    getElementIndex(id){
        let index = 0
        console.log(typeof id, "id get element")
        for (let el in this.toDoArray){
            // console.log(this.toDoArray[el].index, "el get element")
            if (this.toDoArray[+el].index===id){
                break;
            }
            index += 1
        }
        console.log("index", index)
        return index
    }

    deleteElement(id){
        this.toDoArray.splice(this.getElementIndex(id),1)
        localStorage.setItem("TodoList", JSON.stringify(this.toDoArray))
        }

    changeElementStatus(id){
        let completeStatusElement = this.toDoArray[this.getElementIndex(id)].complete
        this.toDoArray[this.getElementIndex(id)].complete = !completeStatusElement
        console.log(completeStatusElement, 'change element status')
        localStorage.setItem("TodoList", JSON.stringify(this.toDoArray))
    }
}

class TodoObject {
    constructor(toDoText = "", index = 0, complete=false) {
        this.index = +index;
        this.complete = complete;
        this.text = toDoText;
    }
    updateText(newText){
        this.text = newText;
        console.log("todo update text", this.index, this.text)
    }
    updateComplete() {
        this.complete = !this.complete
        console.log("togo update toggle", this.index, this.complete)
    }
    writeObject(){
        const htmlObject = document.createElement('div')
        htmlObject.className= "todo-object frame-border"
        htmlObject.id=`tododiv${this.index}`
        const completeStatus = this.complete ? "line-through" : "none"
        htmlObject.innerHTML=`
                    <input class="elem-list-checkbox" name="toggle${this.index}" id="toggle${this.index}" type="checkbox" ${this.complete ? "checked" : ""}>
                    <label class="elem-list-checkbox-label" style="text-decoration: ${completeStatus}" for="toggle${this.index}">${this.text}
                    </label>
                    <label class="elem-list-label">
                        <input class="elem-list-input" id="input${this.index}" type="text">
                    </label>
                    <button class="elem-list-delete" onclick="deleteObjective(${this.index})">X</button>
                    `;
        document.getElementById("todolist").appendChild(htmlObject);

        let checkboxListener = document.getElementById(`toggle${this.index}`);
        checkboxListener.addEventListener('change', () => {
            setObjectiveStatus(`${this.index}`)
        });
    }
}

// localStorage.clear()
console.log("keys localstorage", Object.keys(localStorage))

const operator = new StorageOperator

operator.showAllElements('all')


// add new objective
const inputToDo = document.getElementById('todoInput');
inputToDo.addEventListener('keypress', addObjective);

function filterButtons(event){
    filterToDoGlobal=event
    operator.showAllElements(event)
}

function deleteObjective(todoId){
    console.log('deleteObject', todoId )
    operator.deleteElement(+todoId)
    operator.showAllElements(filterToDoGlobal)
}

function setObjectiveStatus(todoId){
    console.log("setObjectiveStatus", todoId)
    operator.changeElementStatus(+todoId)
    operator.showAllElements(filterToDoGlobal)
}

function addObjective(e) {
    if (e.key==='Enter') {
        if (inputToDo.value !== ""){
            console.log("input todo value", inputToDo.value)
            const todoElement = new TodoObject(inputToDo.value)
            operator.addElement(todoElement)
            inputToDo.value = ""
            todoElement.writeObject(filterToDoGlobal)
        }
    }
}
