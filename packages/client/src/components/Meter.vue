<template>
  <meter id="theMeter" min="0" max="100" :value="value" :class="{'onUpload': value}"></meter>
</template>

<script>
export default {
  name: "Meter",
  props: {
    value: Number,
  },
};
</script>

<style lang="less" scoped>
#theMeter {
  &::-webkit-meter-bar {
    background-color: #dcdcdc;
    border: 1px solid #dcdcdc;
  }

  &::-webkit-meter-optimum-value {
    border-radius: 6px;
    background-color: hsl(200, 100%, 50%);
  }

  &::-webkit-meter-suboptimum-value {
    background-color: hsl(200, 100%, 50%);
  }

  &::-webkit-meter-even-less-good-value {
    background-color: hsl(200, 100%, 50%);
  }
}

.onUpload {
  &::-webkit-meter-optimum-value,
  &::-webkit-meter-suboptimum-value,
  &::-webkit-meter-even-less-good-value {
    background-size: inherit;
    background-image: inherit;
    box-shadow: 0 0 10px 2px hsla(200, 100%, 50%, 0.4);
    transition: width 1s cubic-bezier(0.2, 0.1, 0.2, 1);
  }
}
</style>
