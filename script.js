// ELEMENTOS
const notesContainer = document.querySelector("#notes-container")
const noteInput = document.querySelector("#note-content")
const addNoteBtn = document.querySelector(".add-note")
const searchInput = document.querySelector("#search-input")


// FUNÇÔES 
function showNotes(){
    getNotes().forEach((note) => {
        const noteElement = createNote(note.id, note.content, note.fixed)
        notesContainer.appendChild(noteElement)
    });
}
function addNote(){
    const notes = getNotes()

    const noteObject = {
        id: generateId(),
        content: noteInput.value,
        fixed: false
    }
    const noteElement = createNote(noteObject.id, noteObject.content)

    notesContainer.appendChild(noteElement)

    notes.push(noteObject)
    saveNotes(notes)
    noteInput.value = ""
}

function generateId(){
    return Math.floor(Math.random() * 5000)
}

function createNote(id, content, fixed){
    const element = document.createElement("div")
    element.classList.add("note")

    const textarea = document.createElement("textarea");
    textarea.value = content;
    textarea.placeholder = "Adicione algum texto..."
    element.appendChild(textarea)

    const pinIncon = document.createElement("i")
    pinIncon.classList.add(...["bi", "bi-pin"])
    element.appendChild(pinIncon)

    const deleteIncon = document.createElement("i")
    deleteIncon.classList.add(...["bi", "bi-x-lg"])
    element.appendChild(deleteIncon)

    const duplicateIncon = document.createElement("i")
    duplicateIncon.classList.add(...["bi", "bi-file-earmark-plus"])
    element.appendChild(duplicateIncon)
    
    if(fixed){
        element.classList.add("fixed");
    }

    // EVENTOS DO ELEMENTO
    element.querySelector("textarea").addEventListener("keyup", (e) => {
        const noteContent = e.target.value
        updateNote(id, noteContent)
    })

    element.querySelector(".bi-pin").addEventListener("click", () => {
    fxNotes(id)
    })
    element.querySelector(".bi-x-lg").addEventListener("click", () => {
    deleteNote(id, element)
    })
    element.querySelector(".bi-file-earmark-plus").addEventListener("click", () => {
    copyNote(id);
    }) 

    return element;
}

function fxNotes(id){
    const notes = getNotes();
    const targetNote = notes.filter((note) => note.id === id)[0]
    targetNote.fixed = !targetNote.fixed;
    saveNotes(notes);
    cleanNotes()
    showNotes()
}
function deleteNote(id, element){
    const notes = getNotes().filter((note) => note.id !== id)
    saveNotes(notes)
    notesContainer.removeChild(element)
}
function copyNote(id){
    const notes = getNotes();
    const targetNote = notes.filter((note) => note.id === id)[0]
    const noteObject = {
        id: generateId(),
        content: targetNote.content,
        fixed: false
    }
    const noteElement = createNote(
        noteObject.id,
        noteObject.content,
        noteObject.fixed
    )
    notesContainer.appendChild(noteElement)
    notes.push(noteObject)
    saveNotes(notes)
}

function updateNote(id, newContent){
     const notes = getNotes();
     const targetNote = notes.filter((note) => note.id === id)[0]
     targetNote.content = newContent;
     saveNotes(notes);
}
function cleanNotes(){
    notesContainer.innerHTML = ""
}
// LOCAL STORAGE
function getNotes(){
    const notes = JSON.parse(localStorage.getItem("notes") || "[]");
    const ordemNotes = notes.sort((a, b) => (a.fixed > b.fixed ? -1 : 1))
    return ordemNotes;
    
}
function saveNotes(notes){
    localStorage.setItem("notes", JSON.stringify(notes));
}
function searchNotes(search){
    const searchResults = getNotes().filter((note) => {
       return note.content.includes(search)
    })
    console.log(searchResults);
    if(search !== ""){
        cleanNotes();

        searchResults.forEach((note) =>{
            const noteElement = createNote(note.id, note.content, note.fixed)
            notesContainer.appendChild(noteElement)
        })
        return
    }
    cleanNotes()
    showNotes()
}
// EVENTOS

addNoteBtn.addEventListener("click", () => addNote())

searchInput.addEventListener("keyup", (e) => {
    const search = e.target.value;
    searchNotes(search)
})

noteInput.addEventListener("keydown", (e) =>{
    if(e.key === "Enter"){
        addNote()
    }
})


showNotes()
