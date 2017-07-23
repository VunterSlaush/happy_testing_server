
function perfil()
{
  $("#perfil_name").val(user.nombre);
  $("#perfil_username").val(user.username);
}


function actualizarPerfil()
{
  if($("#perfil_name").val() == "" || $("#perfil_username").val() == "")
  {
    showToast('error','nombre o nombre de usuario no puede estar vacio :(');
    return null;
  }
  if($("#perfil_pass").val() != $("#perfil_confirm_pass").val())
  {
    showToast('error','Las contraseñas son distintas :(');
    return null;
  }


  let dataToSend = {};
  dataToSend.username = $("#perfil_username").val();
  dataToSend.name = $("#perfil_name").val();
  dataToSend.nombre = $("#perfil_name").val();
  if($("#perfil_pass").val() != "")
    dataToSend.password = $("#perfil_pass").val();

  $.ajax({
      type: 'POST',
      url: '/user/update',
      data: JSON.stringify(dataToSend),
      contentType:'application/json',
      dataType: 'json',
      success: function (data)
      {
          if (data.success)
          {
            user = dataToSend;
            localStorage.setItem("user", JSON.stringify(dataToSend));
            $(".user_name_here").text(dataToSend.nombre);
            showToast('success','Datos Actualizados satisfactoriamente :D');
          }
          else
            showToast('error',"Error inesperado :(");

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
