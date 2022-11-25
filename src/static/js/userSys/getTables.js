class TableRenderer {

    constructor() {
    }

    async updateUI(){
        let tables = document.getElementById("tables");

        let data = await utilFetch.operationData("activities/airHockey","","","GET");

        
        try {
            //clear lanes div content
            tables.innerHTML = ""

            //iterate through each lane, then clone and assign a htmltemplate for it
            data.forEach(element => {
                let clone = cloneHtmlTemplate("template-table")
                let tableNr = clone.querySelector("#tableNr")
                let desc = clone.querySelector("#description")
                let status = clone.querySelector("#status")
                
                tableNr.innerHTML += element.airHockeyTableNr
                desc.innerHTML += element.description
                status.innerHTML += element.airHockeyTableStatus

                tables.appendChild(clone)
            });
            
        } catch (error) {
            console.log(error)
        }
    }
}
var tableRenderer = new TableRenderer;