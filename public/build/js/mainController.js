var user;
var apps;

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
    $('#content').empty();
    $('#content').load('../production/'+name+".html?"+(new Date).getTime(),function()
    {
      callNameFunction(name);
    });
}

function callNameFunction(name)
{
  var fn = window[name];
  if(typeof fn === 'function')
        fn();
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
