document.querySelectorAll('#btnSend').forEach((button) => {
  button.addEventListener('click', () => {
    const value = button.value;

    addProductToCart(value);
  });
});

const addProductToCart = (value) => {
  req.logger.info(value);

  fetch(`/api/${value}`, {
    method: 'POST',

    headers: {
      'Content-Type': 'application/json',
    },
  }).then((response) => {
    if (response.status === 200) {
      response
        .json()
        .then(
          (r) => (document.querySelector('#LengthCart').innerText = r.length)
        );

      alert('Se agrego correctamente');
    } else {
      alert('No se agrego');
    }
  });
};

function agregarAlerta(txt) {
  alert(`¡${txt}!`);
}
