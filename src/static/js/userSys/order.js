class OrderRenderer {

    constructor() {
    }

    async updateUI() {
        let content = document.getElementById("productItems");

        this.data = await utilFetch.operationData("product/productItems", "", "", "GET");
        console.log(this.data);
        try {
            //clear equipments div content
            content.innerHTML = ""

            //iterate through each, then clone and assign a htmltemplate for it
            this.data.forEach(element => {
                //id,activityType,name,description,condition
                let clone = cloneHtmlTemplateTableTr("template-order-productItem")

                clone.querySelector(".name").innerHTML += element.name + "<br>" + element.description;
                clone.querySelector(".productType").innerHTML += element.productType;
                clone.querySelector(".price").innerHTML += element.price;
                clone.querySelector(".addButton").value += element.productItemId;
                clone.querySelector(".quantity").setAttribute("id","quantity" + element.productItemId);

                content.appendChild(clone)
            });

        } catch (error) {
            console.log(error)
        }
    }

    //when enter is pressed while targeting a textbox on a table item
    //append the item data + the textbox value into the cart div as a new row
    //multiply price with quantity given in textbox
    addQuantityToCart(id){
        //console.log(quantity);
        //let cart = document.getElementsByClassName("cart-list");
        let cart = $(".cart-list");

        let quantity = document.getElementById("quantity" + id).value;

        if(!document.getElementById("item" + id)){
            cart.append(`
                        <li class="list-group-item d-flex justify-content-between lh-condensed cart-item" id="item${id}">
                                    <div>
                                        <h6 class="my-0">${this.data[id-1].name}</h6>
                                        <small class="text-muted">${this.data[id-1].description}</small>
                                    </div>
                                    <span class="text-muted">${this.data[id-1].price}kr.</span>
                                    <span class="text-muted">${quantity} stk.</span>
                                    </li>
                    `);
        }else{

        }

        
    }

    async createOrder(){

        //define map for Order
        let orderEntity = new Map([
            ['name', "name"], //remember to move name and emails into form or get fields!!!!!!!
            ['email', "email"],
            ['productItemList', []],
        ]);       

        //Iterate through all elements with class cart-item, get id from id attribute
        let productItemList = [].map.call($(".cart-item"), e => e.id.split("m")[1])

        console.log(productItemList);

        
        //for each id, map key and value, convert to object, then insert on productItemList in orderEntity
        productItemList.forEach(element => {
            let tempMap = new Map([
                ["productItemId", element]
            ])
            let tempMapData = Object.fromEntries(tempMap)
            orderEntity.get("productItemList").push(tempMapData)
        })
        console.log(orderEntity);

        //convert orderEntity (Map) to object
        let orderData = Object.fromEntries(orderEntity);

        console.log(orderData);


        

        await utilFetch.operationData("product/order/", "", orderData, "POST");

    }
}
var orderRenderer = new OrderRenderer;
