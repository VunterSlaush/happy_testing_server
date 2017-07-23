
function aplicaciones()
{
  $.ajax({
      type: 'GET',
      url: '/user/apps',
      contentType:'application/json',
      dataType: 'json',
      success: function (data)
      {
        console.log(data.apps);
        crearAppsTable(data.apps,"#content");
      },
      failure: function (response, status) {

      },
      error: function ()
      {

      }
    });
}

function crearAppsTable(apps, appendTo)
{
  model = ["Creada","id","Nombre","Accion"];
  table = createTable(model);
  $(appendTo).append(table);
  table = initDataTable(table);
  addAppsToTable(table,apps);
  return table
}

function addAppsToTable(table, apps)
{
    for (var i = 0; i < apps.length; i++) {
      table.row.add([apps[i].createdAt, apps[i].id, apps[i].nombre, crearAppButtons(apps[i].id)]).draw(false);
    }
}

function crearAppButtons(id)
{
  let container = $("<div>",{style:"padding:3px;"});
  let seeButton = $("<a>",{onClick:"verApp("+id+")", text:"Ver", style:" margin-right:5px;", class:"btn btn-primary"});
  let delButton = $("<a>",{onClick:"eliminarApp("+id+")", text:"Eliminar", style:" margin-right:5px;", class:"btn btn-danger"});
  $(container).append(seeButton);
  $(container).append(delButton);
  return $(container).html();
}

function verApp(id)
{
    //TODO
}

function eliminarApp(id)
{
  //TODO
}
