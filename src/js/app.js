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
        }
    },
    methods: {
        // 取得產品列表
        getProducts() {
            const url = `${baseUrl}/api/${apiPath}/products/all`;
            axios.get(url)
                .then((res) => {
                    // console.log(res);
                    this.products = res.data.products;
                })
        },
        openProductModal(id) {
            // 將單一產品 id 帶入
            this.productId = id;

            // 開啟 product-modal 元件
            this.$refs.productModal.openProductModal();

            // 執行 取得單一產品資訊 (product-modal 元件內的方法)
            // this.$refs.productModal.getProduct(id);
        }
    },
    mounted() {
        // 執行 取得產品列表
        this.getProducts();
    },
})

app.component('product-modal',{
    props: ['id'],
    data() {
        return {
            productModal: "",
            product: {},
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
            this.productModal.show();
        },
        // 取得 單一產品資訊
        getProduct() {
            const url = `${baseUrl}/api/${apiPath}/product/${this.id}`;
            axios.get(url)
                .then((res) => {
                    // console.log(res);
                    this.product = res.data.product;
                })
        }
    },
    mounted() {
        this.productModal = new bootstrap.Modal(this.$refs.modal, {keyboard: false});
    },
    template: "#productModal"
})
app.mount('#app');