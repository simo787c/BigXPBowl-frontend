class OrderListRenderer {

    constructor() {
    }

    async updateUI() {
        let orderListTable = document.getElementById("orderList-table");

        let data = await utilFetch.operationData("product/orders", "", "", "GET");
        this.productItemList = await utilFetch.operationData("product/productItems", "", "", "GET");
        document.getElementById("view").setAttribute("class", "")
        console.log(data);
        try {
            //clear equipments div content
            orderListTable.innerHTML = ""

            //iterate through each item, then clone and assign a htmltemplate for it
            data.forEach(element => {
                let clone = cloneHtmlTemplateTableTr("template-orderList-table")

                clone.querySelector(".orderList-id").innerHTML += element.orderId;
                clone.querySelector(".orderList-name").innerHTML += element.name;
                clone.querySelector(".orderList-email").innerHTML += element.email;
                for(let i = 0; i < element.productItemList.length; i++){
                    clone.querySelector(".orderList-productList").innerHTML += element.productItemList[i].name;
                }
                clone.querySelector(".btn-delete-orderList").value += element.orderId;
                clone.querySelector(".btn-edit-orderList").value += element.orderId;
                //for deleteProductItem() to delete the tr when deleting
                clone.setAttribute("id", "orderList" + element.orderId);

                orderListTable.appendChild(clone)
            });

        } catch (error) {
            console.log(error)
        }
        this.productItemList.forEach(element => {
            let target = $('select[name="orderListProductList"]')
            let options = `<option value="${element.productItemId}">${element.name} </option>`
            target.append(options)
        })
    }

    openCreateOrderListModal() {
        $(".btn-orderList-modal").val("Opret")
        $(".btn-orderList-modal").attr("onclick", "orderListRenderer.createOrderList()")
        document.getElementById("orderListName").value = "";
        document.getElementById("orderListEmail").value = "";
        document.getElementById("orderListProductList").value = "";

        
    }

    async createOrderList() {
        let name = document.getElementById("orderListName").value;
        let email = document.getElementById("orderListEmail").value;
        let productList = document.getElementById("orderListProductList").value;    
        
        let productEntity = new Map([
            ['productItemId', productList]
        ])
        const productData = Object.fromEntries(productEntity)

        const orderList = new Map([
            ['name', name],
            ['email', email],
            ['productItemList', [productData]],
        ])
        const orderListData = Object.fromEntries(orderList);

        await utilFetch.operationData("product/order/", "", orderListData, "POST");

        this.updateUI();

        $('#orderListModal').modal('hide');
    }

    async openEditOrderList(id) {
        let data = await utilFetch.operationData("product/orders/", id, "", "GET");
        $(".btn-orderList-modal").attr("onclick", "orderListRenderer.editOrderList()")

        document.getElementById("staticBackdropLabel").innerHTML = "Redig??r Ordre"
        $(".btn-orderList-modal").val("Gem")

        this.orderListId = id;
        document.getElementById("orderListName").value = data.name;
        document.getElementById("orderListEmail").value = data.email;
        document.getElementById("orderListProductList").value = data.productItemList[0].productItemId;
    }

    async editOrderList() {
        let orderListName = document.getElementById("orderListName").value;
        let orderListEmail = document.getElementById("orderListEmail").value;
        let orderListProductList = document.getElementById("orderListProductList").value;

        let productEntity = new Map([
            ['productItemId', orderListProductList]
        ])
        const productData = Object.fromEntries(productEntity)

        const orderList = new Map([
            ['orderId', this.orderListId],
            ['name', orderListName],
            ['email', orderListEmail],
            ['productItemList', [productData]],
        ])
        const orderListData = Object.fromEntries(orderList);
        console.log(orderListData)

        await utilFetch.operationData(`product/order/`, this.orderListId, orderListData, "PATCH");

        this.updateUI();

        $('#orderListModal').modal('hide');
    }

    deleteOrderList(id) {
        if (this.confirmDelete()) {
            utilFetch.operationData("product/order/", id, "", "DELETE");
            //Remove deleted element from UI
            $('#orderList' + id).remove();
            console.log('Delete was successful');
        } else {
            console.log('Delete was cancelled');
        }
    }
    //Confirm prompt
    confirmDelete() {
        return confirm('Er du sikker p?? du vil slette?');
    }
}
var orderListRenderer = new OrderListRenderer;


