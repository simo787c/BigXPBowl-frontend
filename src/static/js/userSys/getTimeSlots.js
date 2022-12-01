class TimeSlotRenderer {

    constructor(data) {
        this.data = data;
        this.getTimeSlot()
    }

    async getTimeSlot() {
        this.data = await utilFetch.operationData("timeSlots/", "", "", "GET");
        //this.timeSlotUpdateUI()
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

    // timeSlotUpdateUI() {
    //     document.getElementById("1hour").setAttribute("checked", "checked")
    //     $('input[type=radio][name=duration]').change(function () {
    //         if (this.value == '1') {
    //             let target = $('select[name="timeSlotSelect"]');
    //             let options = `<option value="21:00" id="timeSlot12">21:00</option>`;
    //             //let options = `<option value="${element.startTime}">${element.startTime + "-" + element.endTime}</option>`;
    //             target.append(options);
    //         }
    //         else if (this.value == '2') {
    //             $('#timeSlot12').remove();
    //         }
    //     });

    //     /* for (let dataIndex in this.data) {
    //         let element = this.data[dataIndex];

    //         let target = $('select[name="timeSlotSelect"]');
    //         let options = `<option value="${element.startTime}">${element.startTime}</option>`;
    //         target.append(options);
    //     } */
    //     this.data.forEach(element => {
    //         let target = $('select[name="timeSlotSelect"]');
    //         let options = `<option value="${element.startTime}" id="${"timeSlot" + element.timeSlotId}">${element.startTime}</option>`;
    //         //let options = `<option value="${element.startTime}">${element.startTime + "-" + element.endTime}</option>`;
    //         target.append(options);
    //     });
    // }

    timeSlotUpdateUI() {
        document.getElementById("1hour").setAttribute("checked", "checked")
        $('input[type=radio][name=duration]').change(function () {
            if (this.value == '1') {
                let target = $('select[name="timeSlotSelect"]');
                let options = `<option value="12" id="timeSlot12">21:00</option>`;
                //let options = `<option value="${element.startTime}">${element.startTime + "-" + element.endTime}</option>`;
                target.append(options);
            }
            else if (this.value == '2') {
                $('#timeSlot12').remove();
            }
        });

        this.data.forEach(element => {
            let target = $('select[name="timeSlotSelect"]');
            let options = `<option value="${element.timeSlotId}" id="${"timeSlot" + element.timeSlotId}">${element.startTime}</option>`;
            //let options = `<option value="${element.startTime}">${element.startTime + "-" + element.endTime}</option>`;
            target.append(options);
        });
    }

    modalClosedRemoveElement() {
        this.data.forEach(element => {
            $("#timeSlot" + element.timeSlotId).remove();
        });
    }
}
var timeSlotRenderer = new TimeSlotRenderer;