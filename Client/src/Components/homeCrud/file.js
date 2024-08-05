const input = document.querySelector('#fileInput');

input.addEventListener('change', function(){
    const arquivo = this.files;
    const leitor = new FileReader();

    leitor.addEventListener('load', function(){
        console.log(leitor.result);

    });

    if(arquivo) {
        leitor.readAsText
    }
})

