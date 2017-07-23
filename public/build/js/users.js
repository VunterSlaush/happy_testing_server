var usersMainTable;
function users()
{
  $.ajax({
      type: 'GET',
      url: '/users',
      contentType:'application/json',
      dataType: 'json',
      success: function (data)
      {
        usersMainTable = crearUserTable(data.users,"#content");
      },
      failure: function (response, status) {

      },
      error: function ()
      {

      }
    });
}

function crearUserTable(apps, appendTo)
{
  model = ["id","Username","Nombre","Accion"];
  table = createTable(model);
  $(appendTo).append(table);
  table = initDataTable(table);
  addUsersToTable(table,apps);
  return table
}

function addUsersToTable(table, reports)
{
    for (var i = 0; i < reports.length; i++) {
      table.row.add([ reports[i].id, reports[i].username, reports[i].nombre, crearUsersButtons(reports[i].id)]).draw(false);
    }
}

function crearUsersButtons(id)
{
  let container = $("<div>",{style:"padding:3px;"});
  let seeButton = $("<a>",{onClick:"editarUser("+id+")", text:"Editar", style:" margin-right:5px;", class:"btn btn-primary"});
  let delButton = $("<a>",{onClick:"eliminarUser(this,"+id+")", text:"Eliminar", style:" margin-right:5px;", class:"btn btn-danger"});
  $(container).append(seeButton);
  $(container).append(delButton);
  return $(container).html();
}

function editarUser(id)
{
    //TODO
}

function eliminarUser(button,id)
{
  deleteRemoteRow('/users/delete',id,button,usersMainTable);
}
