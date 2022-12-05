class BookLane {

    constructor() {
    }

    modalBook(id) {
        //let bowlingId = document.getElementById("bowlingId")
        //bowlingId.value = id;
        //console.log(id)
        $('#bowlingId').val(id);
        document.getElementById("bowlingId").setAttribute("value", id)
        //let options = `<option value="${element.startTime}" id="${"timeSlot" + element.timeSlotId}">${element.startTime}</option>`;

        let modalTitle = document.getElementById("staticBackdropLabel");
        modalTitle.innerHTML = "Bowling bane #" + id + ' - Tidspunkt'

        timeSlotRenderer.timeSlotUpdateUI(id)
    }

    async bowlingTimeSlot() {
        let bowlingId = document.getElementById("bowlingId").value
        let timeSlotId = document.getElementById("timeSlotSelect").value
        let nrOfParticipants = document.getElementById("nrOfParticipants").value
        this.bowlingId = bowlingId;
        this.timeSlotId = timeSlotId;

        if (nrOfParticipants == 0) {
            nrOfParticipants = 1;
        }

        // Syntax for GET Specific
        let bowlingData = await utilFetch.operationData("activities/bowling/", bowlingId, "", "GET");

        let timeSlotEntries = new Map([
            ['timeSlotId', timeSlotId]
        ])
        const timeSlotDataJS = Object.fromEntries(timeSlotEntries);

        const bowling = new Map([
            ['bowlingId', bowlingId],
            ['name', bowlingData.name],
            ['description', bowlingData.description],
            ['nrOfParticipants', nrOfParticipants],
            ['bowlingLaneNr', bowlingData.bowlingLaneNr],
            ['bowlingLaneStatus', bowlingData.bowlingLaneStatus],
            ['timeSlots', [timeSlotDataJS]],
        ]);
        const bowlingDataJS = Object.fromEntries(bowling);

        // Syntax for PATCH
        await utilFetch.operationData("activities/bowling/", bowlingId, bowlingDataJS, "PATCH");
        console.log(bowlingId + ", " + timeSlotId)
        // Get
        this.BowlingTimeSlotData = await utilFetch.operationData("activities/BowlingTimeSlot/", "", "", "GET");
    }


    async createBooking() {
        let bowlingTimeSlotId;
        let email = document.getElementById("email").value;

        for (let i = 0; i < this.BowlingTimeSlotData.length; i++) {
            if (this.BowlingTimeSlotData[i].bowlingId == bookLane.bowlingId && this.BowlingTimeSlotData[i].timeSlotId == bookLane.timeSlotId) {
                bowlingTimeSlotId = this.BowlingTimeSlotData[i].bowlingTimeSlotJTId
            }
        }

        const bowlingTimeSlotJT = new Map([
            ['bowlingTimeSlotJTId', bowlingTimeSlotId]
        ])
        const bowlingTimeSlotJTData = Object.fromEntries(bowlingTimeSlotJT);

        const booking = new Map([
            ['email', email],
            ['activityDate', document.querySelector('input[name="activityDate"]').value],
            ['activityDuration', document.querySelector('input[name="duration"]:checked').value + " time(r)"],
            ['bowlingTimeSlotJoinedTableList', [bowlingTimeSlotJTData]]
        ])
        const bookingData = Object.fromEntries(booking);

        // Syntax for Post
        await utilFetch.operationData("bookings", "", bookingData, "POST");
    }

    //TODO Update booking & Cancel booking
}
var bookLane = new BookLane;


