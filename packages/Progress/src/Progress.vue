<template>
  <div :class="`${prefixCls}-progress`">
    <div
      :style="{width:radius?radius+'px':'',background:color,minHeight:border?border+'px':''}"
      :class="[className,prefixCls+'-progress-line']"
      v-if="type==='line'">
      <slot></slot>
      <span class="progress-bar" :style="lineStyle">
       <span class="progress-text" v-if="showText&&followText">{{percent}}</span>
      </span>
      <span class="progress-text progress-fixed-text" v-if="showText&&!followText">{{percent}}</span>
    </div>

    <div
      v-style.pro="circleStyle"
      :class="[className,prefixCls+'-progress-circle']"
      v-else-if="type==='circle'">
      <div class="custom-content"><slot></slot></div>
      <span class="progress-text" v-if="showText">{{percent}}</span>
      <div class="circle-circle" v-style.circle="circleStyle" :style="circleStyle2">
        <span class="circle-left" v-style.left="circleStyle" :style="circleRotateStyle"></span>
        <span class="circle-right" v-style.right="circleStyle" v-if="percent>=50"></span>
      </div>
    </div>
  </div>
</template>
<script>
import {prefixCls} from '../../../mixins/prefix'

export default {
  name: `${prefixCls}Progress`,
  data () {
    return {
      prefixCls: prefixCls,
      circleStyle: {// 定义个方便传到指令去
        radius: this.radius,
        border: this.border,
        color: this.color,
        borderColor: this.borderColor
      },
      percent: 0
    }
  },
  props: {
    type: {
      type: String,
      default: 'line',
      validator: function (value) {
        return ['line', 'circle'].indexOf(value) !== -1
      }
    },
    className: String,
    value: {// 进度
      type: Number,
      default: 0
      /* validator: function (value) {
                 return value >= 0 && value <= 100;
                 } */
    },
    radius: {// 外半径
      type: Number,
      default: 0

    },
    border: {// 边框
      type: Number,
      default: 0
    },
    color: {
      type: String,
      default: 'none'
    }, // 底环颜色
    borderColor: {
      type: String,
      default: '#41a259'
    }, // 进度条颜色
    duration: {// 动画持续时间，单位毫秒
      type: Number,
      default: 1000
    },
    showText: {// 显示进度数字
      type: Boolean,
      default: true
    },
    followText: {// 进度数字跟进进度
      type: Boolean,
      default: true
    }
  },
  created () {
  },
  components: {},
  methods: {
    _animation () {
      // 这里还是用js控制，css控制不了，因为大于50%后还要处理其他
      let clearTime
      clearTime = setInterval(() => {
        if (this.percent < this.value && this.percent < 100) {
          this.percent++
        } else {
          clearInterval(clearTime)
        }
      }, this.duration / this.value)
    }
  },
  computed: {
    lineStyle () {
      return {
        height: this.border ? this.border + 'px' : '',
        width: this.percent + '%',
        background: this.borderColor,
        transition: `all ${this.duration / 1000}s`
      }
    },
    /* lineStyleText () {
      if (this.follow && this.showText) {
        return {
          right: (100 - this.percent) + '%',
          transition: `all ${this.duration / 1000}s`
        }
      }
    }, */
    circleStyle2 () {
      // value大于50%时显示完整，小于50%，显示右半边360/100
      if (this.percent > 50) {
        return {
          clip: 'rect(auto,auto,auto,auto)'
        }
      } else {
        return {
          clip: `rect(0,${this.radius * 2}px,${this.radius * 2}px,${this.radius}px)`
        }
      }
    },
    circleRotateStyle () {
      // 左半圆根据value值旋转即可，360度/100=3.6
      return {
        transform: 'rotate(' + 3.6 * this.percent + 'deg)',
        webkitTransform: 'rotate(' + 3.6 * this.percent + 'deg)'
      }
    }
  },
  mounted () {
    if (this.type === 'circle') {
      this._animation()
    } else if (this.type === 'line') {
      // 这里用css3动画的transition，设置下延时
      setTimeout(() => {
        this.percent = this.value
      }, 10)
    }
  },
  watch:{
    value(newV,oldV){
      this.percent = this.value
    
    }
  },
  filters: {},
  directives: {
    // 每个都指定宽高等，但每个标签又不太一致，部分共公的，这里用指令，并且是bind形式只调用一次
    // 发现每个都要写style好麻烦
    style: {
       

        
      bind (el, binding) {
      if(process.client){
        let value = binding.value
        let type = binding.modifiers
        let style = el.style
        style.width = value.radius * 2  + 'px'
        style.height = value.radius * 2 + 'px'
        if (type.pro) {
          style.border = `${value.border}px solid ${value.color}`
        } else if (type.circle) {
          style.left = `-${value.border}px`
          style.top = `-${value.border}px`
        } else if (type.left) {
          style.border = `${value.border}px solid ${value.borderColor}`
          style.clip = `rect(0, ${value.radius}px, ${value.radius * 2}px, 0px)`
        } else if (type.right) {
          style.border = `${value.border}px solid ${value.borderColor}`
          style.clip = `rect(0, ${value.radius * 2}px, ${value.radius * 2}px, ${value.radius}px)`
        }
      }
      }
    }
  }
}
</script>


<style lang="scss" scoped>
@charset "utf-8";
$namespace: 'easy-bom-';
@mixin ns($cls){
  $NS: $namespace+$cls;
  .#{$NS}{
    @content;
  }
}
@include ns(progress){display: inline-block}
@include ns(progress-circle){
  position: relative; border-radius: 50%; box-sizing: border-box;border-color: #999;
  /*progress用作底背景色，*/
  .circle-circle{ display: block; border-radius: 50%; box-sizing: border-box; position: absolute; overflow: hidden;
    /*显示右半边，进度大小50%显示全部-*/
    /*circle-left左半环，裁切显示左半边*/
    .circle-left{ position: absolute; display: block; box-sizing: border-box; border-radius: 50%; top: 0; left: 0; }
    /*circle-right右半环，裁切显示右半边，只有进度大于50%才显示*/
    .circle-right{ position: absolute; right: 0; top: 0; display: block; box-sizing: border-box; border-radius: 50%; }
  }
  /*进度文字*/
  .progress-text{ text-align: center; left: 50%; top: 50%; transform: translate(-50%, -50%); display: block; position: absolute; font-size: 20px;}
  /*自定义文字*/
  .custom-content{position: absolute; text-align: center; top: 15px; width: 60%; left: 20%;line-height: 18px;}
}
/*直线进度*/
@include ns(progress-line){ position: relative; border-radius: 3px;background: #999;min-height: 15px;width: 400px;
  .progress-bar{ position: absolute; width: 0; left: 0; top: 0; border-radius: 3px;background: #41a259;height: 15px;line-height: 15px;text-align: right;font-size: 12px;color: #fff }
  .progress-fixed-text{
      position: absolute;
  right: -75px;
  top: -6px;
  font-size:14px;
font-family:Poppins;
font-weight:400;
color:rgba(51,51,51,1);
line-height:30px;
  }
}
</style>