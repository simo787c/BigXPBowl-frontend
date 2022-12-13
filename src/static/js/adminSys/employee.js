class EmployeeRenderer {

    constructor() {
        //this.updateUI();
    }

    async updateUI() {
        let employeeTable = document.getElementById("employee-table");

        let data = await utilFetch.operationData("employee", "", "", "GET");

        document.getElementById("view").setAttribute("class", "container-fluid")

        try {
            //clear lanes div content
            employeeTable.innerHTML = ""

            //iterate through each lane, then clone and assign a htmltemplate for it
            data.forEach(element => {
                let clone = cloneHtmlTemplateTableTr("template-employee-table")

                clone.querySelector(".employee-name").innerHTML += element.name
                clone.querySelector(".employee-title").innerHTML += element.title
                clone.querySelector(".employee-department").innerHTML += element.department
                //clone.querySelector("#btnId").value += element.bowlingLaneNr

                employeeTable.appendChild(clone)
            });

        } catch (error) {
            console.log(error)
        }
    }
}
var employeeRenderer = new EmployeeRenderer;