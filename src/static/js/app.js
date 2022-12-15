'use strict'

/**
 * Used to hold cached versions of used HTML templates.
 */
var htmlTemplateCache = new Map()

/**
 * Route template constants.
 */
const ROUTE_TEMPLATE_KEY_HOME = 'home'
const ROUTE_TEMPLATE_KEY_BOOKING = 'booking'
const ROUTE_TEMPLATE_KEY_BOOKING_CALENDAR = 'booking/calendar'
const ROUTE_TEMPLATE_KEY_ORDER = 'order'
const ROUTE_TEMPLATE_KEY_ORDERLIST = 'orderList'
const ROUTE_TEMPLATE_KEY_ABOUT = 'about'
const ROUTE_TEMPLATE_KEY_BOWLING = 'bowling'
const ROUTE_TEMPLATE_KEY_AIRHOCKEY = 'airHockey'
const ROUTE_TEMPLATE_KEY_DINER = 'diner'
const ROUTE_TEMPLATE_KEY_LOGIN = 'login'
const ROUTE_TEMPLATE_KEY_LOGOUT = 'logout'
const ROUTE_TEMPLATE_KEY_ADMIN = 'admin'
const ROUTE_TEMPLATE_KEY_EQUIPMENT = 'equipment'
const ROUTE_TEMPLATE_KEY_EMPLOYEE = 'employee'
const ROUTE_TEMPLATE_KEY_SCHEDULE = 'schedule'
const ROUTE_TEMPLATE_KEY_PRODUCT_ITEM = 'productItem'

/**
 * Route constants.
 */
const ROUTE_HOME = '/'
const ROUTE_BOOKING = '/booking'
const ROUTE_BOOKING_CALENDAR = '/booking/calendar'
const ROUTE_ORDER = '/order'
const ROUTE_ORDERLIST = '/orderList'
const ROUTE_ABOUT = '/about'
const ROUTE_BOWLING = '/bowling'
const ROUTE_AIRHOCKEY = '/airHockey'
const ROUTE_DINER = '/diner'
const ROUTE_LOGIN = '/login'
const ROUTE_LOGOUT = '/logout'
const ROUTE_ADMIN = '/admin'
const ROUTE_EQUIPMENT = '/equipment'
const ROUTE_EMPLOYEE = '/employee'
const ROUTE_SCHEDULE = '/schedule'
const ROUTE_PRODUCT_ITEM = '/productItem'

/**
 * Defines the routing templates used.
 */
template(ROUTE_TEMPLATE_KEY_HOME, home)
template(ROUTE_TEMPLATE_KEY_BOOKING, booking)
template(ROUTE_TEMPLATE_KEY_BOOKING_CALENDAR, booking_calendar)
template(ROUTE_TEMPLATE_KEY_ORDER, order)
template(ROUTE_TEMPLATE_KEY_ORDERLIST, orderList)
template(ROUTE_TEMPLATE_KEY_ABOUT, about)
template(ROUTE_TEMPLATE_KEY_BOWLING, bowling)
template(ROUTE_TEMPLATE_KEY_AIRHOCKEY, airHockey)
template(ROUTE_TEMPLATE_KEY_DINER, diner)
template(ROUTE_TEMPLATE_KEY_LOGIN, login)
template(ROUTE_TEMPLATE_KEY_LOGOUT, logout)
template(ROUTE_TEMPLATE_KEY_ADMIN, admin)
template(ROUTE_TEMPLATE_KEY_EQUIPMENT, equipment)
template(ROUTE_TEMPLATE_KEY_EMPLOYEE, employee)
template(ROUTE_TEMPLATE_KEY_SCHEDULE, schedule)
template(ROUTE_TEMPLATE_KEY_PRODUCT_ITEM, productItem)

/**
 * Defines the #/... url routes and the templates they match..
 */
route(ROUTE_HOME, ROUTE_TEMPLATE_KEY_HOME);
route(ROUTE_BOOKING, ROUTE_TEMPLATE_KEY_BOOKING);
route(ROUTE_BOOKING_CALENDAR, ROUTE_TEMPLATE_KEY_BOOKING_CALENDAR);
route(ROUTE_ORDER, ROUTE_TEMPLATE_KEY_ORDER);
route(ROUTE_ORDERLIST, ROUTE_TEMPLATE_KEY_ORDERLIST);
route(ROUTE_ABOUT, ROUTE_TEMPLATE_KEY_ABOUT);
route(ROUTE_BOWLING, ROUTE_TEMPLATE_KEY_BOWLING);
route(ROUTE_AIRHOCKEY, ROUTE_TEMPLATE_KEY_AIRHOCKEY);
route(ROUTE_DINER, ROUTE_TEMPLATE_KEY_DINER);
route(ROUTE_LOGIN, ROUTE_TEMPLATE_KEY_LOGIN);
route(ROUTE_LOGOUT, ROUTE_TEMPLATE_KEY_LOGOUT);
route(ROUTE_ADMIN, ROUTE_TEMPLATE_KEY_ADMIN);
route(ROUTE_EQUIPMENT, ROUTE_TEMPLATE_KEY_EQUIPMENT);
route(ROUTE_EMPLOYEE, ROUTE_TEMPLATE_KEY_EMPLOYEE);
route(ROUTE_SCHEDULE, ROUTE_TEMPLATE_KEY_SCHEDULE);
route(ROUTE_PRODUCT_ITEM, ROUTE_TEMPLATE_KEY_PRODUCT_ITEM);
/**
 * Clones an embedded HTML template, from the HTML file, via an id.
 */
function cloneHtmlTemplate(id) {
    let div = document.createElement('div');
    //div.setAttribute('class', 'container');
    const template = document.querySelector(`#${id}`);
    const clone = template.content.cloneNode(true);
    div.appendChild(clone)
    return div
}

function cloneHtmlTemplateTableTr(id) {
    let tr = document.createElement('tr');
    //div.setAttribute('class', 'container');
    const template = document.querySelector(`#${id}`);
    const clone = template.content.cloneNode(true);
    tr.appendChild(clone)
    return tr
}

/**
 * Home route action.
 */
function home() {
    $('#view').html(cloneHtmlTemplate('template-home'));
    document.getElementById("view").setAttribute("class", "container")
}

function booking() {
    if (isLoggedIn()) {
        $('#view').html(cloneHtmlTemplate('template-booking'));
        bookingsRenderer.updateUI("");
    } else {
        $('#view').html(`<div class="page-content" id="content"><h1>You're not logged in, which is required for this page.</h1></div>`);
    }
}

function booking_calendar() {
    if (isLoggedIn()) {
        $('#view').html(cloneHtmlTemplate('template-booking-calendar'));
        document.getElementById("view").setAttribute("class", "container-fluid")
        bookingCalendar.updateUI()
        // bookingCalendarRenderer.updateUI();
    } else {
        $('#view').html(`<div class="page-content" id="content"><h1>You're not logged in, which is required for this page.</h1></div>`);
    }
}

function order() {
    $('#view').html(cloneHtmlTemplate('template-order'));
    document.getElementById("view").setAttribute("class", "container-fluid")
    orderRenderer.updateUI("");
}

function orderList() {
    if (isLoggedIn()) {
        $('#view').html(cloneHtmlTemplate('template-orderList'));
        document.getElementById("view").setAttribute("class", "container-fluid")
        orderListRenderer.updateUI("");
    } else {
        $('#view').html(`<div class="page-content" id="content"><h1>You're not logged in, which is required for this page.</h1></div>`);
    }
}

/**
 * About route action.
 */
function about() {
    $('#view').html(cloneHtmlTemplate('template-about'));
};

function bowling() {
    $('#view').html(cloneHtmlTemplate('template-bowling'));
    lanesRenderer.updateUI();
};

function airHockey() {
    $('#view').html(cloneHtmlTemplate('template-air-hockey'));
    tableRenderer.updateUI();
};

function diner() {
    $('#view').html(cloneHtmlTemplate('template-diner'));
};

function equipment() {
    if (isLoggedIn()) {
        $('#view').html(cloneHtmlTemplate('template-equipment'));
        equipmentRenderer.updateUI();
    } else {
        $('#view').html(`<div class="page-content" id="content"><h1>You're not logged in, which is required for this page.</h1></div>`);
    }
};

function productItem() {
    if (isLoggedIn()) {
        $('#view').html(cloneHtmlTemplate('template-productItem'));
        productItemRenderer.updateUI();
    } else {
        $('#view').html(`<div class="page-content" id="content"><h1>You're not logged in, which is required for this page.</h1></div>`);
    }
};

/**
 * Login route action.
 */
// function login() {
//     /*
//         // jQuery sample
//         let username = $('#username').val()
//         let password = $('#password').val()
//     */
//     let username = document.getElementById('username').value
//     let password = document.getElementById('password').value

//     let roles = ['Admin', 'Developer', 'User']

//     createUserSession(username, btoa(password), roles)
//     toggleLoginUI(false)

//     home()
// };
async function login() {
    /*
    // jQuery sample
    let username = $('#username').val()
    let password = $('#password').val()
    */
    let username = document.getElementById('username').value
    let password = document.getElementById('password').value
    let roles = ['Admin', 'Developer', 'User', "Employee"]

    let user = username + "-" + password;
    let dataUser = await utilFetch.operationData("user/login/", user, "", "GET");

    if (dataUser != null && dataUser != "-") {
        //createUserSession(username, btoa(password), roles)
        createUserSession(username, btoa(password), dataUser.role)
        toggleLoginUI(false)
    } else {
        alert("Wrong username or password!")
        window.location.href = '/src/index.html#'
    }

    home()
};


/**
 * Logs out route action.
 */
function logout() {
    resetUserSession()
    toggleLoginUI(true)
    home()
}

/**
 * Restricted route action.
 */
function admin() {

    if (isLoggedIn()) {
        $('#view').html(cloneHtmlTemplate('template-upload'));
        document.getElementById('user').value = getUser().username;
        imageUploader.updateGallery();
    } else {
        $('#view').html(`<div class="page-content" id="content"><h1>You're not logged in, which is required for this page.</h1></div>`);
    }
}

/**
 * Restricted route action.
 */
function employee() {

    if (isLoggedIn() && getUser().roles == "Admin" || getUser().roles == "Developer") {
        $('#view').html(cloneHtmlTemplate('template-employee'));
        employeeRenderer.updateUI();
    } else {
        $('#view').html(`<div class="page-content" id="content"><h1>You're not logged in or not an admin, which is required for this page.</h1></div>`);
    }
}

/**
 * Restricted route action.
 */
 function schedule() {

    if (isLoggedIn()) {
        $('#view').html(cloneHtmlTemplate('template-schedule'));
        document.getElementById("view").setAttribute("class", "container-fluid")
        scheduleRenderer.updateUI();
    } else {
        $('#view').html(`<div class="page-content" id="content"><h1>You're not logged in, which is required for this page.</h1></div>`);
    }
}