/* variables que traen el contenido html */
const dropArea = document.querySelector(".drop-area");
const dragText = dropArea.querySelector(".drag-text");
const input = dropArea.querySelector("#input-file");
const buttonForUploadFile = document.querySelector("#uploadFile");
const selectedOption = document.querySelector("#select-quality")
const maxTimeButtonDownload = 600000
let files;
let fileUploaded;
let resolution;

// DOMContentLoaded es el evento que se ejecuta cuando TODO el HTML, CSS y JAVASCRIPT fue cargado en el DOM
document.addEventListener("DOMContentLoaded", (event) => {
  // si la variable fileUploaded NO tiene valor, dale el atributo "disabled" al boton que envia la peticion con el archivo
  if (!fileUploaded) {
    buttonForUploadFile.setAttribute('disabled', 'disabled');
  }
})

/* inicia el evento de tipo click y manda a llamar el input-file */
dropArea.addEventListener("click", (event) => {
  input.click();
});

/* En este evento de tipo change alojas el valor que venga como resultado de la selccion de la resolucion de la imagen en la variable resolution */
selectedOption.addEventListener('change',
  function(){
    resolution = this.options[selectedOption.selectedIndex].value;
    //console.log(resolution);
  });

buttonForUploadFile.addEventListener("click", (event) => {
  // Validando si la variable fileUploaded tiene valor, subes el archivo que está guardado en dicha variable
  if (!resolution){
    alert("Debe seleccionar una resolución para optimizar la imagen")
  }
  if (fileUploaded && resolution) {
  buttonForUploadFile.textContent = "Subiendo..."
    
    buttonForUploadFile.setAttribute('disabled', 'disabled')
    uploadFile(fileUploaded, resolution)
  }})


/* inicia el evento de tipo change en mi area de arrastar para que cada vez que el valor se identifique los archivos que 
estan cambiando y asi subirlos aun servido */
input.addEventListener("change", (event) => {
  files = event.target.files[0];
  //console.log(files);
  dropArea.classList.add("active");
  showFiles(files);
  dropArea.classList.remove("active");
});

/* aqui se valida si el elemento que llega por parametro en la funcion en uno o varios elemntos  */

function showFiles(file) {
     processFile(file);
}

/* valida que los elemntos traidos por paramatros en la varible files sean correctos e 
   inicia el evento load en donde se van a mostrar los elementos selecionados en pantalla */
function processFile(file) {
  const docType = file.type;

  const validExtensions = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/svgo",
    "image/webp",
    "image/gif",
  ];

  if (validExtensions.includes(docType)) {
    const image = `
            <div class="file-container">
              <div class="status">
              <p>Archivo cargado:</p>
                <span>${file.name}<span/>
              <div/>
            <div/>
            `;
    // const html = document.querySelector("#preview").innerHTML;
    document.querySelector("#preview").innerHTML = image;

    // Guardo el archivo en una variable para mantener el archivo en memoria hasta que el usuario presione el botón con id "uploadFile"
    fileUploaded = file;

    // Una vez cargado el archivo en memoria, remueve el atributo disabled del botón para permitir que el usuario le de click y envie la peticion con el archivo
    buttonForUploadFile.removeAttribute('disabled');
    // uploadFile(file);
  } else {
    alert("El archivo ingresado no tiene un formato valido");
  }
}

/* aqui vamos a mandar la solicitud a nuestro servidor para subir el archivo */
async function uploadFile(file, resolution) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("resolution", resolution);

  try {
    const response = await fetch("/", {
      method: "POST",
      body: formData,
    });

    const responseText = await response.json();

    if(responseText.status && responseText.status === 400){
      throw responseText.errorMessage 
    }

    const imgRoute = `${window.location.origin}/${responseText.optimizedImagePath}`;
    
    //en la variable imgName se esta seleccionando el nombre que tendra la imagen al momento de descargarse
    const imgName = responseText.optimizedImagePath.split("/")[1];

    const img = `<a class="dowloadFile" id="dowloadFile" href="${imgRoute}" target="_blank" download="${imgName}">Descargar Imagen <img src="/download.png"></a>`,
    backHome = `<a class="back-home" id="back-home" href="/"><img src="/home.png"> volver atrás</a>`;
    document.querySelector("#view").innerHTML = img;
    document.querySelector("#back-home").innerHTML = backHome;
    document.querySelector("#preview").remove();
    document.querySelector("#content-quality").remove()
    document.querySelector(".drop-area").remove()
    document.querySelector("#uploadFile").remove()



    setTimeout(() => {
      document.querySelector("#view").remove();
    },maxTimeButtonDownload);
    
  } catch (error) {
    alert(error);
    //console.log(error);
  }
}

