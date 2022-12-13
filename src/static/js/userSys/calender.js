class BookingCalendar {
    endpointURL = "http://localhost:8080/api/v1/timeslot/";

    constructor(data) {
        this.data = data;
        //this.fetchData();
        //this.getDayOfWeek();
    }

    updateUI() {
        this.fetchData();
        this.getDayOfWeek();
    }

    //async fetch, await response then call update
    async fetchData() {
        this.data = await utilFetch.operationData('booking/', '', '', 'GET');
        this.dataTimeSlot = await utilFetch.operationData('timeslot/', '', '', 'GET');
        this.calendarApp();
        //console.log(this.data)
        //console.log(this.dataTimeSlot)
    }

    getDayOfWeek() {
        // Days of week, starting on Monday
        var DaysOfWeek = [
            'Man',
            'Tir',
            'Ons',
            'Tor',
            'Fre',
            'Lør',
            'Søn'
        ];

        // Months, stating on January
        var Months = [
            'Januar',
            'Februar',
            'Marts',
            'April',
            'Maj',
            'Juni',
            'Juli',
            'August',
            'September',
            'Oktober',
            'November',
            'December'
        ];

        // Set the current month, year
        var d = new Date();

        this.currMonth = d.getMonth();
        this.currYear = d.getFullYear();
        this.currDay = d.getDate();

        this.showWeekAndFooter(DaysOfWeek, Months);
    }
    showWeekAndFooter(DaysOfWeek, Months) {
        // The footer-date
        var currentDate = new Date();
        document.getElementById('footer-date').innerHTML = 'Det er den ' + currentDate.getDate() + '. ' + Months[currentDate.getMonth()] + ' idag';

        // The days og the week
        var htmlWeekDays = ``;
        // Write the header of the days of the week
        for (var i = 0; i < DaysOfWeek.length; i++) {
            htmlWeekDays += '<span class="cview__header">' + DaysOfWeek[i] + '</span>';
        }
        document.getElementById('weeks-days').innerHTML = htmlWeekDays;
    }

    // Get element by id
    getId(id) {
        return document.getElementById(id);
    }

    setEventsFromFetch() {
        for (let dataIndex in this.data) {
            let entry = this.data[dataIndex];
            const eventEntries = new Map([
                ['name', entry.name],
                ['endTime', new Date(entry.endTime)],
                ['startTime', new Date(entry.startTime)],
                ['day', new Date(entry.day).toString()]
            ]);
            const eventData = Object.fromEntries(eventEntries);
            //this.apts += [{eventData}];
            //this.aptDates += [this.apts[dataIndex].day];
        }
    }

    /**
     * Should fix the order of time when booked 2 hour so it will not be 15:00 & 14:00 but 14:00 & 15:00
     */
    dataTimeSlotOrderFix() {
        try {
            this.data.forEach(async (element) => {
                if (element.bowlingTimeSlotJoinedTableList != "" || element.airHockeyTimeSlotJoinedTableList != "") {
                    element.bowlingTimeSlotJoinedTableList = element.bowlingTimeSlotJoinedTableList.sort((a, b) => (a.timeSlotId > b.timeSlotId) ? 1 : (b.timeSlotId > a.timeSlotId) ? -1 : 0)
                    element.airHockeyTimeSlotJoinedTableList = element.airHockeyTimeSlotJoinedTableList.sort((a, b) => (a.timeSlotId > b.timeSlotId) ? 1 : (b.timeSlotId > a.timeSlotId) ? -1 : 0)
                }
            });
        } catch (error) {
            console.log(error)
        }
    }


    calendarApp(date) {

        this.dataTimeSlotOrderFix()

        if (!(date instanceof Date)) {
            date = new Date();
        }

        this.days = ['Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag', 'Søndag'];
        this.months = ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'];

        this.apts = [];
        this.aptDates = [];

        if (this.data != null) {
            for (let dataIndex in this.data) {
                let entry = this.data[dataIndex];

                let aId;
                let startTimeHour;
                let startTimeMin;
                let endTimeHour;
                let endTimeMin;
                let activityType;
                let activityBookingLaneTable;

                if (entry.bowlingTimeSlotJoinedTableList[0] != null) {
                    activityType = 'Bowling'
                    for (let i = 0; i < entry.bowlingTimeSlotJoinedTableList.length; i++) {
                        aId = entry.bowlingTimeSlotJoinedTableList[i].bowlingId
                        if (entry.bowlingTimeSlotJoinedTableList.length > 1) {
                            startTimeHour = bookingCalendar.dataTimeSlot[entry.bowlingTimeSlotJoinedTableList[0].timeSlotId].startTime.split(":")[0] - 1
                            startTimeMin = bookingCalendar.dataTimeSlot[entry.bowlingTimeSlotJoinedTableList[0].timeSlotId].startTime.split(":")[1]
                            endTimeHour = bookingCalendar.dataTimeSlot[entry.bowlingTimeSlotJoinedTableList[i].timeSlotId].endTime.split(":")[0] - 1
                            endTimeMin = bookingCalendar.dataTimeSlot[entry.bowlingTimeSlotJoinedTableList[i].timeSlotId].endTime.split(":")[1]
                        } else if (entry.bowlingTimeSlotJoinedTableList.length === 1) {
                            startTimeHour = bookingCalendar.dataTimeSlot[entry.bowlingTimeSlotJoinedTableList[0].timeSlotId].startTime.split(":")[0] - 1
                            startTimeMin = bookingCalendar.dataTimeSlot[entry.bowlingTimeSlotJoinedTableList[0].timeSlotId].startTime.split(":")[1]
                            endTimeHour = bookingCalendar.dataTimeSlot[entry.bowlingTimeSlotJoinedTableList[0].timeSlotId].endTime.split(":")[0] - 1
                            endTimeMin = bookingCalendar.dataTimeSlot[entry.bowlingTimeSlotJoinedTableList[0].timeSlotId].endTime.split(":")[1]
                        }
                        // activityBookingLaneTable = 'Bane: ' + aId;
                        activityBookingLaneTable =
                            `<tr>
                                <th>Bane</th>
                                <td>${aId}</td>
                            </tr>`;
                    }
                } else if (entry.airHockeyTimeSlotJoinedTableList[0] != null) {
                    activityType = 'Air Hockey'
                    aId = entry.airHockeyTimeSlotJoinedTableList[0].airHockeyId
                    startTimeHour = bookingCalendar.dataTimeSlot[entry.airHockeyTimeSlotJoinedTableList[0].timeSlotId].startTime.split(":")[0] - 1
                    startTimeMin = bookingCalendar.dataTimeSlot[entry.airHockeyTimeSlotJoinedTableList[0].timeSlotId].startTime.split(":")[1]
                    endTimeHour = bookingCalendar.dataTimeSlot[entry.airHockeyTimeSlotJoinedTableList[0].timeSlotId].endTime.split(":")[0] - 1
                    endTimeMin = bookingCalendar.dataTimeSlot[entry.airHockeyTimeSlotJoinedTableList[0].timeSlotId].endTime.split(":")[1]
                    // activityBookingLaneTable = 'Bord: ' + aId;
                    activityBookingLaneTable =
                        `<tr>
                            <th>Bord</th>
                            <td>${aId}</td>
                        </tr>`;
                } else if (entry.diningTimeSlotJoinedTableList[0] != null) {
                    activityType = 'Restaurant'
                    aId = entry.diningTimeSlotJoinedTableList[0].diningId
                    startTimeHour = bookingCalendar.dataTimeSlot[entry.diningTimeSlotJoinedTableList[0].timeSlotId].startTime.split(":")[0] - 1
                    startTimeMin = bookingCalendar.dataTimeSlot[entry.diningTimeSlotJoinedTableList[0].timeSlotId].startTime.split(":")[1]
                    endTimeHour = bookingCalendar.dataTimeSlot[entry.diningTimeSlotJoinedTableList[0].timeSlotId].endTime.split(":")[0] - 1
                    endTimeMin = bookingCalendar.dataTimeSlot[entry.diningTimeSlotJoinedTableList[0].timeSlotId].endTime.split(":")[1]
                    activityBookingLaneTable = ''//'Bord: ' + aId;
                }

                let htmlFormat =
                    `<div class="table-responsive pt-2">
                        <table class="table table-striped table-bordered table-hover border-dark table-success shadow">
                            <tr>
                                <th>E-mail</th>
                                <td>${entry.email}</td>
                            </tr>
                            <tr>
                                <th>Aktivitet</th>
                                <td>${activityType}</td>
                            </tr>
                            ${activityBookingLaneTable}
                            <tr>
                                <th>Antal deltagere</th>
                                <td>${entry.nrOfParticipants}</td>
                            </tr>
                        </table> 
                    </div>`;
                const eventEntries = new Map([
                    //['name', "Email: " + entry.email + "<br>" + "Activitet: " + activityType + "<br>" + activityBookingLaneTable],
                    ['name', htmlFormat],
                    //['endTime', new Date(2022, 11, 5, 12)],
                    //['startTime', new Date(2022, 11, 5, 11)],
                    //['endTime', new Date(entry.activityDate.split("-")[0], (entry.activityDate.split("-")[1]-1), entry.activityDate.split("-")[2].split("T")[0], dutySchedule.dataTimeSlot[entry.bowlingTimeSlotJoinedTableList[0].timeSlotId].endTime.split(":")[0], dutySchedule.dataTimeSlot[entry.bowlingTimeSlotJoinedTableList[0].timeSlotId].endTime.split(":")[1])],
                    ['endTime', new Date(entry.activityDate.split("-")[0], (entry.activityDate.split("-")[1] - 1), entry.activityDate.split("-")[2].split("T")[0], endTimeHour, endTimeMin)],
                    ['startTime', new Date(entry.activityDate.split("-")[0], (entry.activityDate.split("-")[1] - 1), entry.activityDate.split("-")[2].split("T")[0], startTimeHour, startTimeMin)],
                    ['day', new Date(entry.activityDate.split("-")[0], (entry.activityDate.split("-")[1] - 1), entry.activityDate.split("-")[2].split("T")[0]).toString()]
                ]);
                const eventData = Object.fromEntries(eventEntries);
                this.apts.push(eventData);
                this.aptDates.push(this.apts[dataIndex].day);
            }
        }

        /*this.apts = [
            {
                name: 'Finish this web app',
                endTime: new Date(2022, 9, 15, 11),
                startTime: new Date(2022, 9, 15, 10),
                day: new Date(2022, 9, 15).toString()
            }, eventData
        ];
        this.aptDates = [this.apts[0].day, this.apts[1].day];*/

        this.eles = {};

        this.calDaySelected = null;

        this.calendar = document.getElementById("calendar-app");
        this.calendarView = document.getElementById("dates");
        this.calendarMonthDiv = document.getElementById("calendar-month");
        this.calendarMonthLastDiv = document.getElementById("calendar-month-last");
        this.calendarMonthNextDiv = document.getElementById("calendar-month-next");
        this.todayIsSpan = document.getElementById("footer-date");
        this.dayViewEle = document.getElementById("day-view");
        this.dayViewExitEle = document.getElementById("day-view-exit");
        this.dayViewDateEle = document.getElementById("day-view-date");
        this.addDayEventEle = document.getElementById("add-event");
        this.dayEventsEle = document.getElementById("day-events");

        this.dayEventAddForm = {
            cancelBtn: document.getElementById("add-event-cancel"),
            addBtn: document.getElementById("add-event-save"),
            nameEvent: document.getElementById("input-add-event-name"),
            startTime: document.getElementById("input-add-event-start-time"),
            endTime: document.getElementById("input-add-event-end-time"),
            startAMPM: document.getElementById("input-add-event-start-ampm"),
            endAMPM: document.getElementById("input-add-event-end-ampm")
        };

        this.dayEventsList = document.getElementById("day-events-list");
        this.dayEventBoxEle = document.getElementById("add-day-event-box");

        /* Start the app */
        this.showView(date);
        this.addEventListeners();
    }

    addEventListeners() {
        this.calendar.addEventListener("click", this.mainCalendarClickClose.bind(this));
        this.todayIsSpan.addEventListener("click", this.showView.bind(this));
        this.calendarMonthLastDiv.addEventListener("click", this.showNewMonth.bind(this));
        this.calendarMonthNextDiv.addEventListener("click", this.showNewMonth.bind(this));
        this.dayViewExitEle.addEventListener("click", this.closeDayWindow.bind(this));
        this.dayViewDateEle.addEventListener("click", this.showNewMonth.bind(this));
        this.addDayEventEle.addEventListener("click", this.addNewEventBox.bind(this));
        this.dayEventAddForm.cancelBtn.addEventListener("click", this.closeNewEventBox.bind(this));
        this.dayEventAddForm.cancelBtn.addEventListener("keyup", this.closeNewEventBox.bind(this));

        this.dayEventAddForm.startTime.addEventListener("keyup", this.inputChangeLimiter.bind(this));
        this.dayEventAddForm.startAMPM.addEventListener("keyup", this.inputChangeLimiter.bind(this));
        this.dayEventAddForm.endTime.addEventListener("keyup", this.inputChangeLimiter.bind(this));
        this.dayEventAddForm.endAMPM.addEventListener("keyup", this.inputChangeLimiter.bind(this));
        this.dayEventAddForm.addBtn.addEventListener("click", this.saveAddNewEvent.bind(this));
    };

    showView(date) {
        if (!date || (!(date instanceof Date))) date = new Date();
        var now = new Date(date),
            y = now.getFullYear(),
            m = now.getMonth();
        var today = new Date();

        var lastDayOfM = new Date(y, m + 1, 0).getDate();
        var startingD = new Date(y, m, 1).getDay();
        var lastM = new Date(y, now.getMonth() - 1, 1);
        var nextM = new Date(y, now.getMonth() + 1, 1);

        this.calendarMonthDiv.classList.remove("cview__month-activate");
        this.calendarMonthDiv.classList.add("cview__month-reset");

        while (this.calendarView.firstChild) {
            this.calendarView.removeChild(this.calendarView.firstChild);
        }

        // build up spacers
        for (var x = 1; x < startingD; x++) {
            var spacer = document.createElement("div");
            spacer.className = "cview--spacer";
            this.calendarView.appendChild(spacer);
        }

        for (var z = 1; z <= lastDayOfM; z++) {
            var _date = new Date(y, m, z);
            var day = document.createElement("div");
            day.className = "cview--date";
            day.textContent = z;
            day.setAttribute("data-date", _date);
            day.onclick = this.showDay.bind(this);

            // check if todays date
            if (z == today.getDate() && y == today.getFullYear() && m == today.getMonth()) {
                day.classList.add("today");
            }

            // check if has events to show
            if (this.aptDates.indexOf(_date.toString()) !== -1) {
                day.classList.add("has-events");
            }

            this.calendarView.appendChild(day);
        }

        var _that = this;
        setTimeout(function () {
            _that.calendarMonthDiv.classList.add("cview__month-activate");
        }, 50);

        this.calendarMonthDiv.textContent = this.months[now.getMonth()] + " " + now.getFullYear();
        this.calendarMonthDiv.setAttribute("data-date", now);


        this.calendarMonthLastDiv.textContent = "← " + this.months[lastM.getMonth()];
        this.calendarMonthLastDiv.setAttribute("data-date", lastM);

        this.calendarMonthNextDiv.textContent = this.months[nextM.getMonth()] + " →";
        this.calendarMonthNextDiv.setAttribute("data-date", nextM);
    }

    showDay(e, dayEle) {
        e.stopPropagation();
        if (!dayEle) {
            dayEle = e.currentTarget;
        }
        var dayDate = new Date(dayEle.getAttribute('data-date'));

        this.calDaySelected = dayEle;

        this.openDayWindow(dayDate);
    };

    openDayWindow(date) {
        var now = new Date();
        var day = new Date(date);
        this.dayViewDateEle.textContent = this.days[day.getDay()] + ", " +
            this.months[day.getMonth()] + " " +
            day.getDate() + ", " +
            day.getFullYear();
        this.dayViewDateEle.setAttribute('data-date', day);
        this.dayViewEle.classList.add("calendar--day-view-active");

        /* Contextual lang changes based on tense. Also show btn for scheduling future events */
        var _dayTopbarText = '';
        if (day < new Date(now.getFullYear(), now.getMonth(), now.getDate())) {
            _dayTopbarText = "var ";
            this.addDayEventEle.style.display = "none";
        } else {
            _dayTopbarText = "er ";
            this.addDayEventEle.style.display = "inline";
        }
        this.addDayEventEle.setAttribute("data-date", day);

        var eventsToday = this.showEventsByDay(day);
        if (!eventsToday) {
            _dayTopbarText += "ingen ";
        } else {
            _dayTopbarText += eventsToday.length + " ";
        }
        while (this.dayEventsList.firstChild) {
            this.dayEventsList.removeChild(this.dayEventsList.firstChild);
        }

        this.dayEventsList.appendChild(this.showEventsCreateElesView(eventsToday));

        this.dayEventsEle.textContent = _dayTopbarText + "events den " +
            day.getDate() + ". " +
            this.months[day.getMonth()] + ", " +
            day.getFullYear();
    };

    showEventsCreateElesView(events) {
        var ul = document.createElement("ul");
        ul.className = 'day-event-list-ul';
        events = this.sortEventsByTime(events);
        var _this = this;
        events.forEach(function (event) {
            var _start = new Date(event.startTime);
            var _end = new Date(event.endTime);
            var idx = event.index;
            var li = document.createElement("li");
            li.className = "event-dates";
            // li.innerHtml
            var html = "<span class='start-time'>" +
                _start.toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' }) +
                "</span> <small>til</small> ";
            html += "<span class='end-time'>" +
                _end.toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' }) +
                ((_end.getDate() != _start.getDate()) ? ' <small>on ' +
                    _end.toLocaleDateString() +
                    "</small>" : '') +
                "</span>";

            html += "<span class='event-name'>" + event.name + "</span>";

            var div = document.createElement("div");
            div.className = "event-dates";
            div.innerHTML = html;

            var deleteBtn = document.createElement("span");
            var deleteText = document.createTextNode("delete");
            deleteBtn.className = "event-delete";
            deleteBtn.setAttribute("data-idx", idx);
            deleteBtn.appendChild(deleteText);
            deleteBtn.onclick = _this.deleteEvent.bind(_this);

            div.appendChild(deleteBtn);

            li.appendChild(div);
            ul.appendChild(li);
        });
        return ul;
    };

    deleteEvent(e) {
        if (this.confirmDelete()) {
            //Remove deleted element from UI
            var deleted = this.apts.splice(e.currentTarget.getAttribute("data-idx"), 1);
            var deletedDate = new Date(deleted[0].day);
            var anyDatesLeft = this.showEventsByDay(deletedDate);
            if (anyDatesLeft === false) {
                // safe to remove from array
                var idx = this.aptDates.indexOf(deletedDate.toString());
                // Delete booking
                utilFetch.operationData("booking/", (idx + 1), "", "DELETE");

                if (idx >= 0) {
                    this.aptDates.splice(idx, 1);
                    // remove dot from calendar view
                    var ele = document.querySelector('.cview--date[data-date="' + deletedDate.toString() + '"]');
                    if (ele) {
                        ele.classList.remove("has-events");
                    }
                }
            }
            this.openDayWindow(deletedDate);
            console.log('Delete was successful');
        } else {
            console.log('Delete was cancelled');
        }
    };

    //Confirm prompt
    confirmDelete() {
        return confirm('Er du sikker på du vil slette?');
    }

    sortEventsByTime(events) {
        if (!events) return [];
        return events.sort(function compare(a, b) {
            if (new Date(a.startTime) < new Date(b.startTime)) {
                return -1;
            }
            if (new Date(a.startTime) > new Date(b.startTime)) {
                return 1;
            }
            // a must be equal to b
            return 0;
        });
    };

    showEventsByDay(day) {
        var _events = [];
        this.apts.forEach(function (apt, idx) {
            if (day.toString() == apt.day.toString()) {
                apt.index = idx;
                _events.push(apt);
            }
        });
        return (_events.length) ? _events : false;
    };


    closeDayWindow() {
        this.dayViewEle.classList.remove("calendar--day-view-active");
        this.closeNewEventBox();
    };

    mainCalendarClickClose(e) {
        if (e.currentTarget != e.target) {
            return;
        }

        this.dayViewEle.classList.remove("calendar--day-view-active");
        this.closeNewEventBox();
    };

    addNewEventBox(e) {
        var target = e.currentTarget;
        this.dayEventBoxEle.setAttribute("data-active", "true");
        this.dayEventBoxEle.setAttribute("data-date", target.getAttribute("data-date"));

    };

    closeNewEventBox(e) {
        if (e && e.keyCode && e.keyCode != 13) return false;

        this.dayEventBoxEle.setAttribute("data-active", "false");
        // reset values
        this.resetAddEventBox();
    };

    saveAddNewEvent() {
        var saveErrors = this.validateAddEventInput();
        if (!saveErrors) {
            this.addEvent();
        }
    };

    addEvent() {
        var name = this.dayEventAddForm.nameEvent.value.trim();
        var dayOfDate = this.dayEventBoxEle.getAttribute("data-date");
        var dateObjectDay = new Date(dayOfDate);
        var cleanDates = this.cleanEventTimeStampDates();

        const dutyScheduleEntries = new Map([
            ['name', name],
            ['day', dateObjectDay],
            ['startTime', cleanDates[0]],
            ['endTime', cleanDates[1]]
        ]);
        const dutyScheduleData = Object.fromEntries(dutyScheduleEntries);
        utilFetch.operationData('dutySchedules', dutyScheduleData, '', 'POST');

        this.apts.push({
            name: name,
            day: dateObjectDay,
            startTime: cleanDates[0],
            endTime: cleanDates[1]
        });
        this.closeNewEventBox();
        this.openDayWindow(dayOfDate);
        this.calDaySelected.classList.add("has-events");
        // add to dates
        if (this.aptDates.indexOf(dateObjectDay.toString()) === -1) {
            this.aptDates.push(dateObjectDay.toString());
        }
    };

    convertTo23HourTime(stringOfTime, AMPM) {
        // convert to 0 - 23 hour time
        var mins = stringOfTime.split(":");
        var hours = stringOfTime.trim();
        if (mins[1] && mins[1].trim()) {
            hours = parseInt(mins[0].trim());
            mins = parseInt(mins[1].trim());
        } else {
            hours = parseInt(hours);
            mins = 0;
        }
        hours = (AMPM == 'am') ? ((hours == 12) ? 0 : hours) : (hours <= 11) ? parseInt(hours) + 12 : hours;
        return [hours, mins];
    };


    cleanEventTimeStampDates() {
        var startTime = this.dayEventAddForm.startTime.value.trim() || this.dayEventAddForm.startTime.getAttribute("placeholder") || '8';
        var startAMPM = this.dayEventAddForm.startAMPM.value.trim() || this.dayEventAddForm.startAMPM.getAttribute("placeholder") || 'am';
        startAMPM = (startAMPM == 'a') ? startAMPM + 'm' : startAMPM;
        var endTime = this.dayEventAddForm.endTime.value.trim() || this.dayEventAddForm.endTime.getAttribute("placeholder") || '9';
        var endAMPM = this.dayEventAddForm.endAMPM.value.trim() || this.dayEventAddForm.endAMPM.getAttribute("placeholder") || 'pm';
        endAMPM = (endAMPM == 'p') ? endAMPM + 'm' : endAMPM;
        var date = this.dayEventBoxEle.getAttribute("data-date");

        var startingTimeStamps = this.convertTo23HourTime(startTime, startAMPM);
        var endingTimeStamps = this.convertTo23HourTime(endTime, endAMPM);

        var dateOfEvent = new Date(date);
        var startDate = new Date(dateOfEvent.getFullYear(), dateOfEvent.getMonth(), dateOfEvent.getDate(), startingTimeStamps[0], startingTimeStamps[1]);
        var endDate = new Date(dateOfEvent.getFullYear(), dateOfEvent.getMonth(), dateOfEvent.getDate(), endingTimeStamps[0], endingTimeStamps[1]);

        // if end date is less than start date - set end date back another day
        if (startDate > endDate) endDate.setDate(endDate.getDate() + 1);

        return [startDate, endDate];
    };

    validateAddEventInput() {
        var _errors = false;
        var name = this.dayEventAddForm.nameEvent.value.trim();
        var startTime = this.dayEventAddForm.startTime.value.trim();
        var startAMPM = this.dayEventAddForm.startAMPM.value.trim();
        var endTime = this.dayEventAddForm.endTime.value.trim();
        var endAMPM = this.dayEventAddForm.endAMPM.value.trim();

        if (!name || name == null) {
            _errors = true;
            this.dayEventAddForm.nameEvent.classList.add("add-event-edit--error");
            this.dayEventAddForm.nameEvent.focus();
        } else {
            this.dayEventAddForm.nameEvent.classList.remove("add-event-edit--error");
        }

        return _errors;
    };

    inputChangeLimiter(ele) {
        timeOut = null;
        activeEle = null;
        if (ele.currentTarget) {
            ele = ele.currentTarget;
        }
        if (timeOut && ele == activeEle) {
            clearTimeout(timeOut);
        }

        var limiter = this.textOptionLimiter;

        var _options = ele.getAttribute("data-options").split(",");
        var _format = ele.getAttribute("data-format") || 'text';
        timeOut = setTimeout(function () {
            ele.value = limiter(_options, ele.value, _format);
        }, 600);
        activeEle = ele;
    };

    resetAddEventBox() {
        this.dayEventAddForm.nameEvent.value = '';
        this.dayEventAddForm.nameEvent.classList.remove("add-event-edit--error");
        this.dayEventAddForm.endTime.value = '';
        this.dayEventAddForm.startTime.value = '';
        this.dayEventAddForm.endAMPM.value = '';
        this.dayEventAddForm.startAMPM.value = '';
    };

    showNewMonth(e) {
        var date = e.currentTarget.dataset.date;
        var newMonthDate = new Date(date);
        this.showView(newMonthDate);
        this.closeDayWindow();
        return true;
    };

}

var bookingCalendar = new BookingCalendar();
