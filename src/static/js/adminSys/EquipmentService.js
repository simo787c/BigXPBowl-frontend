class EquipmentRenderer {

    constructor() {
    }

    async updateUI(){
        let equipments = document.getElementById("equipments");

        let data = await utilFetch.operationData("equipment","","","GET");
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
                /*let id = clone.querySelector(".id")
                let activityType = clone.querySelector(".activityType")
                let name = clone.querySelector(".name")
                let desc = clone.querySelector(".description")
                let condition = clone.querySelector(".condition")
                
                id.innerHTML += element.id
                activityType.innerHTML += element.activityType
                name.innerHTML += element.name
                desc.innerHTML += element.description
                condition.innerHTML += element.condition*/

                equipments.appendChild(clone)
            });
            
            /* for (const row of data){
                const rowElement = document.createElement("tr");

                for (const cellText of row){
                    const cellElement = document.createElement("td");

                    cellElement.textContent = cellText;
                    rowElement.appendChild(cellElement);
                }
            } 

            equipments.appendChild(rowElement);*/

        } catch (error) {
            console.log(error)
        }
    }
}
var equipmentRenderer = new EquipmentRenderer;

const formPostEvent = document.querySelector("#formPost");
// listening to when Post form get submitted
formPostEvent.addEventListener("submit", event => {
    event.preventDefault();
    console.log("TEST");
    const formData = new FormData(formPostEvent);

    const dataFromForm = Object.fromEntries(formData);
    console.log(dataFromForm);

    utilFetch.operationData("equipment","",dataFromForm,"POST");
    equipmentRenderer.updateUI();
})