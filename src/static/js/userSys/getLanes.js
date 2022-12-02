class LanesRenderer {

    constructor() {
    }

    async updateUI() {
        let lanes = document.getElementById("lanes");

        let data = await utilFetch.operationData("activities/bowling", "", "", "GET");

        document.getElementById("view").setAttribute("class", "container-fluid")

        try {
            //clear lanes div content
            lanes.innerHTML = ""

            //iterate through each lane, then clone and assign a htmltemplate for it
            data.forEach(element => {
                let clone = cloneHtmlTemplate("template-lane")
                clone.setAttribute("class", "col-auto d-flex justify-content-center")
                
                clone.querySelector(".laneNr").innerHTML += element.bowlingLaneNr
                clone.querySelector(".description").innerHTML += element.description
                clone.querySelector("#btnId").value += element.bowlingLaneNr

                let status = clone.querySelector(".status")
                if (element.bowlingLaneStatus) {
                    status.setAttribute("class", "bi bi-circle-fill text-success")
                    status.innerHTML += "Ledig"
                } else {
                    status.setAttribute("class", "bi bi-circle-fill text-warning")

                    status.innerHTML += "Fuldt booked"
                }

                lanes.appendChild(clone)
            });

        } catch (error) {
            console.log(error)
        }
    }
}
var lanesRenderer = new LanesRenderer;