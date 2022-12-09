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
        this.validateInput();
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
            ['activityId', bowlingId],
            ['name', bowlingData.name],
            ['description', bowlingData.description],
            ['bowlingLaneNr', bowlingData.bowlingLaneNr],
            ['bowlingLaneStatus', bowlingData.bowlingLaneStatus],
            ['timeSlots', [timeSlotDataJS]],
        ]);

        if (document.getElementById("2hour").checked) {
            let timeSlotEntries2Hour = new Map([
                ['timeSlotId', (parseInt(timeSlotId) + 1)]
            ])
            const timeSlotDataJS2Hour = Object.fromEntries(timeSlotEntries2Hour);
            bowling.get("timeSlots").push(timeSlotDataJS2Hour)
        }

        for (let i = 0; i < (bowlingData.timeSlots.length); i++) {
            const element = bowlingData.timeSlots[i];
            console.log(element)
            bowling.get("timeSlots").push(element)
            console.log(bowling.get("timeSlots"))
        }

        // Bowling Data that will get send to patch
        const bowlingDataJS = Object.fromEntries(bowling);
        // Syntax for PATCH
        await utilFetch.operationData("activities/bowling/", bowlingId, bowlingDataJS, "PATCH");
        // CLG
        console.log("Bowling ID: " + bowlingId + ", TimeSlot ID: " + timeSlotId)
        // Get
        this.BowlingTimeSlotData = await utilFetch.operationData("activities/BowlingTimeSlot/", "", "", "GET");
    }


    async createBooking() {
        let bowlingTimeSlotId;
        let email = document.getElementById("email").value;
        let nrOfParticipants = document.getElementById("nrOfParticipants").value

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
            ['nrOfParticipants', nrOfParticipants],
            ['bowlingTimeSlotJoinedTableList', [bowlingTimeSlotJTData]]
        ])

        if (document.getElementById("2hour").checked) {
            let bowlingTimeSlotJT2Hour = new Map([
                ['bowlingTimeSlotJTId', (parseInt(bowlingTimeSlotId) + 1)]
            ])
            const bowlingTimeSlotJTData2Hour = Object.fromEntries(bowlingTimeSlotJT2Hour);
            booking.get("bowlingTimeSlotJoinedTableList").push(bowlingTimeSlotJTData2Hour)
        }

        const bookingData = Object.fromEntries(booking);

        // Syntax for Post
        await utilFetch.operationData("bookings", "", bookingData, "POST");
    }

    //TODO Update booking & Cancel booking

    validateInput() {
        const btnNext = document.getElementById('btnId2');
        btnNext.disabled = true

        const nrOfParticipantsInput = document.querySelector('#nrOfParticipants');
        const activityDateInput = document.querySelector('#activityDate');
        const timeSlotInput = document.querySelector('#timeSlotSelect');

        nrOfParticipantsInput.addEventListener('input', updateValue);
        activityDateInput.addEventListener('input', updateValue);
        timeSlotInput.addEventListener('input', updateValue);

        function updateValue() {
            if ((parseInt(nrOfParticipantsInput.value) <= 8 && (parseInt(nrOfParticipantsInput.value) > 0)) && activityDateInput.value !== "" && timeSlotInput.value !== "") {
                btnNext.disabled = false
            } else {
                btnNext.disabled = true
            }
        }
    }
}
//var bookLane = new BookLane;


