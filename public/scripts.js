let data = {}

function showModal() {
  data = {
    title: $('#title').val(),
    image_url: `https://t.me/virtualroms/${$('#image_url').val()}`,
    file_url: `https://t.me/virtualroms/${$('#file_url').val()}`,
    console: $('input[name="consoles"]:checked').val(),
    genre: $('input[name="genres"]:checked').val(),
  }

  const res = `Título: ${data.title}<br/>
  URL da Imagem: ${data.image_url}<br/>
  URL do Arquivo: ${data.file_url}<br/>
  Console: ${data.console}<br/>
  Gênero: ${data.genre}<br/>`

  $('#data').html(res);

}

async function addGame() {

  if (!validateData(data)) {
    alert('Campos obrigatórios não preenchidos');
    document.location.reload();
    return;
  }

  $.post('https://us-central1-retrogames-be713.cloudfunctions.net/api/games', data, function(res) {
    if(res.id) {
      alert('Game cadastrado com sucesso!');
      document.location.reload();
    } else {
      alert('Erro ao cadastrar jogo, tente novamente!');
    }
  })

}


function validateData(data) {
  if (data.title === "" || data.image_url === "https://t.me/virtualroms/" || data.file_url === "https://t.me/virtualroms/" || !data.console || !data.genre) {
    return false;
  }

  return true;
}