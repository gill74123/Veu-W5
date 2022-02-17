const baseUrl = "https://vue3-course-api.hexschool.io/v2";
const apiPath = "gillchin";

export default {
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

                    // 執行 關閉 loading 效果
                    this.$emit('close-loading');
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
}