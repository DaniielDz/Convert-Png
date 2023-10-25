const sections = document.querySelectorAll('.section');
const image = document.querySelectorAll('.image');
const text = document.querySelectorAll('.section__text');

sections.forEach( (dropArea, index) => {
    dropArea.addEventListener("dragover", function(e) {
        e.preventDefault();
        dropArea.classList.add('section--drag');
        text[index].classList.add('text--drag');
    });
    dropArea.addEventListener('dragleave', () => {
        dropArea.classList.remove('section--drag');
        text[index].classList.remove('text--drag');
    });
    dropArea.addEventListener("drop", function(e) {
        e.preventDefault();
        dropArea.classList.remove('section--drag');
        text[index].classList.remove('text--drag');
        const file = e.dataTransfer.files[0];
        uploadImage(file, index);
    });
});

function uploadImage(file , index) {
    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.src = event.target.result;
        img.onload = function() {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");

            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const pixels = imageData.data;
            if(index === 0) {
                removeWhite( pixels )
            }
            else if(index === 1) {
                convertWhite( pixels )
            }
            else if(index === 2) {
                removeWhite( pixels )
                convertWhite( pixels )
            }

            ctx.putImageData(imageData, 0, 0);
            image[index].src = canvas.toDataURL("image/png");
        }
    }
    reader.readAsDataURL(file)
}

function removeWhite( pixels ) {


    function isWhite(r, g, b) {
        const threshold = 200;
        return r > threshold && g > threshold && b > threshold;
    }

    for (let i = 0; i < pixels.length; i += 4) {
        const red = pixels[i];
        const green = pixels[i + 1];
        const blue = pixels[i + 2];

        if (isWhite(red, green, blue)) {
            pixels[i + 3] = 0;
        }
    }
}

function convertWhite( pixels ) {
    for (let i = 0; i < pixels.length; i += 4) {
        if (pixels[i + 3] > 0) {
            pixels[i] = 255;
            pixels[i + 1] = 255;
            pixels[i + 2] = 255;
        }
    }
}