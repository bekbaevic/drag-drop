const modulesContainerEl = document.querySelector('#modules-container')     //MODULE CONTAINER
const moduleInputEl = document.querySelector("#module-input")    //MODULE INPUT
const moduleForm = document.querySelector("#module-form")    //MODULE FORM

let dragStartUserId = null;
let dragEnteredModuleId = null;


// ALL MODULES
let modules = [
    { id: 1, name: "First module" },
    { id: 2, name: "Second module" },
]


// ALL USERS 
let users = [
    { id: 1, name: "John Doe", moduleId: 1 },
    { id: 2, name: "Mark Twen", moduleId: 2 },
]


// RENDER MODULES
function renderModules(modulesArray = []) {
    modulesContainerEl.innerHTML = ''

    modulesArray.map(item => {
        modulesContainerEl.innerHTML += `
        <!-- Module -->
        <div 
        ondragover="event.preventDefault()" 
        ondragenter="dragEnter(${item.id})" 
        ondragleave="dragLeave(${item.id})"
        ondrop="drop(${item.id})"
        id="module-${item.id}" 
        class="w-[320px] min-w-[320px] max-w-[320px] border border-[rgba(255, 255, 255, 0.1)] rounded-md p-2 bg-gray-300 bg-opacity-30 backdrop-filter backdrop-blur-sm">
            <!-- Module Header -->
            <header class="w-full bg-indigo-500 rounded-md px-3 py-2 flex justify-between items-center text-white">
                <h2>${item.name}</h2>
                <div class="flex items-center gap-2">
                    <i onclick="deleteModule(${item.id})" class="bx bx-trash-alt cursor-pointer"></i>
                    <i onclick="addNewUser(${item.id})" class="bx bx-plus-circle cursor-pointer"></i>
                </div>
            </header>

            <!-- Divider -->
            <div class="w-full h-[1px] bg-gray-200 bg-opacity-40 my-2"></div>

            <!-- Users Container -->
            <div id="users-container">
            </div>
        </div>
        `
        
    })
    renderUsers(users)
}


// ADD MODULE FUNCTION
function addModule(event) {
    event.preventDefault()
    if (moduleInputEl.value) {
        let newModule = {
            id: Date.now(),
            name: moduleInputEl.value,
        }

        modules = [...modules, newModule]
        moduleInputEl.value = ""
        newModule = null
        renderModules(modules)

        Swal.fire({
            icon: "success",
            title: "SUCCESS",
            text: "Module successfully added!"
        })
    } else {
        Toastify({
            text: "Please enter a module name!",
            icon: 'error',
        }).showToast()
    }
}
moduleForm.addEventListener("submit", addModule)


// DELETE MODULE FUNCTION
function deleteModule(id) {
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
    }).then((result) => {
        if (result.isConfirmed) {
            modules = modules.filter(item => item.id !== id)
            users = users.filter(item => item.moduleId !== id)
            renderModules(modules)
            Swal.fire({
                title: "Deleted!",
                text: "Module has been deleted.",
                icon: "success"
            });
        }
    });
}


// RENDER USERS 
function renderUsers(usersArray = []) {
    usersArray.map(item => {
        const currentUserModuleEl = document.querySelector(`#module-${item.moduleId} #users-container`)

        currentUserModuleEl.innerHTML += `
            <!-- User -->
            <div id="user-${item.id}" 
                draggable="true" 
                ondragstart="dragDropStart(${item.id})" 
                ondragend="dragDropEnd()" 
                class="py-2 rounded-md flex justify-between items-center bg-white cursor-pointer hover:bg-slate-100 px-3 mb-2   "
            >
                <h2 class="text-slate-700">${item.name}</h2>
                <i 
                    onclick="deleteUser(${item.id}, ${item.moduleId})" 
                    class="bx bx-trash-alt text-red-700">
                </i>
            </div>
        `
    })
}


// ADD USERS FUNCTION
function addNewUser(moduleId) {
    const username = prompt("Enter your username: ")

    if (username) {
        const newUserData = {
            id: Date.now(),
            name: username,
            moduleId: moduleId,
        }
        users = [...users, newUserData]
        Swal.fire({
            title: 'New user added successfully!',
            icon: "success",
        })
    }
    renderModules(modules)
}

// DELETE USER FUNCTION 
function deleteUser(id, moduleId) {
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
    }).then((result) => {
        if (result.isConfirmed) {
            users = users.filter(item => item.id !== id || item.moduleId !== moduleId)
            renderModules(modules)
            Swal.fire({
                title: "Deleted!",
                text: "Module has been deleted.",
                icon: "success"
            });
        }
    });
}

// DRAGDROPSTART FUNCTION
function dragDropStart(userId) {
    dragStartUserId = userId
    setTimeout(() => {
        document.querySelector(`#user-${userId}`).classList.add("hidden")
    }, 0);
 
}


// DRAGDROPEND FUNCTION 
function dragDropEnd() {
    document.querySelector(`#user-${dragStartUserId}`).classList.remove("hidden")
    document.querySelector(`#module-${dragEnteredModuleId}`).classList.remove('bg-white')
}


// DRAGENTER FUNCTION
function dragEnter(moduleId) {  
    dragEnteredModuleId = moduleId;
    document.querySelector(`#module-${moduleId}`).classList.add('bg-white')
}   


// DRAGLEAVE FUNCION 
function dragLeave(moduleId) {
    document.querySelector(`#module-${moduleId}`).classList.remove('bg-white')
}


// DROP FUNCTION
function drop(moduleId) {
    users = users.map((item) => {
        if(item.id === dragStartUserId){
            return {
                ...item,
                moduleId: moduleId
            }
        }else{
            return item
        }
    }) 
    renderModules(modules)
}


renderModules(modules)
 