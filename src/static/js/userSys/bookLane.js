class BookLane {

    constructor() {
    }

    modalBook(id) {
        //let bowlingId = document.getElementById("bowlingId")
        //bowlingId.value = id;
        $('#bowlingId').val(id);//
        console.log(id)
    }
}
var bookLane = new BookLane;