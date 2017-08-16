var reportsMainTable;
function reportes()
{
  $.ajax({
      type: 'GET',
      url: '/user/reports',
      contentType:'application/json',
      dataType: 'json',
      success: function (data)
      {
        console.log(data.reports);
        reportsMainTable = crearReportTable(data.reports,"#content");
      },
      failure: function (response, status) {

      },
      error: function ()
      {

      }
    });
}

function crearReportTable(apps, appendTo,pages)
{
  model = ["Creado","id","Aplicacion","Nombre","Accion"];
  table = createTable(model);
  $(appendTo).append(table);
  table = initDataTable(table,3);
  addReportsToTable(table,apps);
  return table
}

function addReportsToTable(table, reports)
{
    for (var i = 0; i < reports.length; i++) {
      table.row.add([formatDate(reports[i].createdAt), reports[i].id,reports[i].App.nombre, reports[i].nombre, crearReportsButtons(reports[i].id)]).draw(false);
    }
}

function crearReportsButtons(id)
{
  let container = $("<div>",{style:"padding:3px;"});
  let seeButton = $("<a>",{href:"#reporte/"+id, text:"Ver", style:" margin-right:5px;", class:"btn btn-primary"});
  let delButton = $("<a>",{onClick:"eliminarReport(this,"+id+")", text:"Eliminar", style:" margin-right:5px;", class:"btn btn-danger"});
  $(container).append(seeButton);
  $(container).append(delButton);
  return $(container).html();
}

function eliminarReport(button,id)
{
  deleteRemoteRow('/reportes/delete',id,button,reportsMainTable);
}
