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
  let editorIcon = $("<i>",{class:"fa fa-user"});
  let editorH3;
  let editorStrong;
  for (var i = 0; i < editors.length; i++)
  {
    editorContainer = $("<div>",{id:"editor-"+editors[i].UserApp.id});
    editorH3 =  $("<h3>",{});
    editorStrong = $("<strong>",{text:" @"+editors[i].username + " - " +editors[i].nombre});
    $(editorH3).append(editorIcon);
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
    title: "Agregar Editores",
    animation: 'top',
    closeAnimation: 'scale',
    type: 'dark',
    typeAnimated: true,
    content: '' + content,
    buttons: {
        formSubmit:
        {
            text: 'Ok',
            btnClass: 'btn-blue',
            action: function ()
            {
                var name = this.$content.find('.name').val();
                if(!name)
                {
                  $.alert({
                      title:"",
                      content: 'este campo no puede estar vacio :c',
                      type: 'red'
                    });
                    return false;
                }
                callback(name);
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
    let container = $("<div>",{});
    for (var i = 0; i < editors.length; i++)
    {
      $(container).append('<input type="checkbox" id="e-'+editors[i].id+'" value="'+editors[i].id+'"> <label for="e-'+editors[i].id+'">'+editors[i].username+'</label>')
    }
    return $(container).html();
}
