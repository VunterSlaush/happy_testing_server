var usersMainTable;
function users()
{
  findAllUsers(function (users)
  {
      usersMainTable = crearUserTable(users,"#content");
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
  let seeButton = $("<a>",{href:"#edit_user/"+id, text:"Editar", style:" margin-right:5px;", class:"btn btn-primary"});
  let delButton = $("<a>",{onClick:"eliminarUser(this,"+id+")", text:"Eliminar", style:" margin-right:5px;", class:"btn btn-danger"});
  $(container).append(seeButton);
  $(container).append(delButton);
  return $(container).html();
}



function eliminarUser(button,id)
{
  deleteRemoteRow('/users/delete',id,button,usersMainTable);
}
