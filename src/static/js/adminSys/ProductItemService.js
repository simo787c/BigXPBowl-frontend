class ProductItemRenderer {

    constructor() {
    }

    async updateUI() {
        let productItems = document.getElementById("productItems");

        let data = await utilFetch.operationData("product/productItems", "", "", "GET");
        document.getElementById("view").setAttribute("class", "")
        document.getElementsByTagName("")
        console.log(data);
        try {
            //clear equipments div content
            productItems.innerHTML = ""

            //iterate through each item, then clone and assign a htmltemplate for it
            data.forEach(element => {
                let clone = cloneHtmlTemplateTableTr("template-product-item")

                clone.querySelector(".productItemId").innerHTML += element.productItemId;
                clone.querySelector(".name").innerHTML += element.name;
                clone.querySelector(".price").innerHTML += element.price;
                clone.querySelector(".productType").innerHTML += element.productType;
                clone.querySelector(".description").innerHTML += element.description;
                clone.querySelector(".deleteButton").value += element.productItemId;
                clone.querySelector(".editButton").value += element.productItemId;
                //for deleteProductItem() to delete the tr when deleting
                clone.setAttribute("id", element.productItemId);

                productItems.appendChild(clone)
            });

        } catch (error) {
            console.log(error)
        }
    }

    deleteProductItem(id) {
        if (this.confirmDelete()) {
            utilFetch.operationData("product/productItem/", id, "", "DELETE");
            //Remove deleted element from UI
            $('#' + id).remove();
            console.log('Delete was successful');
        } else {
            console.log('Delete was cancelled');
        }
    }
    //Confirm prompt
    confirmDelete() {
        return confirm('Er du sikker på du vil slette?');
    }

    async editButtonClick(id) {
        console.log("edit clicked " + id);
        //$('#formPost').attr('method','PATCH')
        document.getElementById("productItemMethodType").value = "PATCH";
        document.getElementById("submitButton").value = "Gem";
        //console.log(document.querySelector("#formPost").method);
        let data = await utilFetch.operationData("product/productItem/", id, "", "GET");

        document.getElementById("productItemId").value = data.productItemId;
        document.getElementById("name").value = data.name;
        document.getElementById("price").value = data.price;
        document.getElementById("productType").value = data.productType;
        document.getElementById("description").value = data.description;
        
        if(data.productType == "Beverages"){
            document.getElementById("productType").value = "Beverages"
        }else if(data.productType == "Food"){
            document.getElementById("productType").value = "Food"
        }
    }

    createButtonClick() {
        console.log("create clicked");
        document.getElementById("submitButton").value = "Tilføj";
        //$('#formPost').attr('method','POST')
        document.getElementById("productItemMethodType").value = "POST";
        //console.log(document.querySelector("#formPost").method);
    }
}

var productItemRenderer = new ProductItemRenderer;

const formPostEvent = document.querySelector("#formPost");

// listening to when Post form get submitted
formPostEvent.addEventListener("submit", async (event) => {
    event.preventDefault();
    let productItemMethodType = document.getElementById("productItemMethodType").value

    const formData = new FormData(formPostEvent);

    //we made a workaround to use a field in form with the method type, as method attribute on form is dumb
    // We can write method type in uppercase but it gives in lowercase (deprecated)
    //in the html form, it only has post and get, we dont use the functionality (deprecated)
    // if (equipmentMethodType == "POST") {
    //     console.log("IF " + equipmentMethodType);
    //     formData.delete("id");
    //     dataFromForm = Object.fromEntries(formData);
    //     await utilFetch.operationData("equipment", "", dataFromForm, "POST");
    // } else if (equipmentMethodType == "PATCH") {
    //     console.log("IF " + equipmentMethodType);
    //     dataFromForm = Object.fromEntries(formData);
    //     await utilFetch.operationData("equipment/", document.getElementById("id").value, dataFromForm, "PATCH");
    // }

    //NEW NEW post patch method, fetch doesnt need an ID by itself since if its included in the form it'll know what to do
    //Might be a security breach since its done in the frontend, and post endpoint doesnt break if it gets an id with the request
    //5. in https://www.baeldung.com/spring-data-crud-repository-save
    if (productItemMethodType == "POST") {
        console.log("IF " + productItemMethodType);
        formData.delete("id");
    }
    const dataFromForm = Object.fromEntries(formData);
    await utilFetch.operationData("product/productItem/", "", dataFromForm, "POST");
    productItemRenderer.updateUI();
})

