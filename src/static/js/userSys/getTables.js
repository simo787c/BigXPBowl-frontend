class TableRenderer {

    constructor() {
    }

    async updateUI(){
        let tables = document.getElementById("tables");

        let data = await utilFetch.operationData("activities/airHockey","","","GET");

        document.getElementById("view").setAttribute("class", "container-fluid")
        
        try {
            //clear lanes div content
            tables.innerHTML = ""

            //iterate through each lane, then clone and assign a htmltemplate for it
            data.forEach(element => {
                let clone = cloneHtmlTemplate("template-table")
                clone.setAttribute("class", "col-auto d-flex justify-content-center")
                //clone.setAttribute("style", "width: 250px")

                clone.querySelector(".tableNr").innerHTML += element.airHockeyTableNr
                clone.querySelector(".description").innerHTML += element.description

                /*
                let status = clone.querySelector(".status")
                status.innerHTML += element.airHockeyTableStatus
                */

                tables.appendChild(clone)
            });
            
        } catch (error) {
            console.log(error)
        }
    }
}
var tableRenderer = new TableRenderer;