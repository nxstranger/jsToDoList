"use strict";
let filterToDoGlobal="all";

class StorageOperator{
    constructor() {
        this.toDoArray = JSON.parse(localStorage.getItem("TodoList")) || []
        console.log(this.toDoArray)
    }

    getMaxIndex(){
        let max = 0;
        for(let elem of this.toDoArray){
            // console.log("elem iterator", elem.index)
            if (elem.index > max) max = elem.index
        }
        return max
    }

    showAllElements(filter){
        document.getElementById("todolist").innerHTML="";
        // console.log("filter", filter)
        for(let elem of this.toDoArray){

            const fooElem = new TodoObject(elem.text, elem.index, elem.complete)
            switch (filter){
                case "unfinished":
                    if (fooElem.complete===false) fooElem.writeObject()
                    break;
                case "completed":
                    if (fooElem.complete===true) fooElem.writeObject()
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
        // console.log(typeof id, "id get element")
        for (let el in this.toDoArray){
            if (this.toDoArray[+el].index===id) break;
            index += 1
        }
        // console.log("index", index)
        return index
    }

    deleteElement(id){
        // delete by id entity
        this.toDoArray.splice(this.getElementIndex(id),1)
        localStorage.setItem("TodoList", JSON.stringify(this.toDoArray))
        }

    setObjectiveText(id, text){
        this.toDoArray[this.getElementIndex(id)].text = text
        localStorage.setItem("TodoList", JSON.stringify(this.toDoArray))
    }


    changeElementStatus(id){
        let completeStatusElement = this.toDoArray[this.getElementIndex(id)].complete
        this.toDoArray[this.getElementIndex(id)].complete = !completeStatusElement
        // console.log(completeStatusElement, 'change element status')
        localStorage.setItem("TodoList", JSON.stringify(this.toDoArray))
    }

    completeAll(){
        // console.log('complete all')
        for (let el in this.toDoArray){
            this.toDoArray[+el].complete = true
        }
        localStorage.setItem("TodoList", JSON.stringify(this.toDoArray))
    }

    deleteCompleted(){
        console.log('todo range', this.toDoArray.length)

        let filtered = this.toDoArray.filter(function(value, index, arr){
            return !value.complete;
        });

        this.toDoArray = filtered
        console.log(filtered)
        localStorage.setItem("TodoList", JSON.stringify(filtered))
    }
}

class TodoObject {
    constructor(toDoText = "", index = 0, complete=false) {
        this.index = +index;
        this.complete = complete;
        this.text = toDoText;
    }

    writeObject(){
        const htmlObject = document.createElement('div')
        const completeStatus = this.complete ? "line-through" : "none"
        htmlObject.className= "todo-object frame-border"
        htmlObject.id=`tododiv${this.index}`
        htmlObject.innerHTML=`
                    <input class="elem-list-checkbox" name="toggle${this.index}" id="toggle${this.index}" type="checkbox" ${this.complete ? "checked" : ""}>
                    <label class="elem-list-checkbox-label"  for="toggle${this.index}">
                    </label>
                    <input class="elem-list-input" id="input${this.index}" name="input${this.index}" type="text" value="${this.text}">
                    <label class="elem-list-input-label" style="text-decoration: ${completeStatus}" for="input${this.index}" id="label${this.index}">
                        ${this.text}
                        </label>
                    <button class="elem-list-delete" onclick="deleteObjective(${this.index})">X</button>
                    `;
        document.getElementById("todolist").appendChild(htmlObject);

        this.checkboxListener(`toggle${this.index}`);
        this.objectiveLabelListener(`label${this.index}`, `input${this.index}`)
        this.objectiveInputListener(`label${this.index}`, `input${this.index}`)

    }

    checkboxListener(checkboxId){
        let checkbox = document.getElementById(checkboxId);
        checkbox.addEventListener('change', () => {
            setObjectiveStatus(`${this.index}`)
        });
    }

    objectiveLabelListener(labelId, inputId){
        let label = document.getElementById(labelId);
        let input = document.getElementById(inputId);

        label.addEventListener('dblclick', () => {
            // console.log('dblclick label', labelId)
            label.style.display = 'none';
            input.style.display = 'flex';
        });
    }

    objectiveInputListener(labelId, inputId) {
        let label = document.getElementById(labelId);
        let input = document.getElementById(inputId);
        input.addEventListener('keydown', (e) =>{
            console.log(e.key)
            if (e.key === 'Escape'){
                console.log("escape pressed")
                label.style.display = 'flex';
                input.style.display = 'none';
            }
        })
        input.addEventListener('keypress', (e) => {
            e.preventDefault()
            console.log(e.key)
            if (e.key === 'Enter' && input.value !== "" ){
                // console.log("update objective text")
                label.style.display = 'flex';
                input.style.display = 'none';
                objectiveUpdateText(this.index, input.value)
            }
        });

    }


}

// localStorage.clear()
// console.log("keys localstorage", Object.keys(localStorage))

const operator = new StorageOperator
operator.showAllElements(filterToDoGlobal)

// add new objective
const inputToDo = document.getElementById('todoInput');
inputToDo.addEventListener('keypress', addObjective);

function completeAllObjective(){
    operator.completeAll()
    operator.showAllElements()
}

function filterButtons(event){
    filterToDoGlobal=event
    operator.showAllElements(event)
}

function deleteObjective(todoId){
    // console.log('deleteObject', todoId )
    operator.deleteElement(+todoId)
    operator.showAllElements(filterToDoGlobal)
}

function setObjectiveStatus(todoId){
    // console.log("setObjectiveStatus", todoId)
    operator.changeElementStatus(+todoId)
    operator.showAllElements(filterToDoGlobal)
}

function objectiveUpdateText(id, text){
    operator.setObjectiveText(id, text)
    operator.showAllElements(filterToDoGlobal)

}

function addObjective(e) {
    if (e.key==='Enter' && inputToDo.value !== ""){
        console.log("input todo value", inputToDo.value)
        const todoElement = new TodoObject(inputToDo.value)
        operator.addElement(todoElement)
        inputToDo.value = ""
        todoElement.writeObject(filterToDoGlobal)
    }
}

function deleteCompletedObjective(){
    operator.deleteCompleted()
    operator.showAllElements(filterToDoGlobal)
    console.log()
}
