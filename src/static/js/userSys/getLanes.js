class LanesRenderer {

    constructor() {
    }

    async updateUI(){
        let lanes = document.getElementById("lanes");

        let data = await utilFetch.operationData("activities/bowling","","","GET");
        
        try {
            //clear lanes div content
            lanes.innerHTML = ""

            //iterate through each lane, then clone and assign a htmltemplate for it
            data.forEach(element => {
                let clone = cloneHtmlTemplate("template-lane")
                let laneNr = clone.querySelector("#laneNr")
                let desc = clone.querySelector("#description")
                let status = clone.querySelector("#status")
                
                laneNr.innerHTML += element.bowlingLaneNr
                desc.innerHTML += element.description

                if(element.bowlingLaneStatus){
                    status.setAttribute("class", "text-success")
                    status.innerHTML += "Ledig"
                }else {
                    status.setAttribute("class", "text-warning")
                    status.innerHTML += "Fully booked"
                }

                lanes.appendChild(clone)
            });
            
        } catch (error) {
            console.log(error)
        }
    }
}
var lanesRenderer = new LanesRenderer;