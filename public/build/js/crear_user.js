
function crear_user()
{

}

function add_user()
{

  if($("#add_user_name").val() == "" || $("#add_user_username").val() == "")
  {
    showToast('error','nombre o nombre de usuario no puede estar vacio :(');
    return null;
  }

  if($("#add_user_pass").val() == "" || $("#add_user_confirm_pass").val() == "")
  {
    showToast('error','Alguna contraseña esta vacia :(');
    return null;
  }


  if($("#add_user_pass").val() != $("#add_user_confirm_pass").val())
  {
    showToast('error','Las contraseñas son distintas :(');
    return null;
  }
  let dataToSend = {};
  dataToSend.nombre = $("#add_user_name").val();
  dataToSend.username = $("#add_user_username").val();
  dataToSend.password = $("#add_user_pass").val();
  $.ajax({
      type: 'POST',
      url: '/signup',
      data: JSON.stringify(dataToSend),
      contentType:'application/json',
      dataType: 'json',
      success: function (data)
      {
          if (data.success)
          {
            showToast('success','Usuario Agregado satisfactoriamente :D');
          }
          else
            showToast('error',data.error+" :(");

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
