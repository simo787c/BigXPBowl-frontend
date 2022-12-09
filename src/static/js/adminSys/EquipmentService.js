class EquipmentRenderer {

    constructor() {
    }

    async updateUI() {
        let equipments = document.getElementById("equipments");

        let data = await utilFetch.operationData("equipment", "", "", "GET");
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
                clone.querySelector(".deleteButton").value += element.id;
                clone.querySelector(".editButton").value += element.id;
                //for deleteEquipment() to delete the tr when deleting
                clone.setAttribute("id", element.id);

                equipments.appendChild(clone)
            });

        } catch (error) {
            console.log(error)
        }
    }

    deleteEquipment(id) {
        if (this.confirmDelete()) {
            utilFetch.operationData("equipment/", id, "", "DELETE");
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

    async editButtonClick(id) {
        console.log("edit clicked " + id);
        //$('#formPost').attr('method','PATCH')
        document.getElementById("equipmentMethodType").value = "PATCH";
        //console.log(document.querySelector("#formPost").method);
        let data = await utilFetch.operationData("equipment/", id, "", "GET");

        document.getElementById("id").value = data.id;
        //document.getElementById("activityType").value += data.activityType;
        document.getElementById("name").value = data.name;
        document.getElementById("description").value = data.description;
        
        if(data.activityType == "Bowling"){
            document.getElementById("activityType").value = "Bowling"
        }else if(data.activityType == "Air Hockey"){
            document.getElementById("activityType").value = "Air Hockey"
        }

        switch(data.condition){
            case "Ny":
                document.getElementById("condition").value = "Ny";
            case "Ødelagt":
            document.getElementById("condition").value = "Ødelagt";
            case "Bestil Forsyning":
                document.getElementById("condition").value = "Bestil Forsyning";
        }

    }

    createButtonClick() {
        console.log("create clicked");
        //$('#formPost').attr('method','POST')
        document.getElementById("equipmentMethodType").value = "POST";
        //console.log(document.querySelector("#formPost").method);
    }
}

var equipmentRenderer = new EquipmentRenderer;

const formPostEvent = document.querySelector("#formPost");

// listening to when Post form get submitted
formPostEvent.addEventListener("submit", async (event) => {
    event.preventDefault();
    let equipmentMethodType = document.getElementById("equipmentMethodType").value

    const formData = new FormData(formPostEvent);
    //let dataFromForm;

    //we made a workaround to use a field in form with the method type, as method attribute on form is dumb
    // We can write method type in uppercase but it gives in lowercase (deprecated)
    //in the html form, it only has post and get, we dont use the functionality (deprecated)
    // if (equipmentMethodType == "POST") {
    //     console.log("IF " + equipmentMethodType);
    //     formData.delete("id");
    //     dataFromForm = Object.fromEntries(formData);
    //     await utilFetch.operationData("equipment", "", dataFromForm, "POST");
    // } else if (equipmentMethodType == "PATCH") {
    //     console.log("IF " + equipmentMethodType);
    //     dataFromForm = Object.fromEntries(formData);
    //     await utilFetch.operationData("equipment/", document.getElementById("id").value, dataFromForm, "PATCH");
    // }

    //NEW NEW post patch method, fetch doesnt need an ID by itself since if its included in the form it'll know what to do
    //Might be a security breach since its done in the frontend, and post endpoint doesnt break if it gets an id with the request
    //5. in https://www.baeldung.com/spring-data-crud-repository-save
    if (equipmentMethodType == "POST") {
        console.log("IF " + equipmentMethodType);
        formData.delete("id");
    }
    const dataFromForm = Object.fromEntries(formData);
    await utilFetch.operationData("equipment/", "", dataFromForm, "POST");
    equipmentRenderer.updateUI();
})

