var user;

$( document ).ready(function()
{
  user = JSON.parse(localStorage.getItem("user"));
  $(".user_name_here").text(user.nombre);
  $(window).on('hashchange', function() {
      loadContent();
  });
  loadContent();
});


function loadContent()
{
    var name = location.hash.slice(1) != null ? location.hash.slice(1) : "aplicaciones";
    var param;
    if(name.indexOf("/") != -1)
    {
      param = name.substring(name.indexOf("/")+1, name.length);
      name = name.substring(0,name.indexOf("/"));
    }

    $('#content').empty();
    $('#content').load('../production/'+name+".html?"+(new Date).getTime(),function()
    {
      callNameFunction(name,param);
    });
}

function callNameFunction(name,param)
{
  var fn = window[name];
  if(typeof fn === 'function')
        fn(param);
}

function logout()
{
  $.ajax({
      type: 'POST',
      url: '/logout',
      contentType:'application/json',
      dataType: 'json',
      success: function (data)
      {
          if (data.success)
          {
            localStorage.removeItem("user");
            location.reload();
          }
      }
    });
}
