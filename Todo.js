/**
 *
 */


window.addEventListener("load",function() {

    var state = null;
//  var state = JSON.parse(localStorage.getItem("object"))
    if (state === null) {
        var state = {
            taskList: [
                /*                {

                 name: "Some task",
                 desk: "No description",
                 completed: false

                 }
                 */    ],
            currentTask: null
            //{name: null, desk: null}
        }
    }

    var list = document.getElementById("todoList");
    var addButton = document.getElementById("btnAdd");
    //var okButton = document.getElementById("btnOk");

    /*          var canvas = document.getElementsByClassName('spinn');
     var ctx = canvas[0].getContext("2d");
     ctx.arc(100, 100, 20, 0, 2*Math.PI, true);
     */         // $("button").click(function(){


    function save(task) {
//var id = 0;
        $.ajax({
            url: "http://54.76.141.74/tasks",
            method: "post",
            data: {
                //id:1438616631069,
                title: task.name,
                description: task.desk
            },
            success: function (data) {
                //$("#div1").html(result);
                // console.log(data);
                //          data.title = task.name;
                //          data.description = task.desk;


                render();
                state.taskList[state.taskList.length - 1].id = data.id;
                //console.log(state.taskList)
            }

        })
    }

    function deleteServer(id) {
        //var id = 0;
        $.ajax({
            url: "http://54.76.141.74/tasks/" + id,
            method: "delete",
            /*          data: {
             //id:1438616631069,
             title: task.name,
             description: task.desk
             },
             */          success: function (data) {
                //$("#div1").html(result);
                // console.log(data);
                //          data.title = task.name;
                //          data.description = task.desk;


                render();
                //state.taskList[state.taskList.length - 1].id = data.id;
                //console.log(state.taskList)
            }

        })
    }

    function editServer(task) {
        //var id = 0;
        console.log(task.id)
        $.ajax({
            url: "http://54.76.141.74/tasks/" + task.id,
            method: "put",
            data: {
                //id:task.id,
                title: task.name,
                description: task.desk
            },
            success: function (data) {
                //$("#div1").html(result);
                // console.log(data);
                //          data.title = task.name;
                //          data.description = task.desk;


                render();
                //state.taskList[state.taskList.length - 1].id = data.id;
                //console.log(state.taskList)
            }

        })
    }

    function fetch() {

        $.ajax({
            url: "http://54.76.141.74/tasks",
            method: "get",
            data: {
                //id:1438616631069,
                //title:"new task 1111111",
                //description: "Slava's task"
            },
            success: function (data) {
                //$("#div1").html(result);
                //console.log(data);
                var taskList = [];
                for (var i = 0; i < data.length; i++) {
                    var newObj = {};
                    newObj.name = data[i]["title"];

                    newObj.desk = data[i]["description"];
                    newObj.id = data[i]["id"];
                    newObj.completed = false;
                    //console.log(state);
                    state.taskList.push(newObj);

                }

                console.log(location.hash)
                var hsh = + location.hash.substring(2);
                var task = state.taskList.filter(function(item){
                    return item.id == hsh;
                })[0];
                render();
                openTask(task);


            }
            //console.log(taskList);
        });

    }


    //});




    /*
     var TaskInfo = Backbone.View.extend({
     el:"container";
     tagName: "li",
     className: "";
     events: {
     "click.button": function(){
     var description = some method(this.el)
     }
     }
     render: function(){
     this.el //root element
     this.$el
     }
     })
     */

    function openTask(task) {

        if (state.currentTask != task) {
            var el = document.body.querySelector('div.right-column1');
            //console.dir(el)
            if (el) {
                parent = el.parentNode;
                parent.removeChild(el);
            }
            var el = document.body.querySelector('button#btnOk');
            if (el) {
                parent = el.parentNode;
                parent.removeChild(el);
            }
            var el = document.body.querySelector('button#btnCancel');
            if (el) {
                parent = el.parentNode;
                parent.removeChild(el);
            }
            state.currentTask = task;

            renderEditor();
        }
    }

    function renderEditor(){
        var parent = document.body.querySelector('div.right-column');
        //console.dir(parent);
        var ed = document.createElement('div');
        ed.className = 'right-column1';
        parent.appendChild(ed);
        var name = document.createElement('input');
        name.setAttribute("maxlength","25");
        name.id = 'taskName';
        name.value = (state.currentTask)? state.currentTask.name : 'НАЗВА';
        name.style = "width:100%";
        var desc = document.createElement('textarea');
        desc.id = 'containerTask';
        desc.value = (state.currentTask) ? state.currentTask.desk : 'Додайте нотатку';
        ed.appendChild(name);
        ed.appendChild(desc);
        var bt = document.createElement('button');
        bt.innerHTML = "OK";
        bt.id = "btnOk";
        parent.appendChild(bt);
        bt.addEventListener("click",editTask);

        var bt1 = document.createElement('button');
        bt1.innerHTML = "Cancel";
        bt1.id = "btnCancel";
        parent.appendChild(bt1);
        bt1.addEventListener("click",cancelTask);

    }

    function editTask(){
        var textBox = document.getElementById("taskName");
        var container = document.getElementById("containerTask");
        if (state.currentTask === null || !state.currentTask.completed) {

            addTask(textBox.value, container.value);
        }
        else render()
        //state.currentTask.desk = null;
        //state.currentTask.name = null;
        state.currentTask = null
    }

    function cancelTask(){
        var el = document.body.querySelector('div.right-column1');
        //console.dir(el)
        if (el) {
            parent = el.parentNode;
            parent.removeChild(el);
        }
        var el = document.body.querySelector('button#btnOk');
        if (el) {
            parent = el.parentNode;
            parent.removeChild(el);
        }
        var el = document.body.querySelector('button#btnCancel');
        if (el) {
            parent = el.parentNode;
            parent.removeChild(el);
        }
        render()
        state.currentTask = null;
    }

    function addTask(taskName,description){
        var newTask = {};
        newTask.name = taskName;  //.slice(0,20);
        newTask.desk = description;
        var indexOfNewTask = state.taskList.indexOf(state.currentTask);
        // console.log(indexOfNewTask);
        // console.log(state.currentTask);
        // console.log(newTask);

        if (indexOfNewTask == -1) {
            state.taskList.push(newTask)
            save(newTask)
        }
        else{
            newTask.id = state.taskList[indexOfNewTask].id;
            state.taskList.splice(indexOfNewTask,1,newTask);

            editServer(newTask)
        }


        //console.log(description);
        //console.log(state.taskList)
        //render()

    }

    function removeTask(task){
        //console.log("REMOVE!");
        var indRemove = state.taskList.indexOf(task);
        state.taskList.splice(indRemove,1);
        //console.log(state.taskList)
        deleteServer(task.id);
        //render();
        state.currentTask = null;
    }

    function completeTask(task){
        var ind = state.taskList.indexOf(task);
        state.taskList[ind].completed = !state.taskList[ind].completed;
        //alert('OK!');
        render();
        state.currentTask = null;
    }

    function render() {
        /*      if (ajCount != 0){

         $('body').css('pointer-events', 'none');
         $('body').css('opacity', '0.4');
         $('.spinn').css('visibility', 'visible');
         }*/
        //document.body.innerHTML = "";
        list.innerHTML = "";
        //container.innerHTML = "";
        //console.log(state.taskList);
        state.taskList.forEach(function (task) {
            // console.log(task);
            var li = document.createElement('li');
            li.innerHTML = task.name;
            li.className = "task-list-item";
            //li.style = "cursor:pointer";
            li.model = task
            /*
             var arch = document.createElement('a');
             arch.setAttribute('href','#/' + task.id);
             arch.innerHTML = task.name;
             arch.className = "task-list-item";
             arch.model = task;
             li.appendChild(arch);
             */
            var chkel = document.createElement('input');
            chkel.type = "checkbox";
            chkel.className = "chkbox";
            if (task.completed) {
                chkel.setAttribute("checked","checked");
                li.style.textDecoration = "line-through";
                li.style.color = "silver";
            }
            li.insertBefore(chkel,li.firstChild);
            var removeBtn = document.createElement('img');
            removeBtn.setAttribute("src","http://individual.icons-land.com/IconsPreview/BaseSoftware/PNG/16x16/DeleteGrey.png");
            //removeBtn.setAttribute("alt","x");
            removeBtn.className = "remove";
            //removeBtn.style = "cursor: pointer";
            li.appendChild(removeBtn)
            list.appendChild(li)
        })

        var el = document.body.querySelector('div.right-column1');
        //console.dir(el)
        if (el) {
            parent = el.parentNode;
            parent.removeChild(el);
        }
        var el = document.body.querySelector('button#btnOk');
        if (el) {
            parent = el.parentNode;
            parent.removeChild(el);
        }
        var el = document.body.querySelector('button#btnCancel');
        if (el) {
            parent = el.parentNode;
            parent.removeChild(el);
        }

        //render current task
        /*
         if (state.currentTask){
         var currTask = document.createElement('textarea')
         currTask.innerHTML = state.currentTask.desk;
         currTask.style.height = "150px";
         container.appendChild(currTask);
         }
         */
        //state.currentTask = null;
        //      var stateJSON = JSON.stringify(state);
        //      localStorage.setItem("object",stateJSON);

        location.hash = "";
    }


    addButton.addEventListener("click",function(){
        var el = document.body.querySelector('div.right-column1');
        if (!el) renderEditor();
    })

    list.addEventListener("click",function(event) {
        if (event.target.className == "remove") {
            var li = event.target.parentNode
            removeTask(li.model)
        }
        if (event.target.className == "chkbox"){
            completeTask(event.target.parentNode.model);
        }
        if (event.target.className == "task-list-item") {
            var model = event.target.model
            //console.dir(event.target)
            var arr = document.querySelectorAll("li.task-list-item");

            for (var i = 0; i < arr.length; i++){
                arr[i].style.backgroundColor = "white";
                arr[i].style.fontWeight = 400;

            }
            event.target.style.backgroundColor = "lightcyan";
            event.target.style.fontWeight = 600;
            location.hash = "/" + model.id;
            //console.log(model)
            openTask(model)

        }
    })
    /*   container.addEventListener("click",function(event){
     if (event.target.tagName == "BUTTON"){
     var desc = container.querySelector('textarea').valueOf()
     updateCurrentTask()
     }
     })
     })
     */
    var ajCount = 0;
    $(document).ajaxStart(function() {
        ajCount++;
        //console.log('start');
        $('body').css('pointer-events','none');
        $('body').css('opacity','0.4');
        $('.spinn').css('visibility','visible');
    })
    $(document).ajaxComplete(function () {
        ajCount--;
        $('body').css('pointer-events','auto');
        $('.spinn').css('visibility','hidden');
        $('body').css('opacity','1.0');
    })

    /*  if (ajCount != 0){
     $('body').css('pointer-events','none');
     $('.spinn').css('visibility','visible');

     }*/

    fetch();
    //   $('body').css('pointer-events','none');
    //   $('.spinn').css('visibility','visible');



    //});
    //state.currentTask = null;
 /*   $(window).bind('hashchange', function() {
        //alert(window.location.hash);
        var hsh = + location.hash.substring(2);
        var task = state.taskList.filter(function(item){
            return item.id = hsh;
        })[0];
        openTask(task);

    });*/

/*
    window.onhashchange = function(){
        alert(window.location.hash);
        var hsh = + location.hash.substring(2);
        var task = state.taskList.filter(function(item){
            return item.id = hsh;
        })[0];
        openTask(task);
    }

*/
})

