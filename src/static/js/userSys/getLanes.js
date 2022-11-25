class LanesRenderer {

    constructor(data) {
        this.data = data;
        this.getData();
    }

    async getData () {
        this.data = await utilFetch.operationData("activities/bowling","","","GET");
        this.updateUI();
    }

    async updateUI(){
        
        let page = cloneHtmlTemplate("template-bowling")
        //let lanes = page.querySelector("lanes")

        let lanes = document.getElementById("lanes");

        this.data = await utilFetch.operationData("activities/bowling","","","GET");

        
        try {
            //clear lanes div content
            lanes.innerHTML = ""

            //iterate through each lane, then clone and assign a htmltemplate for it
            this.data.forEach(element => {
                let clone = cloneHtmlTemplate("template-lane")
                let laneNr = clone.querySelector("#laneNr")
                let desc = clone.querySelector("#description")
                let status = clone.querySelector("#status")
                
                laneNr.innerHTML += element.bowlingLaneNr
                desc.innerHTML += element.description
                status.innerHTML += element.bowlingLaneStatus

                lanes.appendChild(clone)
            });
            
        } catch (error) {
            console.log(error)
        }
    }
}
var lanesRenderer = new LanesRenderer;