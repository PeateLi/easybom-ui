<template>
  <div id="app">
      <div>
        <Header></Header>
        <div class="container" v-if="!isIndex">
          <SideNav class="nav"></SideNav>
          <router-view class="view"></router-view>
        </div>
        <router-view class="page" v-else></router-view>
      </div>
  </div>
</template>


<script>
export default {
  data(){
    return {
       isIndex: true
    }
  },
  components:{
    // DemoBlock:() => import('../examples/components/DemoBlock/DemoBlock'),
    Header:() => import('../examples/components/Header/Header'),
    SideNav:() => import('../examples/components/SideNav/SideNav'),
  },
  watch: {
      $route () {
        this.isIndex = this.$route.name === 'index'
      }
    },
}
</script>

<style lang='scss'>
.container {
    margin: 48px auto;
    width: 90%;
    background-color: #fff;
    box-shadow: 0 4px 30px 0 rgba(223, 225, 230, 0.5);
    .nav {
      float: left;
      width: 210px;
    }
    .view {
      float: left;
      width: calc(100% - 215px);
      padding: 32px 48px 48px;
      box-sizing: border-box;
    }
  }
  .container:after {
    content: "";
    clear: both;
    display: block;
  }
</style>
