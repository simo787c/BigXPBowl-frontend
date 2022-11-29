'use strict'

/**
 * Used to hold cached versions of used HTML templates.
 */
var htmlTemplateCache = new Map()

/**
 * Route template constants.
 */
const ROUTE_TEMPLATE_KEY_HOME = 'home'
const ROUTE_TEMPLATE_KEY_ABOUT = 'about'
const ROUTE_TEMPLATE_KEY_BOWLING = 'bowling'
const ROUTE_TEMPLATE_KEY_AIRHOCKEY = 'airHockey'
const ROUTE_TEMPLATE_KEY_DINER = 'diner'
const ROUTE_TEMPLATE_KEY_LOGIN = 'login'
const ROUTE_TEMPLATE_KEY_LOGOUT = 'logout'
const ROUTE_TEMPLATE_KEY_ADMIN = 'admin'
const ROUTE_TEMPLATE_KEY_EQUIPMENT = 'equipment'

/**
 * Route constants.
 */
const ROUTE_HOME = '/'
const ROUTE_ABOUT = '/about'
const ROUTE_BOWLING = '/bowling'
const ROUTE_AIRHOCKEY = '/airHockey'
const ROUTE_DINER = '/diner'
const ROUTE_LOGIN = '/login'
const ROUTE_LOGOUT = '/logout'
const ROUTE_ADMIN = '/admin'
const ROUTE_EQUIPMENT = '/equipment' // TODO make admin only page

/**
 * Defines the routing templates used.
 */
template(ROUTE_TEMPLATE_KEY_HOME, home)
template(ROUTE_TEMPLATE_KEY_ABOUT, about)
template(ROUTE_TEMPLATE_KEY_BOWLING, bowling)
template(ROUTE_TEMPLATE_KEY_AIRHOCKEY, airHockey)
template(ROUTE_TEMPLATE_KEY_DINER, diner)
template(ROUTE_TEMPLATE_KEY_LOGIN, login)
template(ROUTE_TEMPLATE_KEY_LOGOUT, logout)
template(ROUTE_TEMPLATE_KEY_ADMIN, admin)
template(ROUTE_TEMPLATE_KEY_EQUIPMENT, equipment)

/**
 * Defines the #/... url routes and the templates they match..
 */
route(ROUTE_HOME, ROUTE_TEMPLATE_KEY_HOME);
route(ROUTE_ABOUT, ROUTE_TEMPLATE_KEY_ABOUT);
route(ROUTE_BOWLING, ROUTE_TEMPLATE_KEY_BOWLING);
route(ROUTE_AIRHOCKEY, ROUTE_TEMPLATE_KEY_AIRHOCKEY);
route(ROUTE_DINER, ROUTE_TEMPLATE_KEY_DINER);
route(ROUTE_LOGIN, ROUTE_TEMPLATE_KEY_LOGIN);
route(ROUTE_LOGOUT, ROUTE_TEMPLATE_KEY_LOGOUT);
route(ROUTE_ADMIN, ROUTE_TEMPLATE_KEY_ADMIN);
route(ROUTE_EQUIPMENT, ROUTE_TEMPLATE_KEY_EQUIPMENT);
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
    $('#view').html(cloneHtmlTemplate('template-equipment'));
    equipmentRenderer.updateUI();
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
    let roles = ['Admin', 'Developer', 'User']

    let user = username + "-" + password;
    let dataUser = await imageUploader.operationData("http://localhost:8080/api/v1/users/login/", "", user, "GET");

    if (dataUser != null && dataUser != "-") {
        createUserSession(username, btoa(password), roles)
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
        $('#view').html(`<h1>You're not logged in, which is required for this page.</h1>`);
    }
}