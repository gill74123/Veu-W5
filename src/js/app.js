import productModal from "../components/productModal.js";

// vee-validate 規則載入
Object.keys(VeeValidateRules).forEach(rule => {
    if (rule !== 'default') {
      VeeValidate.defineRule(rule, VeeValidateRules[rule]);
    }
});
// 讀取外部資源
VeeValidateI18n.loadLocaleFromURL('./zh_TW.json');
// Activate the locale 設定的方式
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize('zh_TW'),
  validateOnInput: false, // 調整為輸入字元立即進行驗證
});

const baseUrl = "https://vue3-course-api.hexschool.io/v2";
const apiPath = "gillchin";

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
            },
            isLoadingComponent: false
        }
    },
    methods: {
        // 取得 產品列表
        getProducts() {
            const url = `${baseUrl}/api/${apiPath}/products/all`;
            this.openLoading();
            axios.get(url)
                .then((res) => {
                    // console.log(res);
                    this.products = res.data.products;

                    // 執行 關閉 loading 效果
                    this.closeLoading();
                })
                .catch((err) => {
                    console.log(err);
                })
        },
        // 開啟 查看更多 modal
        openProductModal(id) {
            // 將單一產品 id 帶入
            this.productId = id;

            // 執行 開啟 loading 效果
            this.openLoading();

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
                    // console.log(res);
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
            // 點擊加入購物車會把 isLoading 賦予 true
            this.isLoading = true;
            axios.delete(url)
                .then((res) => {
                    // console.log(res);
                    // 點擊加入購物車會把 isLoading 賦予空值
                    this.isLoading = "";

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
                    // console.log(res);
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
            const url = `${baseUrl}/api/${apiPath}/order`;
            axios.post(url, {data: this.formData})
                .then((res) => {
                    // console.log(res);
                    alert('訂單已成立！');
                    // 執行 取得購物列表
                    this.getCart();

                    // 清空表單欄位
                    this.$refs.form.resetForm();
                })
                .catch((err) => {
                    console.log(err);
                })
        },
        // 開啟 loading 效果
        openLoading() {
            this.isLoadingComponent = true;
        },
        // 關閉 loading 效果
        closeLoading() {
            this.isLoadingComponent = false;
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
app.component('product-modal', productModal);

// vue-loading 元件
app.component('loading', VueLoading.Component);

// vee-validate 表單驗證元件
app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);

app.mount('#app');