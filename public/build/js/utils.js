
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


function initDataTable(table, data)
{
  return $(table).DataTable( {

    } );
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
              showToast('success','Eliminacion satisfactoria :D');
              table.row($(button).parents('tr'))
                          .remove()
                          .draw();
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
  });
}
