
let tasks = []
$(document).ready(function(){
    init();
    autoLogin()
   // login()
   // drawTasks()

   
})

/** initialisation de l'application **/
function init(){
    console.log('init')
    if(localStorage.getItem('tasks') == undefined) {
        localStorage.setItem('tasks', JSON.stringify([]))
    }
    initEvents()
}

function autoLogin(){
    let user = localStorage.getItem('user')
    if(user !== undefined){
        user = JSON.parse(user)
        $('#connexion-container').val()
        $('#app-content').hide()
    }else{
        initTasksPage()
    }
}

function initTasksPage(){
    $('#connexion-container').hide()
    $('#app-content').show()

    drawTasks()
}

function initLoginPage(){
    $('#connexion-container').show()
    $('#app-content').hide()

    drawTasks()
}
function login(){
    let email = $('#email').val()
    let password = $('#password').val()
    let active = $('#user-active').prop('checked')

    console.log({email , password})
    if(email == '' || password == ''){
        showAlert('Erreur de connexion')
        return
    }

    localStorage.setItem('user', {email , password , active ,name: "ADMIN"})
    initTasksPage()

}

function logout(){
    let user = JSON.parse(localStorage.getItem('user'))

    

}
/** les evenements */
function initEvents(){
    $('.modal .close').click(function(){
        $(this).parents('.modal').hide()
    })

    $('.alert .close').click(function(){
        $(this).parents('.alert').hide()
    })

    $('#save-task-btn').click(saveTask)

    $('#add-task-btn').click(editTask)
}

/** Manipulation de l'affichage ( alert , modal ...) */
function showModal(body , title , classList = ''){
    let modal = $('#app-modal');
    modal.find('.modal-title').html(title || 'Titre')
    modal.find('.modal-body').html(body || '')
    modal.addClass(classList).show()
}

function hideModal(){
    $('#app-modal').attr('class', 'modal modal-sm').hide()
}

function showAlert(content , type = "error"){

    let btnClass = 'btn-danger'
    if(type != "error"){
        btnClass = ''
    }
    let alert = $('#app-alert');
    alert.find('.alert-body').html(content)
    alert.find('.close').attr('class', 'btn '+btnClass)
    alert.show()
}

function hideAlert(){
    $('#app-alert').hide()
}
/** Gestion des taches */

function tasksList(){
   return JSON.parse(localStorage.getItem('tasks'))
}

function getOneTask(task_id){
    let tasks = tasksList();
    return tasks.find(task => task.id == task_id)
}

function editTask(task_id){
    let task = {id: 0 , label:'', userId: '' , description: '' , begTime:'' , endTime:''}
    let html = `
        <div class="task-form" id="">
            <input type="hidden" data-name="id" class="task-input" value="${task.id}">
            <div class="row">
                <div class="col">
                    <div class="form-group">
                        <strong>Titre</strong>
                        <input type="text" required class="form-control task-input" placeholder="Titre" id="task-label" data-name="label" value="${task.label}">
                    </div>
                </div>
                <div class="col">
                    <div class="form-group">
                        <strong>Utilisateur</strong>
                        <select required type="text" class="form-control  task-input" data-name="userId" value="${task.userId}">
                            <option value="">Choisir</option>
                        </select>
                    </div>
                </div>
            </div>
            <div>
                <div class="form-group">
                    <strong>Description</strong>
                    <textarea required type="text" class="form-control  task-input" style="height: 60px;" data-name="description" value="${task.description}"></textarea>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <div class="form-group">
                        <strong>Début</strong>
                        <input required type="time" class="form-control  task-input" data-name="startTime" value="${task.startTime}">
                    </div>
                </div>
                <div class="col">
                    <div class="form-group">
                        <strong>Fin</strong>
                        <input  type="time" class="form-control  task-input" data-name="endTime" value="${task.endTime}">
                    </div>
                </div>
            </div>
            <div></div>
            </div>
    
    `

    showModal(html , "Nouvelle tache" )


}


function saveTask(){
    let obj = {};

    let hasError = false
    $('.task-input').each(function(){
        let key = $(this).data('name');
        let isRequired = $(this).attr('required')
        if(isRequired && $(this).val() == '')
          hasError = true;

        obj[key] = $(this).val()

    })
    
    /* if(hasError){
        alert('Veuillez remplire tous les champs !!!');
        return
    } */

    let tasks = tasksList();

    const task_index = tasks.findIndex(task => task.id == obj.id)

    if(task_index !== -1){
        tasks.splice(task_index , 1 , obj)
    }else{
        obj.id = tasks.length + 1
        obj.status = 'En cours'
        tasks.push(obj)
    }

    console.log('tasks:', tasks)

    localStorage.setItem('tasks', JSON.stringify(tasks))
    hideModal();
    drawTasks()
}


function changeStatus(task_id , status){
    console.log('status', status)
    let tasks = tasksList();
    tasks.find( task => {
             if(task.id == task_id){
                 task.status = status
                 return true
             }
             return false
    })

    localStorage.setItem('tasks', JSON.stringify(tasks));

    drawTasks()
}


const drawTasks = ()=>{
    let tasks = tasksList();
    let html =``;
    console.log('tasks:', tasks)
    tasks.forEach( task => {
        html += `
            <div class="task-container">
                <div class="task-item shadow-lg">
                        <div class="task-header">
                        <ion-icon name="calendar"></ion-icon> 
                        <strong class="task-title">
                            ${task.label}
                        </strong>
                        <span class="task-timewindow">[${task.startTime}- ${task.endTime}]</span>
                        <span class="task-status">${task.status}</span>
                        </div>
                        <div class="task-body">
                            ${task.description}
                        </div>
                        <div class="task-footer">
                            <ion-icon name="close" class="text-danger" onclick="changeStatus(${task.id},'annuler')"></ion-icon>
                            <ion-icon name="checkmark-circle-outline"  class="text-success" onclick="changeStatus(${task.id},'terminé')"></ion-icon>
                        </div>
                </div>
            </div>
        `
    })

    $('#tasks-container').html(html)

    $('.task-item').dblclick(()=>{
        showModal()
    })
}