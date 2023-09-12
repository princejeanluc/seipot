const server_address ="http://127.0.0.1:8000/"

document.body.innerHTML = '<div id="app"></div>'

function Header(){
    return (<div>
        <h1>S.E.I.P.O.T</h1>
    </div>)
}

function InputLayout({update}){
    function goOnUpload(){
        update("Upload")
    }
    function goOnAddText(){
        update("InsertText")
    }
    return (
        <div id="content">
            <h3>choose the input</h3>
            <div>
                <div class="item_choice">
                    <img src="assets/img/document.svg" onClick={goOnUpload}></img>
                    <p>Document</p>
                </div>
                <div class="item_choice">
                    <img src="assets/img/add_text.svg" onClick={goOnAddText}></img>
                    <p>Text</p>
                </div>
            </div>
        </div>
    )
}

function Upload({update,updateIdProcess}){
    function choosefile(){
        const file = document.getElementById("file")
        file.onchange = ()=>{
            document.getElementById("file_name").innerHTML = file.value
        }
        file.click()
    }
    function goOnInputLayout(){
        update("InputLayout")
    }

    function goOnUploading(){
        const file = document.getElementById("file")
        if (!file.value)
        {
            Swal.fire("Please choose a file")
            return
        }
        const formElement = document.getElementById("form")
        const form = new FormData(formElement)
        fetch(server_address+"extractor/save/",
            {
                method:"POST",
                mode:"cors",
                body:form
            }
        ).then((result)=> result.json()).then((data)=>{
                updateIdProcess(data["id_process"])
        }).catch(error=>{
        Swal.fire("An error has occured")
        console.log(error)})
    }

    return (
        <div id="content">
            <div>
                <img src ="assets/img/document.svg" width="40px" ></img>
                <h3>Upload file</h3>
            </div>
            <div class="form-div">
                <form  id="form" enctype="multipart/form-data">
                <input type="file" hidden id="file" name="file"></input>
                <img src="assets/img/upload.svg" width="300" class="pointer" onClick={choosefile}></img>
                </form>
                <div>
                <button class="button_primary_action" onClick={goOnUploading}>Upload</button>
                <button class="button_secondary_action" onClick={goOnInputLayout} >Cancel</button>
                </div>
                <script src="js/default.js"></script>
            </div>
            <div><p id="file_name">Aucun fichier Selectionné ... </p></div>
        </div>
    )
}


function InsertText(){
    return (
        <div id="content">
            <div>
                <img src ="assets/img/add_text.svg" width="40px"></img>
                <h3>Insert text </h3>
            </div>
            <div class="insert_text">
                <form>
                <textarea rows="10" ></textarea>
                <div >
                <button class="button_primary_action">Send</button>
                <button class="button_secondary_action">Cancel</button>  
                </div>
                </form>
            </div>
        </div>

    )
}


function Spinner(){
    return(
        <div class="fulfilling-square-spinner"></div>
    )
}

function ProgressBar(){
    return (
        <div id="progress_bar">
            <p id="percentage">0 %</p>
                </div>
    )
}


function Uploading({update, idprocess}){
    const [changepage,setChangepage]=React.useState(false)
    let intervalId = 0
    function renderInf(data){
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
        const parent = document.getElementById("tab")
        while(parent.firstChild){
            parent.removeChild(parent.firstChild)
        }
        let table = document.createElement("p")
        tab.render(table)
        parent.appendChild(table)
    }
    function task(){
        fetch(server_address+"extractor/check/"+idprocess,
            {
                method:"GET",
                mode:"cors"
            }
        ).then((result)=>result.json()).then((data)=>{
             renderInf(data)
             if(data["percentage"]>=100){
                clearInterval(intervalId)
                const parentLink = document.getElementById("download_file")
                const link = document.createElement("a")
                link.textContent = data["file_name"]
                link.href = server_address+"static/documents/"+data["file_name"]
                parentLink.appendChild(link)
             } 
        })
    }

    intervalId = setInterval(task,1000)


    return (
        <div id="content">
            <div>
                <img src ="assets/img/uploading.svg" width="40px"></img>
                <h3>Extraction </h3>
            </div>
            <div class="loading">
                <ProgressBar/>
            <h4>extraction ... </h4>
            <p id ="tab" class="tiny_font"></p>
            <p id="download_file"></p>
            </div>
        </div>
    )
}

function Extraction_layout(){
    return (
        <div id="content">
            <div>
                <img src ="assets/img/extraction.svg" width="40px"></img>
                <h3>Extraction </h3>
            </div>
            <div><img></img> <a href="">informations</a></div>


        </div>
    )

}

function MainPage(){
    const [page, setPage] = React.useState("InputLayout");
    const [idprocess,setIdprocess]=React.useState(0)
    function updatePage(page_name){
        setPage(page_name)
    }
    function updateIdProcess(id){
        setIdprocess(id)
        setPage("Uploading")
    }
    let contents = {
        "InputLayout":<InputLayout update={updatePage}/>,
        "Upload":<Upload update={updatePage} updateIdProcess={updateIdProcess}/>,
        "InsertText":<InsertText update={updatePage} />,
        "Uploading":<Uploading update={updatePage} idprocess={idprocess}/>,
        "Extraction_layout":<Extraction_layout update={updatePage}/>
    }
    let content = contents[page]

    return (
        <>
        <Header/>
        {content}
        </>
    )
}





const app = document.getElementById('app');
ReactDOM.render(<MainPage/>, app);