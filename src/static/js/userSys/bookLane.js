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

        timeSlotRenderer.timeSlotUpdateUI()
    }

    async bowlingTimeSlot() {
        let bowlingId = document.getElementById("bowlingId").value
        let timeSlotId = document.getElementById("timeSlotSelect").value
        let nrOfParticipants = document.getElementById("nrOfParticipants").value

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
    }
}
var bookLane = new BookLane;