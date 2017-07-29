var App;

function aplicacion(id)
{
  $.ajax({
      type: 'GET',
      url: '/apps/'+id,
      contentType:'application/json',
      dataType: 'json',
      success: function (data)
      {
        if (data.success)
          fillAppUI(data.app);
        else
          showToast('error',data.error);
      },
      failure: function (response, status) {
        showToast('error',"Error inesperado :(");
      },
      error: function ()
      {
        showToast('error',"Error inesperado :(");
      }
    });
}


function fillAppUI(app)
{
  App = app;
  $("#app_name").text(app.nombre);
  $("#app_user").text("@"+app.User.username+" - " + app.User.nombre);
  $("#add_editor_button").attr("onclick","add_editor("+app.id+")");
  $("#delete_app_button").attr("onclick","delete_app("+app.id+")");
  $("#add_report_button").attr("onclick","add_report("+app.id+")");


  for (var i = 0; i < app.Reports.length; i++) {
    app.Reports[i].App = {};
    app.Reports[i].App.nombre = app.nombre;
  }

  reportsMainTable = crearReportTable(app.Reports,"#reports_container",3);
  fillEditors(app.canEditMe);
}

function fillEditors(editors)
{
  let editorContainer;
  let editorH3;
  let editorStrong;
  for (var i = 0; i < editors.length; i++)
  {
    editorContainer = $("<div>",{id:"editor-"+editors[i].UserApp.id});
    editorH3 =  $("<h3>",{});
    editorStrong = $("<strong>",{text:" @"+editors[i].username + " - " +editors[i].nombre});
    $(editorH3).append($("<i>",{class:"fa fa-user"}));
    $(editorH3).append(editorStrong);
    $(editorContainer).append(editorH3);
    $("#users_container").append(editorContainer);
  }
}

function add_editor(app_id)
{
  findAllUsers(function (users)
  {
    showEditorsDialog(users);
  });
}

function add_report(app_id)
{
  simpleInputDialog("Nombre del reporte", function (name)
  {
    crearReporte(name,app_id,user.id);
  });
}

function crearReporte(nombre,aplicacion,owner)
{
    let dataToSend = {};
    dataToSend.nombre = nombre;
    dataToSend.aplicacion = aplicacion;
    dataToSend.owner = owner;
    $.ajax({
        type: 'POST',
        url: '/reportes/create',
        data: JSON.stringify(dataToSend),
        contentType:'application/json',
        dataType: 'json',
        success: function (data)
        {
            if (data.success)
            {
              showToast("success","reporte creado satisfactoriamente");
              window.location.href = "#reporte/"+data.res.id;
            }
            else
              showToast('error',data.error);
        },
        failure: function (response, status) {
           // failure code here
           showToast('error',"Error inesperado :(");

        },
        error: function ()
        {
          showToast('error',"Error inesperado :(");
        }
      });
}

function delete_app(app_id)
{
  showConfirmDialog("¿Esta Seguro de eliminar esta aplicacion?", function ()
  {
    deleteSomething('/apps/delete',app_id, function ()
    {
      showToast('success',"Aplicacion eliminada satisfactoriamente :D");
      window.location.href = "#aplicaciones";
    });
  });
}


function showEditorsDialog(editors)
{
  let content = generateEditorsContent(editors);
  $.confirm({
    title: "<h3><i class='fa fa-users'></i> Agregar Editores</h3>",
    animation: 'top',
    closeAnimation: 'scale',
    type: 'dark',
    typeAnimated: true,
    content: content,
    buttons: {
        formSubmit:
        {
            text: 'Ok',
            btnClass: 'btn-blue',
            action: function ()
            {
              let checks = $(".editor_check");
              let editors = [];
              for (var i = 0; i < checks.length; i++) {
                if($(checks[i]).is(':checked'))
                  editors.push($(checks[i]).val());
              }
              updateEditors(App.id,editors);
            }
        },
        cancel: function () {
            //close
        },
    },
    onContentReady: function () {
        // bind to events
        var jc = this;
        this.$content.find('form').on('submit', function (e) {
            // if the user submits the form by pressing enter in the field.
            e.preventDefault();
            jc.$$formSubmit.trigger('click'); // reference the button and click it
        });
    }
  });
}

function generateEditorsContent(editors)
{
    let container = $("<div>",{style:"height:20vh; overflow-y:true;", id:'editorsCheckContainer'});

    let container2 = $("<div>",{style:"height:20vh; overflow-y:auto;", id:'editorsCheckContainer'});
    $(container).append(container2);
    for (var i = 0; i < editors.length; i++)
    {
      if(appContainsEditor(editors[i]))
        $(container2).append('<input  class="editor_check" type="checkbox" id="e-'+editors[i].id+'" value="'+editors[i].id+'" checked> <label for="e-'+editors[i].id+'"><i class="fa fa-user"></i> @'+editors[i].username+' - '+editors[i].nombre+'</label>');
      else
        $(container2).append('<input  class="editor_check" type="checkbox" id="e-'+editors[i].id+'" value="'+editors[i].id+'"> <label for="e-'+editors[i].id+'"><i class="fa fa-user"></i> @'+editors[i].username+' - '+editors[i].nombre+'</label>');
      $(container2).append("</br>")
    }
    return $(container).html();
}

function appContainsEditor(editor)
{
    for (var i = 0; i < App.canEditMe.length; i++) {
      if(App.canEditMe[i].id == editor.id)
        return true;
    }
    return false;
}

function updateEditors(aplicacion, users)
{
  let dataToSend = {};
  dataToSend.users = users;
  dataToSend.id = aplicacion;
  $.ajax({
      type: 'POST',
      url: '/apps/update',
      data: JSON.stringify(dataToSend),
      contentType:'application/json',
      dataType: 'json',
      success: function (data)
      {
          if (data.success)
          {
            showToast("success","Editores actualizados satisfactoriamente");
            loadContent();
          }
          else
            showToast('error',data.error);
      },
      failure: function (response, status) {
         // failure code here
         showToast('error',"Error inesperado :(");

      },
      error: function ()
      {
        showToast('error',"Error inesperado :(");
      }
    });
}
