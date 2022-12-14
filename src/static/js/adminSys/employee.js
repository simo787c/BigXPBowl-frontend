/**
 * This class contains these method:
 * 1. updateUI()
 * 2. openCreateEmployeeModal()
 * 3. createEmployee()
 * 4. openEditEmployee(id)
 * 5. editEmployee()
 * 6. deleteEmployee(id)
 *      - confirmDelete()
 * 
 * Method functionality
 * 1. updateUI()
 *      - Insert values into table
 * 2. openCreateEmployeeModal()
 *      - Activites when the create button is clicked.
 *      - It updates button in modal so it says "Opret" 
 *      and gives attribute onclick with createEmployee(), 
 *      so when the button "Opret" is clicked it will activite createEmployee and create an employee.
 *      - It also clears the input fields so it's ready for new data
 * 3. createEmployee()
 *      - This method takes value from input fields and insert into a object and makes a POST whith the data
 *      - It calls method updateUI() to see the new data in table and closes the modal.
 * 4. openEditEmployee(id)
 *      - This method get triggered when edit button is clicked
 *      - It makes a GET to get specific employee data and insert it into input fields
 *      - It also change the button value inside modal to "Gem"
 * 5. editEmployee()
 *      - This method get triggered when button inside modal "Gem" is clicked
 *      - It takes the input fields into a object
 *      - It makes a PATCH with the data
 *      - It also calls updateUI() so the changed value can be viewed in table
 *      - And it closes the modal
 * 6. deleteEmployee(id)
 *      - This method get triggered when delete button is clicked and it will use confirmDelete()
 *        to confirm if user will delete.
 *      - If 'Yes/Ok' then it makes a Fetch DELETE on the specific id and remove element from table
 *      - If 'No/Annuller' it will just console.log that delete was cancelled
 */
class EmployeeRenderer {

    constructor() {
    }

    async updateUI() {
        let employeeTable = document.getElementById("employee-table");

        let data = await utilFetch.operationData("employee", "", "", "GET");

        document.getElementById("view").setAttribute("class", "container-fluid")

        try {
            //clear lanes div content
            employeeTable.innerHTML = ""

            //iterate through each lane, then clone and assign a htmltemplate for it
            data.forEach(element => {
                let clone = cloneHtmlTemplateTableTr("template-employee-table")

                clone.querySelector(".employee-name").innerHTML += element.name
                clone.querySelector(".employee-title").innerHTML += element.title
                clone.querySelector(".employee-department").innerHTML += element.department
                //clone.querySelector(".employee-info").innerHTML += element.email + "<br>" + element.phoneNr
                clone.querySelector(".employee-info-email").innerHTML += element.email
                clone.querySelector(".employee-info-nr").innerHTML += element.phoneNr
                clone.querySelector(".btn-edit-employee").value = element.employeeId
                clone.querySelector(".btn-delete-employee").value = element.employeeId
                clone.setAttribute("id", "employee" + element.employeeId);

                employeeTable.appendChild(clone)
            });

        } catch (error) {
            console.log(error)
        }
    }

    openCreateEmployeeModal() {
        $(".btn-employee-modal").val("Opret")
        $(".btn-employee-modal").attr("onclick", "employeeRenderer.createEmployee()")
        document.getElementById("employeeName").value = "";
        document.getElementById("employeeEmail").value = "";
        document.getElementById("employeePhoneNr").value = "";
        document.getElementById("employeeTitle").value = "";
        document.getElementById("employeeDepartment").value = "";
    }

    async createEmployee() {
        let name = document.getElementById("employeeName").value;
        let email = document.getElementById("employeeEmail").value;
        let phoneNr = document.getElementById("employeePhoneNr").value;
        let title = document.getElementById("employeeTitle").value;
        let department = document.getElementById("employeeDepartment").value;

        const employee = new Map([
            ['name', name],
            ['email', email],
            ['phoneNr', phoneNr],
            ['title', title],
            ['department', department],
        ])
        const employeeData = Object.fromEntries(employee);
        //console.log(bookingData)

        // Syntax for Post
        await utilFetch.operationData("employee", "", employeeData, "POST");

        this.updateUI();

        $('#employeeModal').modal('hide');
    }

    async openEditEmployee(id) {
        let data = await utilFetch.operationData("employee/", id, "", "GET");
        $(".btn-employee-modal").attr("onclick", "employeeRenderer.editEmployee()")

        $(".btn-employee-modal").val("Gem")

        this.employeeId = id;
        document.getElementById("employeeName").value = data.name;
        document.getElementById("employeeEmail").value = data.email;
        document.getElementById("employeePhoneNr").value = data.phoneNr;
        document.getElementById("employeeTitle").value = data.title;
        document.getElementById("employeeDepartment").value = data.department;
    }

    async editEmployee() {
        let employeeName = document.getElementById("employeeName").value;
        let employeeEmail = document.getElementById("employeeEmail").value;
        let employeePhoneNr = document.getElementById("employeePhoneNr").value;
        let employeeTitle = document.getElementById("employeeTitle").value;
        let employeeDepartment = document.getElementById("employeeDepartment").value;
        const employee = new Map([
            ['employeeId', this.employeeId],
            ['name', employeeName],
            ['email', employeeEmail],
            ['phoneNr', employeePhoneNr],
            ['title', employeeTitle],
            ['department', employeeDepartment],
        ])
        const employeeData = Object.fromEntries(employee);
        console.log(employeeData)

        await utilFetch.operationData(`employee/`, this.employeeId, employeeData, "PATCH");

        this.updateUI();

        $('#employeeModal').modal('hide');
    }

    deleteEmployee(id) {
        if (this.confirmDelete()) {
            utilFetch.operationData("employee/", id, "", "DELETE");
            //Remove deleted element from UI
            $('#employee' + id).remove();
            console.log('Delete was successful');
        } else {
            console.log('Delete was cancelled');
        }
    }
    //Confirm prompt
    confirmDelete() {
        return confirm('Er du sikker på du vil slette?');
    }
}
var employeeRenderer = new EmployeeRenderer;