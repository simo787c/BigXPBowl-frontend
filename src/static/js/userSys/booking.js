class Bookings {

    constructor() {
    }

    modalBook(id) {
        $('#activityId').val(id);
        document.getElementById("activityId").setAttribute("value", id)
        //let options = `<option value="${element.startTime}" id="${"timeSlot" + element.timeSlotId}">${element.startTime}</option>`;

        let modalTitle = document.getElementById("staticBackdropLabel");
        modalTitle.innerHTML = "Bowling bane #" + id + ' - Tidspunkt'

        timeSlotRenderer.timeSlotUpdateUI(id)
        this.validateInput();
    }

    async activityTimeSlot(activityType) {
        this.activityId = document.getElementById("activityId").value
        this.timeSlotId = document.getElementById("timeSlotSelect").value
        let nrOfParticipants = document.getElementById("nrOfParticipants").value
        let activityData = await utilFetch.operationData(`activities/${activityType}/`, this.activityId, "", "GET");
        let activityEntity;

        console.log("id: " + this.activityId)
        console.log(activityType)

        if (nrOfParticipants == 0) {
            nrOfParticipants = 1;
        }

        let timeSlotEntries = new Map([
            ['timeSlotId', this.timeSlotId]
        ])
        const timeSlotDataJS = Object.fromEntries(timeSlotEntries);

        if (activityType == "bowling") {
            activityEntity = new Map([
                ['activityId', this.activityId],
                ['name', activityData.name],
                ['description', activityData.description],
                ['bowlingLaneNr', activityData.bowlingLaneNr],
                ['bowlingLaneStatus', activityData.bowlingLaneStatus],
                ['timeSlots', [timeSlotDataJS]],
            ]);
        } else if (activityType == "airHockey") {
            activityEntity = new Map([
                ['activityId', this.activityId],
                ['name', activityData.name],
                ['description', activityData.description],
                ['airHockeyTableNr', activityData.airHockeyTableNr],
                ['airHockeyTableStatus', activityData.airHockeyTableStatus],
                ['timeSlots', [timeSlotDataJS]],
            ]);
        }

        if (document.getElementById("2hour").checked) {
            let timeSlotEntries2Hour = new Map([
                ['timeSlotId', (parseInt(this.timeSlotId) + 1)]
            ])
            const timeSlotDataJS2Hour = Object.fromEntries(timeSlotEntries2Hour);
            activityEntity.get("timeSlots").push(timeSlotDataJS2Hour)
        }

        console.log("Test: " + activityData.activityId)
        for (let i = 0; i < (activityData.timeSlots.length); i++) {
            const element = activityData.timeSlots[i];
            console.log(element)
            activityEntity.get("timeSlots").push(element)
            console.log(activityEntity.get("timeSlots"))
        }

        // Bowling Data that will get send to patch
        const activityDataJT = Object.fromEntries(activityEntity);
        // Syntax for PATCH
        await utilFetch.operationData(`activities/${activityType}/`, this.activityId, activityDataJT, "PATCH");
        // GET
        if (activityType == "bowling") {
            this.bowlingTimeSlotData = await utilFetch.operationData("activities/BowlingTimeSlot/", "", "", "GET");
        } else if (activityType == "airHockey") {
            this.airHockeyTimeSlotData = await utilFetch.operationData("activities/AirHockeyTimeSlot/", "", "", "GET");
        }
        // CLG
        console.log("Activity ID: " + this.activityId + "\nTimeSlot ID: " + this.timeSlotId)
    }

    async createBookingRefractor(activityType) {
        let activityTimeSlotId;
        let email = document.getElementById("email").value;
        let nrOfParticipants = document.getElementById("nrOfParticipants").value
        let activityTimeSlotJT;
        let activityTimeSlotJTData;
        const booking = new Map([
            ['email', email],
            ['activityDate', document.querySelector('input[name="activityDate"]').value],
            ['activityDuration', document.querySelector('input[name="duration"]:checked').value + " time(r)"],
            ['nrOfParticipants', nrOfParticipants],
            ['bowlingTimeSlotJoinedTableList', []],
            ['airHockeyTimeSlotJoinedTableList', []]
        ])

        console.log(this.airHockeyTimeSlotData)
        if (activityType == "bowling") {
            for (let i = 0; i < this.bowlingTimeSlotData.length; i++) {
                if (this.bowlingTimeSlotData[i].bowlingId == bookings.activityId && this.bowlingTimeSlotData[i].timeSlotId == bookings.timeSlotId) {
                    activityTimeSlotId = this.bowlingTimeSlotData[i].bowlingTimeSlotJTId
                }
            }

            activityTimeSlotJT = new Map([
                ['bowlingTimeSlotJTId', activityTimeSlotId]
            ])
            activityTimeSlotJTData = Object.fromEntries(activityTimeSlotJT)
            booking.get('bowlingTimeSlotJoinedTableList').push(activityTimeSlotJTData)

            if (document.getElementById("2hour").checked) {
                let activityTimeSlotJT2Hour = new Map([
                    ['bowlingTimeSlotJTId', (parseInt(activityTimeSlotId) + 1)]
                ])
                const activityTimeSlotJTData2Hour = Object.fromEntries(activityTimeSlotJT2Hour);
                booking.get("bowlingTimeSlotJoinedTableList").push(activityTimeSlotJTData2Hour)
            }
        } else if (activityType == "airHockey") {
            for (let i = 0; i < this.airHockeyTimeSlotData.length; i++) {
                if (this.airHockeyTimeSlotData[i].airHockeyId == bookings.activityId && this.airHockeyTimeSlotData[i].timeSlotId == bookings.timeSlotId) {
                    activityTimeSlotId = this.airHockeyTimeSlotData[i].airHockeyTimeSlotJTId
                }
            }

            console.log("Timeslot id: " + activityTimeSlotId)
            activityTimeSlotJT = new Map([
                ['airHockeyTimeSlotJTId', activityTimeSlotId]
            ])
            activityTimeSlotJTData = Object.fromEntries(activityTimeSlotJT)
            booking.get('airHockeyTimeSlotJoinedTableList').push(activityTimeSlotJTData)

            if (document.getElementById("2hour").checked) {
                let activityTimeSlotJT2Hour = new Map([
                    ['airHockeyTimeSlotJTId', (parseInt(activityTimeSlotId) + 1)]
                ])
                const activityTimeSlotJTData2Hour = Object.fromEntries(activityTimeSlotJT2Hour);
                booking.get("airHockeyTimeSlotJoinedTableList").push(activityTimeSlotJTData2Hour)
            }
        }

        const bookingData = Object.fromEntries(booking);
        console.log(bookingData)

        // Syntax for Post
        await utilFetch.operationData("bookings", "", bookingData, "POST");
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
        const btnNext = document.getElementById('BtnActivityId');
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
var bookings = new Bookings();


