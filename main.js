document.addEventListener("DOMContentLoaded", function() {
    const dropArea = document.querySelector(".drop-area");
    const image = document.querySelector(".image");
    const uploadButton = document.querySelector(".button__upload");
    const buttons = document.querySelectorAll(".button");
    const downloadButton = document.getElementById("button_download");
    const doneButton = document.querySelector("#button__done");

    dropArea.addEventListener("dragover", function(e) {
        e.preventDefault();
    });

    dropArea.addEventListener("drop", function(e) {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
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

                    // Draw the image on the canvas
                    ctx.drawImage(img, 0, 0);

                    // Get the pixels of the image
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const pixels = imageData.data;

                    // Iterate through the pixels and set non-transparent ones to white
                    for (let i = 0; i < pixels.length; i += 4) {
                        if (pixels[i + 3] > 0) {
                            pixels[i] = 255; // red component
                            pixels[i + 1] = 255; // green component
                            pixels[i + 2] = 255; // blue component
                        }
                    }

                    // Set the modified image in the img element
                    ctx.putImageData(imageData, 0, 0);
                    image.src = canvas.toDataURL("image/png");
                    image.classList.add("image--active");

                    // Toggle the class on the buttons
                    buttons.forEach(button => {
                        if (button === uploadButton) {
                            button.classList.remove("button--active");
                        } else {
                            button.classList.add("button--active");
                        }
                    });

                    // Add the click event to download the image
                    downloadButton.addEventListener("click", function() {
                        const downloadLink = document.createElement("a");
                        downloadLink.href = canvas.toDataURL("image/png");
                        downloadLink.download = "modified_image.png";
                        downloadLink.click();
                    });

                    // Add the click event to reset the application
                    doneButton.addEventListener("click", function() {
                        location.reload(); // Reload the page
                    });
                };
            };
            reader.readAsDataURL(file);
        } else {
            alert("Please drag a valid image.");
        }
    });
});
