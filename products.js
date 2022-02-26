// ESM 寫法
// import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js";
import { productModal } from './components/productModal.js';
// console.log(VeeValidate);

// 1.使用的元件以及方法
const { defineRule, Form, Field, ErrorMessage,
configure } = VeeValidate;
// 2.驗證規則
const { required, email, min, max } = VeeValidateRules;
// 3.多國語系
const { localize, loadLocaleFromURL } = VeeValidateI18n;

// 2.使用規則,定義規則FN defineRule('自己定義的名字', required);
defineRule('required', required);
defineRule('email', email);
defineRule('min', min);
defineRule('max', max);

// 引入這個檔案
loadLocaleFromURL('https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/zh_TW.json');

configure({ // 用來做一些設定
  generateMessage: localize('zh_TW'), //啟用 locale 
  validateOnInput: true, // 調整為輸入字元立即進行驗證
});

const apiUrl = 'https://vue3-course-api.hexschool.io/v2';
const apiPath = 'jesswu';

// 產品資料格式
Vue.createApp({
  components:{
    productModal,
    // 自己定義的名字: 上面引入的元件名稱
    VForm: Form,
    VField: Field,
    ErrorMessage: ErrorMessage,
  },
  data() {
    return {
      // 購物車列表
      cartData: {
      },
      // 產品列表
      products: [],
      productId:'',
      detail:{},
      tempProduct: {
        // 多圖
        imagesUrl: [],
      },
      isNew:false,
      isLoadingItem: '',
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: '',
        },
        message: '',
      },
    };
  },
  computed:{
    cartsLength() {
      return this.cartData.carts.length;
    }
  },
  methods: {
    getProducts() {
      axios.get(`${apiUrl}/api/${apiPath}/products/all`).then((res)=>{
        // console.log(res);
        this.products = res.data.products;  
      }).catch((err)=>{console.warn(err.data.message)});
    },
    // 打開modal
    openProductModal(id) {
      this.productId = id;
      // console.log('id',id);
      // 觸發元件的openModal()
      // console.log(this.$refs);
      this.$refs.productModal.openModal();
    },
    getCart() {
      axios.get(`${apiUrl}/api/${apiPath}/cart`).then((res)=>{
        // console.log(res);
        this.cartData = res.data.data;  
      }).catch((err)=>{console.warn(err.data.message)});
    },
    addToCart(id, qty=1) {
      // console.log(id, qty);
      // console.log(typeof qty);
      this.isLoadingItem = id
      const data = {
        product_id:id,
        qty
      }
      axios.post(`${apiUrl}/api/${apiPath}/cart`,{data}).then((res)=>{
        // console.log(res);
        alert(res.data.message);
        this.getCart(); 
        this.isLoadingItem = ''; 
      }).catch((err)=>{console.warn(err.data.message)});
    },
    deleteCartItem(id) {
      this.isLoadingItem = id;
      axios.delete(`${apiUrl}/api/${apiPath}/cart/${id}`).then((res)=>{
        alert(res.data.message);
        this.getCart();
        this.isLoadingItem = ''; 
      }).catch((err)=>{console.warn(err.data.message)});
    },
    deleteAllCarts() {
      axios.delete(`${apiUrl}/api/${apiPath}/carts`).then((res) => {
        alert( res.data.message);
        this.getCart();
      }).catch((err)=>{console.warn(err.data.message)})
    },
    updateCartItem(item) {
      // console.log(item);
      const data = {
        product_id : item.id,
        qty: item.qty
      }
      this.isLoadingItem = item.id
      axios.put(`${apiUrl}/api/${apiPath}/cart/${item.id}`,{ data }).then(({data})=>{
        alert(data.message)
        this.getCart()
        this.isLoadingItem ='';
      }).catch((err)=>{console.warn(err.data.message)});
    },
    // 送出表單
    sendOrder() {
      axios.post(`${apiUrl}/api/${apiPath}/order`,{data: this.form}).then((res)=>{
        alert(res.data.message);
        // validateForm的清空方法
        this.$refs.form.resetForm();
        this.getCart();
      }).catch((err)=>{alert(err.data.message)});
    }
      
  },
  mounted() {
    this.getProducts();
    this.getCart();
  }
})
.mount('#app');