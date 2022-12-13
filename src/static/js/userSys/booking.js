/**
 * Methods:
 * 1. modalBook(id, activityType)
 * 2. activityTimeSlot(activityType)
 * 3. createBookingRefractor(activityType)
 * 4. validateInput()
 */
class Bookings {

    constructor() {
    }

    modalBook(id, activityType) {
        $('#activityId').val(id);
        document.getElementById("activityId").setAttribute("value", id)
        //let options = `<option value="${element.startTime}" id="${"timeSlot" + element.timeSlotId}">${element.startTime}</option>`;

        let modalTitle = document.getElementById("staticBackdropLabel");

        if (activityType == "bowling") {
            modalTitle.innerHTML = "Bowling bane #" + id + ' - Tidspunkt'
        } else if (activityType == "airHockey") {
            modalTitle.innerHTML = "Air hockey table #" + id + ' - Tidspunkt'
        }

        timeSlotRenderer.timeSlotUpdateUI(id, activityType)
        this.validateInput();
    }

    async activityTimeSlot(activityType) {
        this.activityId = document.getElementById("activityId").value
        this.timeSlotId = document.getElementById("timeSlotSelect").value
        let nrOfParticipants = document.getElementById("nrOfParticipants").value
        let activityData = await utilFetch.operationData(`activities/${activityType}/`, this.activityId, "", "GET");
        let activityEntity;

        //console.log("id: " + this.activityId)
        //console.log(activityType)

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

        /**
         * If 2 hour is selected then add the next timeSlotId based on the selected time to activityEntity.
         * (ex. if time 13:00 is the selected on then the time 14:00 should be added too )
         */
        if (document.getElementById("2hour").checked) {
            let timeSlotEntries2Hour = new Map([
                ['timeSlotId', (parseInt(this.timeSlotId) + 1)]
            ])
            const timeSlotDataJS2Hour = Object.fromEntries(timeSlotEntries2Hour);
            activityEntity.get("timeSlots").push(timeSlotDataJS2Hour)
        }

        /**
         * This adds the existing time that are on activity.
         * So it's not gonna override the existing data
         */
        for (let i = 0; i < (activityData.timeSlots.length); i++) {
            const element = activityData.timeSlots[i];
            //console.log(element)
            activityEntity.get("timeSlots").push(element)
            //console.log(activityEntity.get("timeSlots"))
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
            ['airHockeyTimeSlotJoinedTableList', []],
            ['diningTimeSlotJoinedTableList', []]
        ])

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
        //console.log(bookingData)

        // Syntax for Post
        await utilFetch.operationData("booking", "", bookingData, "POST");
        
        $('#bookingModal').modal('hide');
    }

    //TODO Update booking & Cancel booking

    /**
     * This method is for the first modal when booking. (Modal TimeSlot)
     * 
     * It checks if all input er filled out and if so then the "Next" button will not be disabled more.
     */
    validateInput() {
        const btnNext = document.getElementById('btnActivityId');
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