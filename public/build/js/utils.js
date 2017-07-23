
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
