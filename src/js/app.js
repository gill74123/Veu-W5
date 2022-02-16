const baseUrl = "https://vue3-course-api.hexschool.io/v2";
const apiPath = "gillchin";

// vee-validate 規則載入
Object.keys(VeeValidateRules).forEach(rule => {
    if (rule !== 'default') {
      VeeValidate.defineRule(rule, VeeValidateRules[rule]);
    }
});
// 讀取外部資源
VeeValidateI18n.loadLocaleFromURL('./zh_TW.json');
// Activate the locale
// 設定的方式
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize('zh_TW'),
  validateOnInput: true, // 調整為輸入字元立即進行驗證
});

const app = Vue.createApp({
    data() {
        return {
            cartData: {
                carts: []
            },
            products: [],
            productId: "",
            isLoading: "",
            formData:{
                user:{}
            }
        }
    },
    methods: {
        // 取得 產品列表
        getProducts() {
            const url = `${baseUrl}/api/${apiPath}/products/all`;
            axios.get(url)
                .then((res) => {
                    // console.log(res);
                    this.products = res.data.products;
                })
                .catch((err) => {
                    console.log(err);
                })
        },
        // 開啟 查看更多 modal
        openProductModal(id) {
            // 將單一產品 id 帶入
            this.productId = id;

            // 開啟 product-modal 元件
            this.$refs.productModal.openProductModal();

            // 執行 取得單一產品資訊 (product-modal 元件內的方法)
            // this.$refs.productModal.getProduct(id);
        },
        // 取得 購物車列表
        getCart() {
            const url = `${baseUrl}/api/${apiPath}/cart`;
            axios.get(url)
                .then((res) => {
                    // console.log(res);
                    this.cartData = res.data.data;
                })
                .catch((err) => {
                    console.log(err);
                })
        },
        // 加入購物車
        addCart(id, qty = 1) {
            const url = `${baseUrl}/api/${apiPath}/cart`;
            const data = {
                product_id: id,
                qty: qty
            }
            // 點擊加入購物車會把此商品的 id 賦予至 isLoading
            this.isLoading = id,
            axios.post(url, {data})
                .then((res) => {
                    // console.log(res);
                    // 執行 取得購物車列表
                    this.getCart();

                    // 成功跑完 API 後會再賦予空值
                    this.isLoading = "";

                    // 關閉 product-modal 元件
                    this.$refs.productModal.closeProductModal();
                })
                .catch((err) => {
                    console.log(err);
                })
        },
        // 修改購物車
        updateCart(item) {
            const url = `${baseUrl}/api/${apiPath}/cart/${item.id}`;
            const data = {
                product_id: item.product.id,
                qty: item.qty
            }

            // 修改產品數量會把此商品的 id 賦予至 isLoading
            this.isLoading = item.id,
            axios.put(url, {data})
                .then((res) => {
                    console.log(res);
                    // 執行 取得購物車列表
                    this.getCart();

                    // 成功跑完 API 後會再賦予空值
                    this.isLoading = "";
                })
                .catch((err) => {
                    console.log(err);
                })
        },
        // 刪除 全部購物車產品
        removeCart() {
            const url = `${baseUrl}/api/${apiPath}/carts`;
            axios.delete(url)
                .then((res) => {
                    // console.log(res);
                    alert('已清空購物車!');
                    // 執行 取得購物車列表
                    this.getCart();
                })
                .catch((err) => {
                    console.log(err);
                })
        },
        // 刪除 單一購物車產品
        removeItemCart(id) {
            const url = `${baseUrl}/api/${apiPath}/cart/${id}`;

            // 點擊加入購物車會把此購物車的 id 賦予至 isLoading
            this.isLoading = id;
            axios.delete(url)
                .then((res) => {
                    console.log(res);
                    // // 執行 取得購物車列表
                    this.getCart();

                    // 成功跑完 API 後會再賦予空值
                    this.isLoading = "";
                })
                .catch((err) => {
                    console.log(err);
                })
        },
        // 新增訂單
        addOrder() {
            console.log(this.$refs);
            const url = `${baseUrl}/api/${apiPath}/order`;
            axios.post(url, {data: this.formData})
                .then((res) => {
                    console.log(res);
                    alert('訂單已成立！');
                    // 執行 取得購物列表
                    this.getCart();

                    // 清空表單欄位
                    this.$refs.form.resetForm();
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    },
    mounted() {
        // 執行 取得產品列表
        this.getProducts();

        // 執行 取得購物車列表
        this.getCart();
    },
})

// product-modal 元件
app.component('product-modal',{
    props: ['id', 'is-loading'],
    data() {
        return {
            productModal: "",
            product: {},
            productNum: 1,
        }
    },
    watch: {
        id() {
            // 當 props 傳進來的 id 有變動時就會觸發
            // 執行 取得單一產品資訊
            this.getProduct();
        }
    },
    methods: {
        openProductModal() {
            // 開啟 modal 先將數量改成 1
            this.productNum = 1;
            this.productModal.show();
        },
        closeProductModal() {
            this.productModal.hide();
        },
        // 取得 單一產品資訊
        getProduct() {
            const url = `${baseUrl}/api/${apiPath}/product/${this.id}`;
            axios.get(url)
                .then((res) => {
                    // console.log(res);
                    this.product = res.data.product;
                })
                .catch((err) => {
                    console.log(err);
                })
        },
        // 加入購物車 (根元件已經有加入購物車的方法，所以這邊使用 emit 呼叫外層事件)
        addCart() {
            this.$emit('add-cart', this.product.id, this.productNum);
        }
    },
    mounted() {
        this.productModal = new bootstrap.Modal(this.$refs.modal, {keyboard: false});
    },
    template: "#productModal"
})

// vue-loading 元件
app.component('loading', VueLoading.Component)

// vee-validate 表單驗證元件
app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);

app.mount('#app');