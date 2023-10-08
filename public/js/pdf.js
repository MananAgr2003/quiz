window.onload = function () {
    const page = document.body;


    document.getElementById("download")
        .addEventListener("click", () => {
           
            var opt = {
                margin: 1,
                filename: 'myfle.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'in', format: 'a2', orientation: 'landscape' }
            };
            html2pdf().from(page).set(opt).save();
        })
}