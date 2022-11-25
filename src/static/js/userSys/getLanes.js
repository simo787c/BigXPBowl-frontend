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

        let lanes = page.querySelector("lanes")

        this.data = await utilFetch.operationData("activities/bowling","","","GET");

        
        try {
            //clear lanes div content
            lanes.innerHTML = ""

            //iterate through each lane, then clone and assign a htmltemplate for it
            this.data.forEach(element => {
                let clone = cloneHtmlTemplate("template-lane")
                
                
                clone.getElementById("laneNr").innerHTML += element.bowlingLaneNr
                clone.getElementById("description").innerHTML += element.description
                clone.getElementById("status").innerHTML += element.bowlingLaneStatus

                lanes.appendChild(clone)
            });
            
        } catch (error) {
            console.log(error)
        }
    }
}
var lanesRenderer = new LanesRenderer;