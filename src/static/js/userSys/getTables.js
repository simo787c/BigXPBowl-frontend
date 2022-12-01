class TableRenderer {

    constructor() {
    }

    async updateUI(){
        let tables = document.getElementById("tables");

        let data = await utilFetch.operationData("activities/airHockey","","","GET");

        document.getElementById("view").setAttribute("class", "container-fluid")

        document.getElementById("page-title").innerHTML += "<br>"+ new Date().toLocaleString("da-DK").split(" ") [0];
        
        try {
            //clear Table div content
            tables.innerHTML = ""

            //iterate through each lane, then clone and assign a htmltemplate for it
            data.forEach(element => {
                let clone = cloneHtmlTemplate("template-table")
                clone.setAttribute("class", "col-auto d-flex justify-content-center")

                clone.querySelector(".tableNr").innerHTML += element.airHockeyTableNr
                clone.querySelector(".description").innerHTML += element.description
               
               let status = clone.querySelector(".status")
                if(element.airHockeyTableStatus){
                    status.setAttribute("class", "bi bi-circle-fill text-success")
                    status.innerHTML += "Ledig"
                }else {
                    status.setAttribute("class", "bi bi-circle-fill text-warning")
                    status.innerHTML += "Fuldt booked"
                }

                tables.appendChild(clone)
            });
            
        } catch (error) {
            console.log(error)
        }
    }
}
var tableRenderer = new TableRenderer;