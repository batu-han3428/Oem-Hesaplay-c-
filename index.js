//Storage Controller(modül)
const StorageController = (function(){
    return{
        storeProduct:function(product){//local storage veri ekler
            let products;
            if(localStorage.getItem('products')===null){
                products = [];
                products.push(product);
            }else{
                products = JSON.parse(localStorage.getItem('products'));
                products.push(product);
            }
            localStorage.setItem('products',JSON.stringify(products));
        },
        getProducts:function(){//local storage de ki verileri çeker
            let products;
            if(localStorage.getItem('products')===null){
                products = [];
            }else{
                products = JSON.parse(localStorage.getItem('products'));
            }

            return products;
        },
        updateProduct:function(product){
            let products = JSON.parse(localStorage.getItem('products'));

            products.forEach(function(prd, index){
                if(product.id == prd.id){
                    products.splice(index, 1, product);
                }
            });

            localStorage.setItem('products',JSON.stringify(products));
        },
        deleteProduct:function(id){
            let products = JSON.parse(localStorage.getItem('products'));

            products.forEach(function(prd, index){
                if(id == prd.id){
                    products.splice(index, 1);
                }
            });

            localStorage.setItem('products',JSON.stringify(products));
        }
    }
})();


//Product Controller(modül)
const ProductController = (function(){
    //Private
    const Product = function(id, name, price){
        this.id=id;
        this.name=name;
        this.price=price;
    }

    const data = {
        products:null,
        selectedProduct:null,
        totalPrice:0
    }

    return{
        //Public
        getProducts: function(){
            return data.products;
        },
        getData:function(){
            return data;
        },
        setData:function(products){
            data.products = products;
        },
        getProductById:function(id){
            let product = null;

            data.products.find(prd=>prd.id==id?product=prd:null);

            return product;
        },
        setCurrentProduct:function(product){
            data.selectedProduct = product;
        },
        getCurrentProduct:function(){
            return data.selectedProduct;
        },
        addProduct:function(name, price){
            let id;

            if(data.products.length>0){
                id = data.products[data.products.length-1].id+1;
            }else{
                id = 0;
            }

            const newProduct = new Product(id, name, parseFloat(price));
            data.products.push(newProduct);
            return newProduct;
        },
        updateProduct:function(name, price){
            let product = null;

            data.products.forEach(function(prd){
                if(prd.id == data.selectedProduct.id){
                    prd.name = name;
                    prd.price = parseFloat(price);
                    product = prd;
                }
            });

            return product;
        },
        deleteProduct:function(selectedProduct){

            data.products.forEach(function(prd, index){
                if(prd.id == selectedProduct.id){
                    data.products.splice(index,1);
                }
            });

            
        },
        GetTotal:function(){
            let total = 0;

            data.products.forEach(function(item){
                total+=item.price;
            });

            data.totalPrice = total;

            return data.totalPrice;
        }
    }
})();


//UI Controller(modül) aldığımız verileri tarayıcı kısmına aktaracağımız modül
const UIController = (function(){

    const Selectors = {//seçicilerin tutulduğu yer. 
        productList:"item-list",
        productListItems:"#item-list tr",
        addButton:"addBtn",
        updateButton:"updateBtn",
        deleteButton:"deleteBtn",
        cancelButton:"cancelBtn",
        productName:"productName",
        productPrice:"productPrice",
        productCard:"productCard",
        totalTl:"total-tl",
        totalDolar:"total-dolar"
    }

    return{
        createProductList:function(products){
            let html=``;

            products.forEach(prd => {
                html+=`
                <tr>
                    <th>${prd.id}</th>
                    <td>${prd.name}</td>
                    <td>${prd.price}$</td>
                    <td class="text-end"><button class="btn btn-outline-light" type="submit"><i class="bi bi-pencil-square"></i></button></td>
                </tr>
                `;
            });

            document.getElementById(Selectors.productList).innerHTML=html;
        },
        getSelectors:function(){
            return Selectors;//seçicileri başka modüllerinde kullanabilmesi için açtık
        },
        addProduct:function(prd){
            var item = `
            <tr>
                <th>${prd.id}</th>
                <td>${prd.name}</td>
                <td>${prd.price}$</td>
                <td class="text-end"><button class="btn btn-outline-light" type="submit"><i class="bi bi-pencil-square"></i></button></td>
            </tr>
            `;

            document.getElementById(Selectors.productList).innerHTML+=item;
        },
        updateProduct:function(prd){
            let updatedItem = null;

            let items = document.querySelectorAll(Selectors.productListItems);

            items.forEach(function(item){
                if(item.classList.contains('table-light')){
                    item.children[1].textContent = prd.name;
                    item.children[2].textContent = prd.price+'$';
                    updatedItem = item;
                }
            })

            return updatedItem;
        },
        clearİnputs:function(){
            document.querySelectorAll('#'+Selectors.productName+', #'+Selectors.productPrice).forEach(a=>a.value="");
        },
        clearTrColorAndButtonColor:function(){
            const items = document.querySelectorAll(Selectors.productListItems);

            items.forEach(function(item){
                if(item.classList.contains('table-light')){
                    item.classList.remove('table-light');
                    item.children[3].children[0].classList.remove('btn-outline-dark');
                    item.children[3].children[0].classList.add('btn-outline-light');
                }
            });
        },
        hideCard:function(){
            document.getElementById(Selectors.productCard).style.display='none';
        },
        showCard:function(){
            document.getElementById(Selectors.productCard).style.display='block';
        },
        showTotal:function(total){
            document.getElementById(Selectors.totalDolar).textContent=total;
            document.getElementById(Selectors.totalTl).textContent=total*9;
        },
        addProductToForm:function(selectedProduct){
            document.getElementById(Selectors.productName).value=selectedProduct.name;
            document.getElementById(Selectors.productPrice).value=selectedProduct.price;
        },
        deleteProduct:function(){
            let items = document.querySelectorAll(Selectors.productListItems);
            items.forEach(function(item){
                if(item.classList.contains('table-light')){
                    item.remove();
                }
            });
        },
        addingState:function(){//ekleme işleminde butonların durumu ve güncelleme işlemi yapıldıysa satırın eski haline dönmesi
            UIController.clearTrColorAndButtonColor();

           
            this.clearİnputs();
            document.getElementById(Selectors.addButton).style.display='inline';
            document.getElementById(Selectors.updateButton).style.display='none';
            document.getElementById(Selectors.deleteButton).style.display='none';
            document.getElementById(Selectors.cancelButton).style.display='none';
        },
        editState:function(tr, buton){//düzenleme butonuna tıklandığında butonların durumu ve seçili product satırının renk ayarı
            UIController.clearTrColorAndButtonColor();

            tr.classList.add('table-light');
            buton.className="btn btn-outline-dark";
            document.getElementById(Selectors.addButton).style.display='none';
            document.getElementById(Selectors.updateButton).style.display='inline';
            document.getElementById(Selectors.deleteButton).style.display='inline';
            document.getElementById(Selectors.cancelButton).style.display='inline';
        }
    }
})();


//App Controller (ana modül) tüm modüllerin birlikte kullanıldığı, birbirlerine veri alışverişi yaptıkları modül
const App = (function(ProductCtrl, UICtrl, StorageCtrl){

    const UISelectors = UICtrl.getSelectors();//seçicilere ulaştık

    //Load Event Listeners
    const loadEventListeners = function(){//tüm event listenersleri burada toplayacağız. daha derli olacak

        //add product event
        document.getElementById(UISelectors.addButton).addEventListener('click',productAddSubmit);//product ekleme butonu


        //edit product click
        document.getElementById(UISelectors.productList).addEventListener('click',productEditClick);//product güncelleme menüsünü açan buton


        //edit product submit
        document.getElementById(UISelectors.updateButton).addEventListener('click',editProductSubmit);//product güncelleme butonu


        //cancel button click
        document.getElementById(UISelectors.cancelButton).addEventListener('click',cancelUpdate);//product güncelleme iptal butonu



        //delete product
        document.getElementById(UISelectors.deleteButton).addEventListener('click',deleteProductSubmit);//product silme butonu
    }

    const productAddSubmit = () =>{

        UICtrl.showCard();

        const productName = document.getElementById(UISelectors.productName).value;
        const productPrice = document.getElementById(UISelectors.productPrice).value;

        if(productName !== '' && productPrice !== ''){
            //Add product
            const newProduct = ProductCtrl.addProduct(productName, productPrice);//dataya veri ekliyor
            
            
            //add item to list
            UICtrl.addProduct(newProduct);//tabloya veri ekliyor

            //add product to Local Storage
            StorageCtrl.storeProduct(newProduct);//veriyi local storage a ekler
            
            //get total
            const total = ProductCtrl.GetTotal();//ürünlerin fiyat toplamını hesaplayacak

            //show total
            UICtrl.showTotal(total);


            //clear inputs
            UICtrl.clearİnputs();//inputları temizliyor

        }else{

        }

    };

    const productEditClick = (e) =>{
        let id;
        let satir;
        let buton;

        if(e.target.getAttribute('type') == 'submit'){
            id = e.target.parentNode.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
            buton = e.target;
            satir = e.target.parentNode.parentNode;
        }else if(e.target.getAttribute('class') == 'bi bi-pencil-square'){
            id = e.target.parentNode.parentNode.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
            buton = e.target.parentNode;
            satir = e.target.parentNode.parentNode.parentNode;
        }
   
        if(id!=undefined){
            //get selected product
            const product = ProductCtrl.getProductById(id);//seçili productın bilgilerini getirir     
            

            //set current product
            ProductCtrl.setCurrentProduct(product);//seçili productın bilgilerini datada ki selectedProduct bölümüne aktardık


            //add product to UI
            UICtrl.addProductToForm(ProductCtrl.getCurrentProduct());//seçili productın bilgilerini inputlara gönderir


            UICtrl.editState(satir, buton);//edit işlemi yapıldığında o producta özel butonlar gelicek, satırı boyanacak ve o satırın butonu boyanacak
        }
    };
    
    const editProductSubmit = (e) =>{
        const productName = document.getElementById(UISelectors.productName).value;
        const productPrice = document.getElementById(UISelectors.productPrice).value;

        if(productName !== '' && productPrice !== ''){
            //update product
            const updatedProduct = ProductCtrl.updateProduct(productName, productPrice);//seçili productın verilerini günceller

            //update ui
            UICtrl.updateProduct(updatedProduct);//seçili productın verilini tabloda günceller

            //get total
            const total = ProductCtrl.GetTotal();//seçili productın total verilerini günceller

            //show total
            UICtrl.showTotal(total);//seçili productın total verilerini tabloda günceller

            //update local storage
            StorageCtrl.updateProduct(updatedProduct);//local storage verilerini günceller

            UICtrl.addingState();//güncelleme işlemi bittiğinde butonları ve satır renklerini düzenler
        }

    };

    const cancelUpdate = () =>{
        UICtrl.addingState();
        UICtrl.clearTrColorAndButtonColor();
    };

    const deleteProductSubmit = () =>{
        //get selected product
        const selectedProduct = ProductCtrl.getCurrentProduct();//seçili productı verir


        //delete product
        ProductCtrl.deleteProduct(selectedProduct);//seçili productı siler

        //delete ui
        UICtrl.deleteProduct();//seçili productı tablodan siler

        //get total
        const total = ProductCtrl.GetTotal();//total verisini 0 lar

        //show total
        UICtrl.showTotal(total);//total verisini tablodan 0 lar

        //delete local storage
        StorageCtrl.deleteProduct(selectedProduct.id);

        UICtrl.addingState();//butonları gizler

        if(total<=0){//ürün yoksa cardı gizler
            UICtrl.hideCard();
        }
    };

    return{
        init: function(){//init fonksiyonu çağrıldığı an içinde ki fonksiyonlar çalışacak

            UICtrl.addingState();//sayfa açıldığında ekleme butonu hariç diğer butonlar gizlenecek

            ProductCtrl.setData(StorageCtrl.getProducts());//sayfa açıldığında local storage da  ki bilgileri dataya aktarır

            const products = ProductCtrl.getProducts();//sayfa açıldığı datamızda ki verileri değişkene aktarır
            

            if(products.length <= 0){//datamızda veri yok ise tabloyu gizler
                UICtrl.hideCard();
            }else{              
                UICtrl.createProductList(products);//sayfa açıldığı an datamızdaki verileri tabloya yansıtacak
                
                const total = ProductCtrl.GetTotal();//ürünlerin fiyat toplamını hesaplayacak

                //show total
                UICtrl.showTotal(total);
            }

            //load event listeners
            loadEventListeners();//sayfa açıldığı an eventlarımız aktif hale gelecek

            
        }
    }
})(ProductController, UIController, StorageController);

App.init();