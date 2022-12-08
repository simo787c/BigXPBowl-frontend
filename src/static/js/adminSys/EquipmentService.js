class EquipmentRenderer {

    constructor() {
    }

    async updateUI(){
        let equipments = document.getElementById("equipments");

        let data = await utilFetch.operationData("equipment","","","GET");
        document.getElementById("view").setAttribute("class", "")
        document.getElementsByTagName("")
        console.log(data);
        try {
            //clear equipments div content
            equipments.innerHTML = ""

            //iterate through each lane, then clone and assign a htmltemplate for it
            data.forEach(element => {
                //id,activityType,name,description,condition
                let clone = cloneHtmlTemplateTableTr("template-equipment-item")

                clone.querySelector(".id").innerHTML += element.id;
                clone.querySelector(".activityType").innerHTML += element.activityType;
                clone.querySelector(".name").innerHTML += element.name;
                clone.querySelector(".description").innerHTML += element.description;
                clone.querySelector(".condition").innerHTML += element.condition;
                clone.querySelector(".deleteButton").value+= element.id;
                clone.querySelector(".editButton").value+= element.id;
                clone.setAttribute("id",element.id);

                equipments.appendChild(clone)
            });

        } catch (error) {
            console.log(error)
        }
    }
    
    deleteEquipment(id) {
        if (this.confirmDelete()) {
            utilFetch.operationData("equipment/",id,"","DELETE");
            //Remove deleted element from UI
            $('#' + id).remove();
            console.log('Delete was successful');
        } else {
            console.log('Delete was cancelled');
        }
    }
    //Confirm prompt
    confirmDelete() {
        return confirm('Er du sikker på du vil slette?');
    }

    editButtonClick(id){
        console.log("edit clicked " + id);
        //$('#formPost').attr('method','PATCH')
        document.getElementById("formPost").method = "PATCH";
        //console.log(document.querySelector("#formPost").method);


    }

    createButtonClick(){
        console.log("create clicked");
        //$('#formPost').attr('method','POST')
        document.getElementById("formPost").method = "POST";
        //console.log(document.querySelector("#formPost").method);
    }
}
    
var equipmentRenderer = new EquipmentRenderer;

const formPostEvent = document.querySelector("#formPost");

// listening to when Post form get submitted
formPostEvent.addEventListener("submit", event => {
    event.preventDefault();
    const formData = new FormData(formPostEvent);

    const dataFromForm = Object.fromEntries(formData);
    console.log(dataFromForm);
    //console.log(formPostEvent.method);
    if(formPostEvent.method == "POST"){
        console.log("POST IF");
        utilFetch.operationData("equipment","",dataFromForm,"POST");
    }else if(formPostEvent.method == "PATCH"){
        console.log("PATCH");
        utilFetch.operationData("equipment/",id,dataFromForm,"PATCH");
    }
    console.log(formPostEvent);
    equipmentRenderer.updateUI();
})

