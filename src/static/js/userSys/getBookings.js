class BookingsRenderer {

    constructor() {
    }

    async updateUI() {
        let bookings = document.getElementById("bookings");

        let data = await utilFetch.operationData("bookings", "", "", "GET");

        document.getElementById("view").setAttribute("class", "container-fluid")

        try {
            //clear bookings div content
            bookings.innerHTML = ""

            //iterate through each booking, then clone and assign a htmltemplate for it
            data.forEach(async (element) => {
                let clone = cloneHtmlTemplateTableTr("template-booking-item")
                clone.querySelector(".email").innerHTML += element.email
                clone.querySelector(".startDate").innerHTML += element.startDate
                clone.querySelector(".activityDuration").innerHTML += element.activityDuration
                if (element.bowlingTimeSlotJoinedTableList != "") {
                    for (let i = 0; i < element.bowlingTimeSlotJoinedTableList.length; i++) {
                        clone.querySelector(".bowlingTimeSlotJoinedTableList").innerHTML += element.bowlingTimeSlotJoinedTableList[i].bowlingTimeSlotJTId + "<br>"
                        // Syntax for Get
                        let bowlingData = await utilFetch.operationData("activities/bowling/", element.bowlingTimeSlotJoinedTableList[i].timeSlotId, "", "GET");
                        clone.querySelector(".bowlingTimeSlotJoinedTableList").innerHTML += await bowlingData.name + "<br>"
                        //let timeslot = utilFetch.operationData("timeSlots/", element.bowlingTimeSlotJoinedTableList[i].timeSlotId, "", "GET");
                        let timeslot = await utilFetch.operationData("timeSlots/", "", "", "GET");
                        for (let j = 0; j < timeslot.length; j++) {
                            if (element.bowlingTimeSlotJoinedTableList[i].timeSlotId == timeslot[j].timeSlotId) {
                                clone.querySelector(".bowlingTimeSlotJoinedTableList").innerHTML += timeslot[j].startTime  + "<br>"

                            }
                        }

                    }
                }

                bookings.appendChild(clone)
            });

        } catch (error) {
            console.log(error)
        }
    }
}
var bookingsRenderer = new BookingsRenderer;