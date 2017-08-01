function reporte(id)
{
  $.ajax({
      type: 'GET',
      url: '/reportes/'+id,
      contentType:'application/json',
      dataType: 'json',
      success: function (data)
      {
        if (data.success)
          fillReportUI(data.report);
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

function fillReportUI(report)
{
  console.log(report);
  $("#reporte_name").text(report.nombre);
  $("#reporte_user").text("@"+report.User.username+" - "+report.User.nombre);
  $("#reporte_app").text(report.App.nombre);

  $("#add_observation_button").attr("onclick","add_observation("+report.id+")");
  $("#publish_report").attr("onclick","publish("+report.id+")");
  $("#delete_reporte_button").attr("onclick","delete_report("+report.id+")");
}

function add_observation(id)
{
  //TODO
}

function publish(id)
{
  let dataToSend = {};
  dataToSend.reporte = id;
  $.ajax({
      type: 'POST',
      url: '/reportes/publicar',
      contentType:'application/json',
      dataType: 'json',
      data: JSON.stringify(dataToSend),
      success: function (data)
      {
        if (data.success)
          showDialogToLink(data.link);
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

function showDialogToLink(link)
{
  $.confirm({
    title: 'El Reporte se publico satisfactoriamente :D, ¿deseas visualizarlo?',
    content: "",
    animation: 'top',
    closeAnimation: 'scale',
    type: 'dark',
    typeAnimated: true,
    buttons: {
        si: function ()
        {
            window.open(link, 'Ver Reporte', '');
            //location.href = link;
        },
        no: function () {

        }
    }
});
}


function delete_report(id)
{
  showConfirmDialog("¿Esta Seguro de eliminar esta Reporte?", function ()
  {
    deleteSomething('/reportes/delete',id, function ()
    {
      showToast('success',"Reporte eliminada satisfactoriamente :D");
      window.location.href = "#reportes";
    });
  });
}
