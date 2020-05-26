<template>
  <div class="cards">
    <card
      v-for="(item, i) in outCard"
      :key="i"
      class="card small"
      size="small"
      :value="item.label"
      :type="item.type"
    />
  </div>
</template>

<script>
import Card from './Card'
export default {
  name: 'OutCard',
  components: { Card },
  props: {
    outCard: {
      type: Array,
      default: () => {}
    }
  },
  data() {
    return {
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.small:not(:first-child) {
  margin-left: -35px;
}
.cards{
  display: flex;
}
</style>
