/**
 * This class contains these method:
 * 1. updateUI()
 * 2. initializeSchedule()
 * 3. isValidAppointment(component, appointmentData)
 * 4. isValidAppointmentInterval(startDate, endDate, cellDuration)
 * 5. isValidAppointmentDate(date)
 * 6. isHoliday(date)
 * 7. isDisableDate(date)
 * 8. createSchedule(shift)
 * 9. updateSchedule(e)
 * 10. deleteSchedule(e)
 *      - confirmDelete()
 */
class ScheduleRenderer {

    constructor() {
        this.data = []
        /*this.data = [
            {
                text: "Website Re-Design Plan",
                startDate: new Date(2022, 11, 15, 9, 30),
                endDate: new Date(2022, 11, 15, 11, 30),
                shift: 3
            }, {
                text: "Install New Router in Dev Room",
                startDate: new Date(2022, 11, 16, 10, 0),
                endDate: new Date(2022, 11, 16, 16, 0),
                shift: 6
            }
        ];*/
        //this.updateUI();
    }

    async updateUI() {

        // Syntax for Get
        let scheduleData = await utilFetch.operationData("schedule", "", "", "GET");
        this.employeeData = await utilFetch.operationData("employee", "", "", "GET");

        console.log(scheduleData)
        try {
            //iterate through each lane, then clone and assign a htmltemplate for it
            scheduleData.forEach(element => {
                let scheduleDateAndTime = element.startDate.split("T")
                let scheduleDate = scheduleDateAndTime[0].split("-")
                let scheduleTime = scheduleDateAndTime[1].split(":")
                let shiftLength = element.shiftLength;

                for (let i = 0; i < element.employees.length; i++) {
                    this.data.push({
                        id: element.id,
                        text: element.employees[i].department + " " + element.employees[i].title + " - " + element.employees[i].name,
                        employeeId: element.employees[i].employeeId,
                        startDate: new Date(scheduleDate[0], (scheduleDate[1] - 1), scheduleDate[2], (parseInt(scheduleTime[0]) + 1), scheduleTime[1]),
                        endDate: new Date(scheduleDate[0], (scheduleDate[1] - 1), scheduleDate[2], (parseInt(scheduleTime[0]) + 1 + shiftLength), scheduleTime[1]),
                        shift: element.shiftLength
                    })
                }
            });

        } catch (error) {
            console.log(error)
        }

        this.initializeSchedule();
    }

    initializeSchedule() {
        const dayOfWeekNames = ['Søn', 'Man', 'Tirs', 'Ons', 'Tors', 'Fre', 'Lør'];
        const dateCellTemplate = function (cellData, index, container) {
            container.append(
                $('<div />')
                    .addClass('name')
                    .text(dayOfWeekNames[cellData.date.getDay()]),
            );
        };

        const shiftLengths = [{
            id: 1,
            shiftLength: '1 time'
        },
        {
            id: 2,
            shiftLength: '2 timer'
        },
        {
            id: 3,
            shiftLength: '3 timer'
        },
        {
            id: 4,
            shiftLength: '4 timer'
        },
        {
            id: 5,
            shiftLength: '5 timer'
        },
        {
            id: 6,
            shiftLength: '6 timer'
        },
        {
            id: 7,
            shiftLength: '7 timer'
        },
        {
            id: 8,
            shiftLength: '8 timer'
        }]

        DevExpress.viz.currentTheme("generic.light");
        $(function () {
            function showToast(event, value, type) {
                DevExpress.ui.notify(`${event} "${value}" task`, type, 1000);
            }
            $("#scheduler").dxScheduler({
                dataSource: scheduleRenderer.data,
                currentDate: new Date(),
                views: [
                    { type: "agenda", name: "Dag", dateCellTemplate },
                    {
                        type: "week",
                        name: "Uge",
                        startDayHour: 9,
                        endDayHour: 23,
                        cellDuration: 30,
                        width: "auto",
                        dateCellTemplate,
                    },
                    { type: "month", name: "Måned", dateCellTemplate }],
                currentView: "week",
                //height: 600,
                width: 660,
                //useDropDownViewSwitcher: true,
                showAllDayPanel: false,
                remoteFiltering: true,
                showCurrentTimeIndicator: true,
                crossScrollingEnabled: true,
                firstDayOfWeek: 1,
                maxAppointmentsPerCell: 'auto',
                editing: {
                    allowAdding: true,
                    allowDeleting: true,
                    allowDragging: false,
                    allowResizing: false,
                    allowUpdating: true
                },
                resources: [{
                    fieldExpr: 'id',
                    dataSource: scheduleRenderer.employeeData,
                    useColorAsDefault: true,
                    label: 'id',
                }],
                onAppointmentFormCreated: function (data) {
                    //console.log("Open Create")
                    const { form } = data;
                    let { startDate } = data.appointmentData;

                    form.option('items',
                        [{
                            //dataField: 'id',
                            editorOptions: {
                                items: scheduleRenderer.data,
                                displayExpr: 'id',
                                valueExpr: 'id',
                            },
                        }, {
                            label: {
                                text: 'Navn',
                            },
                            editorType: 'dxSelectBox',
                            dataField: 'employeeId',
                            editorOptions: {
                                items: scheduleRenderer.employeeData,
                                displayExpr: 'name',
                                valueExpr: 'employeeId',
                            },
                        }, {
                            dataField: 'startDate',
                            label: {
                                text: 'Vagt start',
                            },
                            editorType: 'dxDateBox',
                            editorOptions: {
                                width: '100%',
                                type: 'datetime',
                                onValueChanged(args) {
                                    startDate = args.value;
                                },
                            },
                        }, {
                            name: 'shift',
                            dataField: 'shift',
                            label: {
                                text: 'Vagt længde',
                            },
                            editorType: 'dxSelectBox',
                            editorOptions: {
                                items: shiftLengths,
                                displayExpr: 'shiftLength',
                                valueExpr: 'id',
                            },
                        }]);
                },
                onAppointmentAdding(e) {
                    console.log("ADD")
                    if (!scheduleRenderer.isValidAppointment(e.component, e.appointmentData)) {
                        e.cancel = true;
                        notifyDisableDate();
                    }
                    let startDateDDMMYYYY = e.appointmentData.startDate.toLocaleDateString().split(".")
                    //console.log("Dag: " + startDateDDMMYYYY[0] + ", Måned: " + startDateDDMMYYYY[1] + ", År: " + startDateDDMMYYYY[2])
                    e.appointmentData.endDate = new Date(startDateDDMMYYYY[2], (startDateDDMMYYYY[1] - 1), startDateDDMMYYYY[0], (e.appointmentData.startDate.getHours() + e.appointmentData.shift), e.appointmentData.startDate.getMinutes())
                    //console.log(e.appointmentData.endDate)
                    scheduleRenderer.createSchedule(e.appointmentData);
                },
                onAppointmentAdded(e) {
                    showToast('Added', e.appointmentData.text, 'success');
                },
                onAppointmentUpdating(e) {
                    // Handler of the "appointmentUpdating" event
                    scheduleRenderer.updateSchedule(e.newData)
                },
                onAppointmentUpdated(e) {
                    // Handler of the "appointmentUpdated" event
                    showToast('Updated', e.appointmentData.text, 'info');
                },
                onAppointmentDeleted(e) {
                    showToast('Deleted', e.appointmentData.text, 'warning');
                },
                onAppointmentDeleting(e) {
                    scheduleRenderer.deleteSchedule(e);
                },
            }).dxScheduler("instance");
        });
    }

    isValidAppointment(component, appointmentData) {
        const startDate = new Date(appointmentData.startDate);
        const endDate = new Date(appointmentData.endDate);
        const cellDuration = component.option('cellDuration');
        return scheduleRenderer.isValidAppointmentInterval(startDate, endDate, cellDuration);
    }

    isValidAppointmentInterval(startDate, endDate, cellDuration) {
        const edgeEndDate = new Date(endDate.getTime() - 1);

        if (!scheduleRenderer.isValidAppointmentDate(edgeEndDate)) {
            return false;
        }

        const durationInMs = cellDuration * 60 * 1000;
        const date = startDate;
        while (date <= endDate) {
            if (!scheduleRenderer.isValidAppointmentDate(date)) {
                return false;
            }
            const newDateTime = date.getTime() + durationInMs - 1;
            date.setTime(newDateTime);
        }

        return true;
    }

    isValidAppointmentDate(date) {
        return !scheduleRenderer.isHoliday(date);
    }

    isHoliday(date) {
        const holidays = [
            new Date(2021, 3, 29),
            new Date(2021, 5, 6),
        ];
        const localeDate = date.toLocaleDateString();
        return holidays.filter((holiday) => holiday.toLocaleDateString() === localeDate).length > 0;
    }

    isDisableDate(date) {
        return isHoliday(date);
    }

    async createSchedule(shift) {
        /*var timeStart = shift.startDate.getHours();
        var timeEnd = shift.endDate.getHours();
        var hourDiff = timeEnd - timeStart;*/
        console.log("Create")
        const schedule = new Map([
            ['startDate', shift.startDate],
            ['shiftLength', shift.shift],
            ['employees', [{ 'employeeId': shift.employeeId }]],
            //['shiftLength', hourDiff],
            //['employees', [{ 'employeeId': 1 }]],
        ])
        const scheduleData = Object.fromEntries(schedule);
        //console.log(scheduleData)

        await utilFetch.operationData(`schedule/`, "", scheduleData, "POST");
    }

    async updateSchedule(e) {
        console.log("Update")
        const schedule = new Map([
            ['id', e.id],
            ['startDate', e.startDate],
            ['shiftLength', e.shift],
            ['employees', [{ 'employeeId': e.employeeId }]],
        ])
        const scheduleData = Object.fromEntries(schedule);

        await utilFetch.operationData(`schedule/`, e.id, scheduleData, "PATCH");
    }

    async deleteSchedule(e) {
        if (this.confirmDelete()) {
            await utilFetch.operationData("schedule/", e.appointmentData.id, null, "DELETE")
            console.log('Delete was successful');
        } else {
            console.log('Delete was cancelled');
            e.cancel = true;
        };
    }
    //Confirm prompt
    confirmDelete() {
        return confirm('Er du sikker på du vil slette?');
    }
}
var scheduleRenderer = new ScheduleRenderer;


