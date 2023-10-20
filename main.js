document.addEventListener("DOMContentLoaded", function() {
    const dropArea = document.querySelector(".drop-area");
    const image = document.querySelector(".image");
    const uploadButton = document.querySelector(".button__upload");
    const buttons = document.querySelectorAll(".button");
    const downloadButton = document.getElementById("button_download");
    const doneButton = document.querySelector("#button__done");

    // Función para cargar una imagen desde un input de archivo
    function handleImageUpload(file) {
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const img = new Image();
                img.src = event.target.result;
                img.onload = function() {
                    const canvas = document.createElement("canvas");
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext("2d");

                    // Dibuja la imagen en el lienzo
                    ctx.drawImage(img, 0, 0);

                    // Obtén los píxeles de la imagen
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const pixels = imageData.data;

                    // Recorre los píxeles y establece los no transparentes a blanco
                    for (let i = 0; i < pixels.length; i += 4) {
                        if (pixels[i + 3] > 0) {
                            pixels[i] = 255; // componente roja
                            pixels[i + 1] = 255; // componente verde
                            pixels[i + 2] = 255; // componente azul
                        }
                    }

                    // Establece la imagen modificada en el elemento img
                    ctx.putImageData(imageData, 0, 0);
                    image.src = canvas.toDataURL("image/png");
                    image.classList.add("image--active");

                    // Alternar la clase en los botones
                    buttons.forEach(button => {
                        if (button === uploadButton) {
                            button.classList.remove("button--active");
                        } else {
                            button.classList.add("button--active");
                        }
                    });

                    // Agregar el evento de clic para descargar la imagen
                    downloadButton.addEventListener("click", function() {
                        const downloadLink = document.createElement("a");
                        downloadLink.href = canvas.toDataURL("image/png");
                        downloadLink.download = "modified_image.png";
                        downloadLink.click();
                    });

                    // Agregar el evento de clic para reiniciar la aplicación
                    doneButton.addEventListener("click", function() {
                        location.reload(); // Recarga la página
                    });
                };
            };
            reader.readAsDataURL(file);
        } else {
            alert("Por favor, selecciona un archivo de imagen válido.");
        }
    }

    // Agregar evento de clic para el botón de carga
    uploadButton.addEventListener("click", function() {
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = "image/png"; // Solo permite archivos PNG
        fileInput.addEventListener("change", function() {
            const file = fileInput.files[0];
            handleImageUpload(file);
        });
        fileInput.click();
    });
});
