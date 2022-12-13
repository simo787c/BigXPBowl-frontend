class Orderrenderer {

    constructor() {
        this.method();
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
}
var orderrenderer = new Orderrenderer;
