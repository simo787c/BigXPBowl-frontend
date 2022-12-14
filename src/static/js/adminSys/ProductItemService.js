class ProductItemRenderer {

    constructor() {
    }

    async updateUI() {
        let productItemTable = document.getElementById("productItem-table");

        let data = await utilFetch.operationData("product/productItems", "", "", "GET");
        document.getElementById("view").setAttribute("class", "")
        document.getElementsByTagName("")
        console.log(data);
        try {
            //clear equipments div content
            productItemTable.innerHTML = ""

            //iterate through each item, then clone and assign a htmltemplate for it
            data.forEach(element => {
                let clone = cloneHtmlTemplateTableTr("template-productItem-table")

/*                 clone.querySelector(".productItemId").innerHTML += element.productItemId;
 */                clone.querySelector(".productItem-name").innerHTML += element.name;
                clone.querySelector(".productItem-price").innerHTML += element.price;
                clone.querySelector(".productItem-productType").innerHTML += element.productType;
                clone.querySelector(".productItem-description").innerHTML += element.description;
                clone.querySelector(".btn-delete-productItem").value += element.productItemId;
                clone.querySelector(".btn-edit-productItem").value += element.productItemId;
                //for deleteProductItem() to delete the tr when deleting
                clone.setAttribute("id", "productItem" + element.productItemId);

                productItemTable.appendChild(clone)
            });

        } catch (error) {
            console.log(error)
        }
    }

    openCreateProductItemModal() {
        $(".btn-productItem-modal").val("Opret")
        $(".btn-productItem-modal").attr("onclick", "productItemRenderer.createProductItem()")
        document.getElementById("productItemName").value = "";
        document.getElementById("productItemPrice").value = "";
        document.getElementById("productItemProductType").value = "";
        document.getElementById("productItemDescription").value = "";
    }

    async createProductItem() {
        let name = document.getElementById("productItemName").value;
        let price = document.getElementById("productItemPrice").value;
        let productType = document.getElementById("productItemProductType").value;
        let description = document.getElementById("productItemDescription").value;

        const productItem = new Map([
            ['name', name],
            ['price', price],
            ['productType', productType],
            ['description', description],
        ])
        const productItemData = Object.fromEntries(productItem);

        await utilFetch.operationData("product/productItem/", "", productItemData, "POST");

        this.updateUI();

        $('#productItemModal').modal('hide');
    }

    async openEditProductItem(id) {
        let data = await utilFetch.operationData("product/productItem/", id, "", "GET");
        $(".btn-productItem-modal").attr("onclick", "productItemRenderer.editProductItem()")

        $(".btn-productItem-modal").val("Gem")

        this.productItemId = id;
        document.getElementById("productItemName").value = data.name;
        document.getElementById("productItemPrice").value = data.price;
        document.getElementById("productItemProductType").value = data.productType;
        document.getElementById("productItemDescription").value = data.description;
    }

    async editProductItem() {
        let productItemName = document.getElementById("productItemName").value;
        let productItemPrice = document.getElementById("productItemPrice").value;
        let productItemProductType = document.getElementById("productItemProductType").value;
        let productItemDescription = document.getElementById("productItemDescription").value;
        const productItem = new Map([
            ['productItemId', this.productItemId],
            ['name', productItemName],
            ['price', productItemPrice],
            ['productType', productItemProductType],
            ['description', productItemDescription],
        ])
        const productItemData = Object.fromEntries(productItem);
        console.log(productItemData)

        await utilFetch.operationData(`product/productItem/`, this.productItemId, productItemData, "PATCH");

        this.updateUI();

        $('#productItemModal').modal('hide');
    }

    deleteProductItem(id) {
        if (this.confirmDelete()) {
            utilFetch.operationData("product/productItem/", id, "", "DELETE");
            //Remove deleted element from UI
            $('#productItem' + id).remove();
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
var productItemRenderer = new ProductItemRenderer;


