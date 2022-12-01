class TimeSlotRenderer {

    constructor() {
    }

    async updateUI() {
        let timeSlot = document.getElementById("timeSlot");

        let data = await utilFetch.operationData("timeSlots/", "", "", "GET");

        document.getElementById("view").setAttribute("class", "container-fluid")

        try {
            //clear timeSlot div content
            timeSlot.innerHTML = ""

            //iterate through each lane, then clone and assign a htmltemplate for it
            data.forEach(element => {
                //let clone = cloneHtmlTemplate("template-timeSlot")
                //clone.setAttribute("class", "col-auto d-flex justify-content-center")

                clone.querySelector(".startTime").innerHTML += element.startTime
                clone.querySelector(".endTime").innerHTML += element.endTime
                /* clone.querySelector("#btnId").value += element.bowlingLaneNr */

                timeSlot.appendChild(clone)
            });

        } catch (error) {
            console.log(error)
        }
    }
   /*  modalBook(id) {
        //let bowlingId = document.getElementById("bowlingId")
        //bowlingId.value = id;
        $('#bowlingId').val(id);//
        console.log(id)
    } */
}
var timeSlotRenderer = new TimeSlotRenderer;