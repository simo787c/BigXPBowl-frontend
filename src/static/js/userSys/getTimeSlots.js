class TimeSlotRenderer {

    constructor(data) {
        this.data = data;
        this.getTimeSlot()
    }

    async getTimeSlot() {
        this.data = await utilFetch.operationData("timeSlots/", "", "", "GET");
        this.bookingData = await utilFetch.operationData("bookings/", "", "", "GET");
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
                clone.querySelector(".startTime").innerHTML += element.startTime
                clone.querySelector(".endTime").innerHTML += element.endTime
                /* clone.querySelector("#btnId").value += element.bowlingLaneNr */

                timeSlot.appendChild(clone)
            });

        } catch (error) {
            console.log(error)
        }
    }

    timeSlotUpdateUI(id, activityType) {
        for (let j = 1; j < timeSlotRenderer.data.length + 1; j++) {
            $('#timeSlot' + j).remove();
        }

        document.getElementById("activityDate").value = ""//new Date("2022-12-04").toISOString().substring(0,10)
        document.getElementById("1hour").checked = true
        document.getElementById("2hour").checked = false

        $('input[type=radio][name=duration]').unbind('change');
        $('input[type=radio][name=duration]').change(function () {
            if (this.value == '1') { // If it's 1 hour do this
                let target = $('select[name="timeSlotSelect"]');
                let options = `<option value="12" id="timeSlot12">21:00</option>`;
                //let options = `<option value="${element.startTime}">${element.startTime + "-" + element.endTime}</option>`;
                target.append(options);

                if (activityType == "bowling") {
                    for (let j = 0; j < timeSlotRenderer.bookingData.length; j++) {
                        for (let k = 0; k < timeSlotRenderer.bookingData[j].bowlingTimeSlotJoinedTableList.length; k++) {
                            const element = timeSlotRenderer.bookingData[j].bowlingTimeSlotJoinedTableList[k].timeSlotId;
                            if (element != 1) {
                                $('#timeSlot' + (element - 1)).prop("disabled", false);
                            }
                        }
                    }
                } else if (activityType == "airHockey") {
                    for (let j = 0; j < timeSlotRenderer.bookingData.length; j++) {
                        for (let k = 0; k < timeSlotRenderer.bookingData[j].airHockeyTimeSlotJoinedTableList.length; k++) {
                            const element = timeSlotRenderer.bookingData[j].airHockeyTimeSlotJoinedTableList[k].timeSlotId;
                            if (element != 1) {
                                $('#timeSlot' + (element - 1)).prop("disabled", false);
                            }
                        }
                    }
                }
            } else if (this.value == '2') { // If it's 2 hour do this
                $('#timeSlot12').remove();
                for (let i = 0; i < timeSlotRenderer.data.length; i++) {
                    if ($('#timeSlot' + timeSlotRenderer.data[i].timeSlotId).is(":disabled")) {
                        if ($('#timeSlot' + timeSlotRenderer.data[i].timeSlotId) != $('#timeSlot1')) {
                            $('#timeSlot' + (timeSlotRenderer.data[i].timeSlotId - 1)).attr("disabled", "disabled")
                        }
                    }
                }
            }
        });

        this.data.forEach(element => {
            let target = $('select[name="timeSlotSelect"]');
            let options = `<option value="${element.timeSlotId}" class="timeSlots" id="${"timeSlot" + element.timeSlotId}">${element.startTime}</option>`;
            //let options = `<option value="${element.startTime}">${element.startTime + "-" + element.endTime}</option>`;
            target.append(options);
        });

        $('input[type=date][name=activityDate]').unbind('change'); // unbind is added!!!
        $('input[type=date][name=activityDate]').change(function () { // Need unbind or it will be called twice
            let bookingOnDate = false;
            if (activityType == "bowling") {
                for (let i = 0; i < timeSlotRenderer.bookingData.length; i++) { //TODO Check this again
                    if (this.value == timeSlotRenderer.bookingData[i].activityDate.split("T")[0]) {
                        for (let j = 0; j < timeSlotRenderer.bookingData.length; j++) {
                            for (let k = 0; k < timeSlotRenderer.bookingData[j].bowlingTimeSlotJoinedTableList.length; k++) {
                                $('#timeSlot' + timeSlotRenderer.bookingData[j].bowlingTimeSlotJoinedTableList[k].timeSlotId).prop("disabled", false);
                            }
                        }
                        bookingOnDate = true;
                        break;
                    } else {
                        bookingOnDate = false;
                    }
                }

                if (bookingOnDate) {
                    for (let i = 0; i < timeSlotRenderer.bookingData.length; i++) {
                        if (this.value == timeSlotRenderer.bookingData[i].activityDate.split("T")[0]) {
                            for (let j = 0; j < timeSlotRenderer.bookingData[i].bowlingTimeSlotJoinedTableList.length; j++) {
                                //console.log(timeSlotRenderer.data[i])//.bowlingTimeSlotJoinedTableList[j].timeSlotId)
                                //console.log(timeSlotRenderer.bookingData[i].bowlingTimeSlotJoinedTableList[j].timeSlotId)
                                if (id == timeSlotRenderer.bookingData[i].bowlingTimeSlotJoinedTableList[j].bowlingId) {
                                    //$('#timeSlot' + timeSlotRenderer.bookingData[i].bowlingTimeSlotJoinedTableList[j].timeSlotId).remove();
                                    $('#timeSlot' + timeSlotRenderer.bookingData[i].bowlingTimeSlotJoinedTableList[j].timeSlotId).attr("disabled", "disabled");
                                    console.log("Remove Element")
                                }
                            }
                        }
                    }
                } else {
                    for (let j = 1; j < timeSlotRenderer.data.length + 1; j++) {
                        $('#timeSlot' + j).remove();
                    }
                    timeSlotRenderer.data.forEach(element => {
                        let target = $('select[name="timeSlotSelect"]');
                        let options = `<option value="${element.timeSlotId}" id="${"timeSlot" + element.timeSlotId}">${element.startTime}</option>`;
                        //let options = `<option value="${element.startTime}">${element.startTime + "-" + element.endTime}</option>`;
                        target.append(options);
                    });
                }

            } else if (activityType == "airHockey") {
                for (let i = 0; i < timeSlotRenderer.bookingData.length; i++) { //TODO Check this again
                    if (this.value == timeSlotRenderer.bookingData[i].activityDate.split("T")[0]) {
                        for (let j = 0; j < timeSlotRenderer.bookingData.length; j++) {
                            for (let k = 0; k < timeSlotRenderer.bookingData[j].bowlingTimeSlotJoinedTableList.length; k++) {
                                $('#timeSlot' + timeSlotRenderer.bookingData[k].bowlingTimeSlotJoinedTableList[k].timeSlotId).prop("disabled", false);
                            }
                        }
                        bookingOnDate = true;
                        break;
                    } else {
                        bookingOnDate = false;
                    }
                }

                if (bookingOnDate) {
                    for (let i = 0; i < timeSlotRenderer.bookingData.length; i++) {
                        if (this.value == timeSlotRenderer.bookingData[i].activityDate.split("T")[0]) {
                            for (let j = 0; j < timeSlotRenderer.bookingData[i].airHockeyTimeSlotJoinedTableList.length; j++) {
                                if (id == timeSlotRenderer.bookingData[i].airHockeyTimeSlotJoinedTableList[j].airHockeyId) {
                                    //$('#timeSlot' + timeSlotRenderer.bookingData[i].bowlingTimeSlotJoinedTableList[j].timeSlotId).remove();
                                    $('#timeSlot' + timeSlotRenderer.bookingData[i].airHockeyTimeSlotJoinedTableList[j].timeSlotId).attr("disabled", "disabled");
                                    console.log("Remove Element")
                                }
                            }
                        }
                    }
                } else {
                    for (let j = 1; j < timeSlotRenderer.data.length + 1; j++) {
                        $('#timeSlot' + j).remove();
                    }
                    timeSlotRenderer.data.forEach(element => {
                        let target = $('select[name="timeSlotSelect"]');
                        let options = `<option value="${element.timeSlotId}" id="${"timeSlot" + element.timeSlotId}">${element.startTime}</option>`;
                        //let options = `<option value="${element.startTime}">${element.startTime + "-" + element.endTime}</option>`;
                        target.append(options);
                    });
                }
            }
            
        });
    }

    modalClosedRemoveElement() {
        this.data.forEach(element => {
            $("#timeSlot" + element.timeSlotId).remove();
        });
    }
}
var timeSlotRenderer = new TimeSlotRenderer();