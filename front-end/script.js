const server_address ="http://127.0.0.1:8000/"

const img_upload = document.getElementById("img_upload")
const send_button = document.getElementById("send")
let id_process = 0 
let intervalId = 0 
let data_file_name = ""




function renderInf(data){
    const l = document.getElementById("inf-label-langue")
    l.innerHTML = "'"+data["language"]+"'"
    document.getElementById("percentage").innerHTML = data["percentage"]+" %"
    //On supprime les identifiants pour plus de sécurité
    for(let i =0 ; i< data["offers"].length;i++){
        delete data["offers"][i]["id"]
        delete data["offers"][i]["id_process"]
    }
    let tab = new gridjs.Grid({
        data:data["offers"],
        style: {
            table: {
            border: '3px solid #ccc'
            },
            th: {
            'background-color': 'rgba(0, 0, 0, 0.1)',
            color: '#000',
            'border-bottom': '3px solid #ccc',
            'text-align': 'center'
            },
            td: {
            'text-align': 'center'
            }
        }
    })
    const parent = document.getElementById("data-table")
    while(parent.firstChild){
        parent.removeChild(parent.firstChild)
    }
    let table = document.createElement("p")
    tab.render(table)
    parent.appendChild(table)
}

function task(){
    fetch(server_address+"extractor/check/"+id_process,
        {
            method:"GET",
            mode:"cors"
        }
    ).then((result)=>result.json()).then((data)=>{
         renderInf(data)
         if(data["percentage"]>=100){
            clearInterval(intervalId)
            const button = document.getElementById("button_for_download")
            button.classList.remove("disabled-button")
            button.classList.add("active-button")
            button.addEventListener("click",()=>{
                const div = document.getElementById("container-download")
                div.style.display="flex"
                const title_file = document.getElementById("file-name-download")
                const url = document.getElementById("url_file")
                title_file.innerHTML = data["file_name"]
                url.href = server_address+"static/documents/"+data["file_name"]

            })
            const l = document.getElementById("inf-label-etat")
                    l.innerHTML = "terminée"
            /*
            const parentLink = document.getElementById("download_file")
            const link = document.createElement("a")
            link.textContent = data["file_name"]
            link.href = server_address+"static/documents/"+data["file_name"]
            parentLink.appendChild(link)*/
         } 
    })
}


img_upload.addEventListener("click",()=>{
    const file = document.getElementById("file")
    file.onchange = ()=>{
        let path_table = file.value.split("\\")
        document.getElementById("inf-label-nom").innerHTML = path_table[path_table.length-1]
        const n = file.files[0].size
        document.getElementById("inf-label-taille").innerHTML = parseInt(n/1024) + " Kb"
    }
    file.click()
})


send_button.addEventListener("click",()=>{
    const file = document.getElementById("file")
    const text = document.getElementById("text")
    if (!file.value && text.value =="")
    {
        Swal.fire("Please choose a file")
        return
    }
    const formElement = document.getElementById("file-form")
    const form = new FormData(formElement)
    fetch(server_address+"extractor/save/",
        {
            method:"POST",
            mode:"cors",
            body:form
        }
    ).then((result)=> result.json()).then((data)=>{
            if (data["code"] == 200){
                id_process = data["id_process"]
                intervalId = setInterval(task,1000)
                const l = document.getElementById("inf-label-etat")
                l.innerHTML = "En cours d'extraction"
                const a = document.createElement("a")
                a.href = "#percentage"
                a.click()
            }
            else{
                Swal.fire(data["message"])
            }
    }).catch(error=>{
    Swal.fire("error")
    console.log(error)})
})

document.getElementById("url_file").addEventListener("click",()=>{
    const div = document.getElementById("container-download")
    div.style.display="none"
    const button = document.getElementById("button_for_download")
    button.classList.add("disabled-button")
    button.classList.remove("active-button")
})