
function createTable(model)
{


  let table = $("<table>", {class: " table table-striped jambo_table"});
  let head =  $(document.createElement('thead'));
  let tr =  $("<tr>",{ class:"headings"});
  for (var i = 0; i < model.length; i++) {
    $(tr).append($("<th>",{ text:model[i], style:"display: table-cell;", class:"column-title" }));
  }
  $(head).append(tr);
  $(table).append(head);
  return table;
}


function initDataTable(table, page)
{
  return $(table).DataTable({
    "pageLength": page,
    "bLengthChange": false,
    "language": {
    	"sProcessing":     "Procesando...",
    	"sLengthMenu":     "Mostrar _MENU_ registros",
    	"sZeroRecords":    "No se encontraron resultados :(",
    	"sEmptyTable":     "Ningun dato disponible en esta tabla :(",
    	"sInfo":           "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
    	"sInfoEmpty":      "Mostrando registros del 0 al 0 de un total de 0 registros",
    	"sInfoFiltered":   "(filtrado de un total de _MAX_ registros)",
    	"sInfoPostFix":    "",
    	"sSearch":         "Buscar:",
    	"sUrl":            "",
    	"sInfoThousands":  ",",
    	"sLoadingRecords": "Cargando...",
    	"oPaginate": {
    		"sFirst":    "Primero",
    		"sLast":     "Ultimo",
    		"sNext":     "Siguiente",
    		"sPrevious": "Anterior"
    	},
    	"oAria": {
    		"sSortAscending":  ": Activar para ordenar la columna de manera ascendente",
    		"sSortDescending": ": Activar para ordenar la columna de manera descendente"
    	}
    }
  });
}


function showToast(type,text) {
  new PNotify({title: text,
               text: '',
               type: type,
               styling: 'bootstrap3'
               });
}

function showConfirmDialog(text, onConfirmCallback)
{
  $.confirm({
    title: 'Confirmar',
    content: text,
    animation: 'top',
    closeAnimation: 'scale',
    type: 'dark',
    typeAnimated: true,
    buttons: {
        si: onConfirmCallback,
        no: function () {

        }
    }
});
}


function deleteRemoteRow(route,id,button,table)
{
  showConfirmDialog("¿esta seguro de eliminar?", function ()
  {
    deleteSomething(route,id, function ()
    {
      showToast('success','Eliminacion satisfactoria :D');
      table.row($(button).parents('tr'))
                  .remove()
                  .draw();
    });
  });
}

function deleteSomething(route,id, successCallback)
{
  let dataToSend = {};
  dataToSend.id = id;
  $.ajax({
      type: 'POST',
      url: route,
      data: JSON.stringify(dataToSend),
      contentType:'application/json',
      dataType: 'json',
      success: function (data)
      {
          if (data.success)
          {
            successCallback();
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

function simpleInputDialog(title,callback)
{
  $.confirm({
    title: title,
    animation: 'top',
    closeAnimation: 'scale',
    type: 'dark',
    typeAnimated: true,
    content: '' +
    '<form action="" class="formName">' +
    '<div class="form-group">' +
    '<input type="text" class="name form-control" required />' +
    '</div>' +
    '</form>',
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


function findAllUsers(callback)
{
  $.ajax({
      type: 'GET',
      url: '/users',
      contentType:'application/json',
      dataType: 'json',
      success: function (data)
      {
        if(data.success)
          callback(data.users);
        else
          showToast("error",data.error);
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

function formatDate(dateString)
{
  var todayTime = new Date(dateString);
  var month;
  var day;

  if(todayTime .getMonth() + 1 < 10)
    month = "0"+(todayTime .getMonth() + 1);
  else
    month = ""+(todayTime .getMonth() + 1);

  if(todayTime.getDate() < 10)
    day = "0"+todayTime .getDate();
  else
    day = ""+todayTime .getDate();


  var year = todayTime .getFullYear();
  return day + "/" + month + "/" + year;
}
