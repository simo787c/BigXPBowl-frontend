










class BookLane {

    constructor() {
        this.updateUI();
    }

    updateUI() {

    }

    modalBook(id) {
        //let bowlingId = document.getElementById("bowlingId")
        //bowlingId.value = id;
        $('#bowlingId').val(id);//
    }
}
var bookLane = new BookLane;