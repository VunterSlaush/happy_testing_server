let userToEdit;
function edit_user(id)
{
  console.log("Edit user>"+id);
  findAllUsers(function (users)
  {
      for (var i = 0; i < users.length; i++)
      {

        if (users[i].id == id)
        {
            putUserData(users[i]);
            break;
        }
      }
  });
}

function putUserData(user)
{
  $("#perfil_name").val(user.nombre);
  $("#perfil_username").val(user.username);
  userToEdit = user;
}

function editUser()
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
  dataToSend.id = userToEdit.id;
  if($("#perfil_pass").val() != "")
    dataToSend.password = $("#perfil_pass").val();

    $.ajax({
        type: 'POST',
        url: '/user/updateAnother',
        data: JSON.stringify(dataToSend),
        contentType:'application/json',
        dataType: 'json',
        success: function (data)
        {
            if (data.success)
            {
              showToast('success','Datos Actualizados satisfactoriamente :D');
              window.location.href = "#users";
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
