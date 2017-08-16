var slider;
var imageDrop;
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
    initDropZone();

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
  fillObservations(report.Observations);
  slider = $('.bxslider').bxSlider();

  showToast("info","Para agregar imagenes a una observacion simplemente arrojelas sobre la misma ;)");
}

function fillObservations(observations)
{
    for (var i = 0; i < observations.length; i++)
      putObservationOnUI(observations[i]);

}

function putObservationOnUI(observation)
{
    let container = $("<li>",{id:"ob-"+observation.id, class:"dragdrop"});

    let xIcon = $("<i>",{class:"fa fa-times"});
    let btnDelete = $("<a>",{onclick:"deleteObservation("+observation.id+"); return;", style:"font-size:3rem; margin-right:-3vw;", class:"col-md-1"});
    $(btnDelete).append(xIcon);
    $(container).append(btnDelete);
    let text = generateText(observation.texto);
    $(container).append(text);
    let images = generateImages(observation.images);
    $(container).append(images);
    $("#bx_container").append(container);
}

function generateText(text)
{
  let container  = $("<div>");
  let p;
  let pivote = 120;
  let b = 0;
  while (pivote <= text.length)
  {
    $(container).append($("<p>",{text:text.substring(b,pivote), style:"font-style: italic; margin-top:0; padding-top:0; margin-bottom:0; padding-bottom:0;", class:"col-md-12"}));
    b = pivote;
    pivote += 120;
  }
  $(container).append($("<p>",{text:text.substring(b,text.length), style:"font-style: italic; margin-top:0; padding-top:0; margin-bottom:0; padding-bottom:0;", class:"col-md-12"}));
  return container;
}

function generateImages(images)
{
  let container = $("<div>",{class:"row"});
  let divCol, thumb, imgView, img, mask, tools, click,click2, icon, icon2;
  for (var i = 0; i < images.length; i++)
  {
    divCol = $("<div>", {class:"col-md-2", id:"img-"+images[i].id});
    thumb = $("<div>",{class:"thumbnail"});
    imgView = $("<div>",{class:"image view view-first"});
    img = $("<img>",{style:"width: 100%; display: block;", src:images[i].direccion, alt:"image"});
    mask = $("<div>",{class:"mask"});
    tools = $("<div>",{class:"tools tools-bottom"});
    click = $("<a>", {onclick:"removeImage("+images[i].id+")"});
    icon = $("<i>",{class:"fa fa-times"});
    click2 = $("<a>", {onclick:"viewImage('"+images[i].direccion+"'); return;"});
    icon2 = $("<i>",{class:"fa fa-eye"});
    $(click2).append(icon2);
    $(tools).append(click2);
    $(click).append(icon);
    $(tools).append(click);
    $(mask).append(tools);
    $(imgView).append(img);
    $(imgView).append(mask);
    $(thumb).append(imgView);
    $(divCol).append(thumb);
    $(container).append(divCol);
  }
  return container;
}

function add_observation(id)
{
  let dataToSend = {};
  dataToSend.reporte = id;

  simpleInputDialog("Agrega tu observacion :D", function (text)
  {
    dataToSend.texto = text;
    $.ajax({
        type: 'POST',
        url: '/observations/create',
        contentType:'application/json',
        dataType: 'json',
        data: JSON.stringify(dataToSend),
        success: function (data)
        {
          if (data.success)
          {
            data.res.images = [];
            putObservationOnUI(data.res);
            slider.reloadSlider();
            $(".bx-pager-link").last().click();
          }
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
  });
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

function initDropZone()
{
  imageDrop = new Dropzone("#observations_container",{ url: "/images/create"});
  imageDrop.options.autoProcessQueue = false;
  imageDrop.options.uploadMultiple = true;
  imageDrop.options.withCredentials = true;
  imageDrop.options.clickable = false;

  imageDrop.options.accept = function(file, done) {
      if (file.name.toLowerCase().indexOf(".jpg") != -1 ||
          file.name.toLowerCase().indexOf(".jpeg") != -1 ||
          file.name.toLowerCase().indexOf(".png") != -1 )
      {
        done();
      }
      else
      {
        showToast("error",file.name+" no es un archivo permitido :c");
      }
  }
  imageDrop.on("drop", function()
  {
    $(".bx-wrapper").removeClass("state-over");
    setTimeout(function ()
    {
      onFilesDroped(imageDrop.files);

    }, 500);
  });
  imageDrop.on("dragover", function () {
       $(".bx-wrapper").addClass("state-over");
  });
  imageDrop.on("dragleave", function ()
  {

     $(".bx-wrapper").removeClass("state-over");
  });
  imageDrop.on("success", function (file,res)
  {
    showToast("success", file.name+" se subio satisfactoriamente :D");
    addImagesToObservation(res.res);
  });

  imageDrop.on("error", function (file,res)
  {
      showToast("error", file.name+" no pudo subirse :(");
  });
  $("#observations_container").removeClass("dz-clickable");

  $(".dz-hidden-input").prop("disabled",true);
}

function onFilesDroped(files)
{
  let observationId = findActualObservation();
  images = [];
  for (var i = 0; i < files.length; i++) {
    files[i].observation = observationId;
    images.push({observacion:observationId, name:files[i].name});
  }
  imageDrop.options.params.images = JSON.stringify(images);
  observationId = observationId.replace("ob-","");
  imageDrop.options.params.observacion = observationId;
  imageDrop.processQueue();
}

function findActualObservation()
{
  let dropers = $(".dragdrop");
  for (var i = 0; i < dropers.length; i++) {
    if($(dropers[i]).attr("aria-hidden") == "false")
    {
        return $(dropers[i]).attr("id");
    }
  }
  return "";
}

function triggerClickDropZone() {
  console.log("HMMM ..");
  $(".dz-hidden-input").prop("disabled",false);
  imageDrop.hiddenFileInput.click();
  console.log("HMMM ..  2");
  setTimeout(function ()
  {
    onFilesDroped(imageDrop.files);
    $(".dz-hidden-input").prop("disabled",true);
    console.log("HMMM .. 3");
  }, 100);
}

function addImagesToObservation(images) //TODO posible refactor
{

  let obId = images[0].observacion;
  divCol = $("<div>", {class:"col-md-2", id:"img-"+images[0].id});
  thumb = $("<div>",{class:"thumbnail"});
  imgView = $("<div>",{class:"image view view-first"});
  img = $("<img>",{style:"width: 100%; display: block;", src:images[0].direccion, alt:"image"});
  mask = $("<div>",{class:"mask"});
  tools = $("<div>",{class:"tools tools-bottom"});
  click = $("<a>", {onclick:"removeImage("+images[0].id+"); return;"});
  icon = $("<i>",{class:"fa fa-times"});
  click2 = $("<a>", { onclick:"viewImage('"+images[0].direccion+"'); return;"});
  icon2 = $("<i>",{class:"fa fa-eye"});
  $(click2).append(icon2);
  $(tools).append(click2);
  $(click).append(icon);
  $(tools).append(click);
  $(mask).append(tools);
  $(imgView).append(img);
  $(imgView).append(mask);
  $(thumb).append(imgView);
  $(divCol).append(thumb);
  $("#ob-"+obId+" div.row").append(divCol);
  slider.reloadSlider();
}

function removeImage(id)
{
  showConfirmDialog("¿Esta seguro de borrar esta imagen?", function ()
  {
    let dataToSend = {};
    dataToSend.observacion = findActualObservation().replace("ob-","");;
    dataToSend.images = [id];
    $.ajax({
        type: 'POST',
        url: '/images/delete',
        contentType:'application/json',
        data:JSON.stringify(dataToSend),
        dataType: 'json',
        success: function (data)
        {
          if (data.success)
          {
            $("#img-"+id).remove();
            $("#img-"+id).remove();
          }
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
  });


}

function viewImage(image)
{
  $('#imagepreview').attr('src', image);
  $('#imagemodal').modal('show');
}

function deleteObservation(id)
{
  showConfirmDialog("¿Esta seguro de eliminar esta observacion?", function ()
  {
    deleteSomething("/observations/delete",id,function ()
    {
      let ob = findActualObservation()
      $("#"+ob).remove();
      slider.reloadSlider();
      showToast("success", "observacion eliminada satisfactoriamente :D");
    });
  });
}
