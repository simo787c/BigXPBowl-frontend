class BookingsRenderer {

    constructor() {
    }

    async updateUI(query) {
        let bookings = document.getElementById("bookings");
        //if nothing is searched, every entry will match the empty query
        let data = await utilFetch.operationData("bookings/search?query=" + query, "", "", "GET");

        document.getElementById("view").setAttribute("class", "container-fluid")

        try {
            //clear bookings div content
            bookings.innerHTML = ""

            //iterate through each booking, then clone and assign a htmltemplate for it
            data.forEach(async (element) => {
                let clone = cloneHtmlTemplateTableTr("template-booking-item")
                clone.querySelector(".email").innerHTML += element.email
                clone.querySelector(".activityDate").innerHTML += element.activityDate.split("T")[0]
                clone.querySelector(".activityDuration").innerHTML += element.activityDuration
                if (element.bowlingTimeSlotJoinedTableList != "" || element.airHockeyTimeSlotJoinedTableList != "") {
                    /*for (let i = 0; i < element.bowlingTimeSlotJoinedTableList.length; i++) {
                        clone.querySelector(".bowlingId").innerHTML += element.bowlingTimeSlotJoinedTableList[i].bowlingId + "<br>"
                        // Syntax for Get
                        let bowlingData = await utilFetch.operationData("activities/bowling/", element.bowlingTimeSlotJoinedTableList[i].timeSlotId, "", "GET");
                        clone.querySelector(".activityType").innerHTML += await bowlingData.name + "<br>"
                        //let timeslot = utilFetch.operationData("timeSlots/", element.bowlingTimeSlotJoinedTableList[i].timeSlotId, "", "GET");
                        let timeslot = await utilFetch.operationData("timeSlots/", "", "", "GET");
                        for (let j = 0; j < timeslot.length; j++) {
                            if (element.bowlingTimeSlotJoinedTableList[i].timeSlotId == timeslot[j].timeSlotId) {
                                clone.querySelector(".timeSlot").innerHTML += timeslot[j].startTime  + "<br>"
                            }
                        }
                    }*/
                    this.activityUI(clone, element, element.bowlingTimeSlotJoinedTableList)
                    this.activityUI(clone, element, element.airHockeyTimeSlotJoinedTableList)
                }
                clone.querySelector(".editButton").value += element.bookingId;
                clone.querySelector(".deleteButton").value += element.bookingId;
                clone.setAttribute("id", element.bookingId);

                bookings.appendChild(clone)
            });

        } catch (error) {
            console.log(error)
        }
    }

    async activityUI(clone, element, activityJT) {
        let activityId;
        let activityType;
        for (let i = 0; i < activityJT.length; i++) {
            if (element.bowlingTimeSlotJoinedTableList != "") {
                activityId = activityJT[i].bowlingId
                activityType = "activities/bowling/"
            } else if (element.airHockeyTimeSlotJoinedTableList != "") {
                activityId = activityJT[i].airHockeyId
                activityType = "activities/airHockey/"
            }
            clone.querySelector(".activityId").innerHTML += activityId + "<br>"
            // Syntax for Get
            let activityData = await utilFetch.operationData(activityType, activityId, "", "GET");
            clone.querySelector(".activityType").innerHTML += await activityData.name + "<br>"
            let timeslot = await utilFetch.operationData("timeSlots/", "", "", "GET");
            for (let j = 0; j < timeslot.length; j++) {
                if (activityJT[i].timeSlotId == timeslot[j].timeSlotId) {
                    clone.querySelector(".timeSlot").innerHTML += timeslot[j].startTime  + "<br>"
                }
            }
        }
    }

    deleteBooking(id) {
        if (this.confirmDelete()) {
            utilFetch.operationData("bookings/", id, "", "DELETE");
            //Remove deleted element from UI
            console.log("ID: "+id)
            $('#' + id).remove();
            console.log('Delete was successful');
        } else {
            console.log('Delete was cancelled');
        }
    }
    //Confirm prompt
    confirmDelete() {
        return confirm('Er du sikker på du vil slette?');
    }

    async editBooking(id) {
        console.log("edit clicked " + id);
        let data = await utilFetch.operationData("bookings/", id, "", "GET");

        document.getElementById("id").value = data.id;
        document.getElementById('email').value = data.email;
        document.getElementById('activityDate').value = data.activityDate.split('T')[0];
        document.getElementById('activityDuration').value = data.activityDuration;
        document.getElementById('activityId').value = data.activityId;
        document.getElementById('activityType').value = data.activityType;
        document.getElementById('timeSlot').value = data.timeSlot;



    }

    /*updateCalendarUI() {
        let bookingCalendar = document.getElementById("booking-calendar");
        document.getElementById("view").setAttribute("class", "container-fluid")

        try {
            //clear bookings div content
            bookingCalendar.innerHTML = ""

            let clone = cloneHtmlTemplate("template-booking-calendar")

            bookingCalendar.appendChild(clone)

        } catch (error) {
            console.log(error)
        }
    }*/
}
var bookingsRenderer = new BookingsRenderer;
