class OrderRenderer {

    constructor() {
    }

    async updateUI() {
        let equipments = document.getElementById("productItems");

        let data = await utilFetch.operationData("product/productItems", "", "", "GET");
        console.log(data);
        try {
            //clear equipments div content
            equipments.innerHTML = ""

            //iterate through each, then clone and assign a htmltemplate for it
            data.forEach(element => {
                //id,activityType,name,description,condition
                let clone = cloneHtmlTemplateTableTr("template-order-productItem")

                clone.querySelector(".name").innerHTML += element.name;
                clone.querySelector(".description").innerHTML += element.description;
                clone.querySelector(".productType").innerHTML += element.productType;
                clone.querySelector(".price").innerHTML += element.price;

                equipments.appendChild(clone)
            });

        } catch (error) {
            console.log(error)
        }
    }

    //when enter is pressed while targeting a textbox on a table item
    //append the item data + the textbox value into the cart div as a new row
    //multiply price with quantity given in textbox
}
var orderRenderer = new OrderRenderer;
