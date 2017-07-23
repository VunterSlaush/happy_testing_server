function crear_app()
{
  init_select2();
}


function init_select2()
{
    $("#users_app").select2({
    ajax: {
      url: "/users",
      dataType: 'json',
      delay: 250,
      data: function (params) {
        return {
          q: params.term, // search term
          page: params.page
        };
      },
      processResults: function (data, params)
      {
        console.log("params",params);

          return {
            results: userMatch(data.users,params.term),
            pagination:
            {
              more: (params.page * 30) < data.total_count
            }
          };
        },
        cache: true
    },
    escapeMarkup: function (markup) { return markup; }, // let our custom formatter work
    minimumInputLength: 1,
    templateResult: formatUser, // omitted for brevity, see the source of this page
    templateSelection: formatUserSelection // omitted for brevity, see the source of this page
  });
}

function formatUser (user)
{
  if (user.loading) return user.text;

  let h3 = $("<h1>",{text:user.nombre});
  let a  = $("<a>",{text:"@"+user.username, style:"color:#1fbbe0;"});
  $(h3).append("</br>");
  $(h3).append(a);
  return $(h3).html();
}

function formatUserSelection (user)
{
    return user.id;
}

function userMatch(users,term)
{
    let matches = [];
    for (var i = 0; i < users.length; i++)
    {
      try {
        if(users[i].nombre.toLowerCase().indexOf(term.toLowerCase()) != -1 ||
           users[i].username.toLowerCase().indexOf(term.toLowerCase()) != -1)
           matches.push(users[i]);
      } catch (e) {

      }

    }
    return matches;
}


function add_app()
{
  if($("#add_app_name").val() == "")
  {
    showToast('error','el nomre de la aplicacion no puede estar vacio :(');
    return;
  }
  let dataToSend = {};
  dataToSend.nombre = $("#add_app_name").val();
  dataToSend.users = $("#users_app").val();
  console.log("create app",dataToSend);

  $.ajax({
      type: 'POST',
      url: '/apps/create',
      data: JSON.stringify(dataToSend),
      contentType:'application/json',
      dataType: 'json',
      success: function (data)
      {
          if (data.success)
          {
            $("#add_app_name").val("");
            $("#users_app").empty();
            showToast('success','Aplicacion creada Satisfactoriamente :D');
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
}
