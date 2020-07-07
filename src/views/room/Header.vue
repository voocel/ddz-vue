<template>
  <div class="header">
    <div class="landlord-cards">
      <card
        v-for="(item, i) in landlordCards"
        :key="i"
        :open="true"
        size="small"
        class="small"
        :num="i"
        :value="item.label"
        :type="item.type"
      />
    </div>
  </div>

</template>

<script>
import Card from './Card'
export default {
  name: 'Header',
  components: { Card },
  props: {
    landlordCards: {
      type: Array,
      default: () => {}
    }
  },
  data() {
    return {}
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: center;
  align-items: center;
}
.landlord-cards {
  display: flex;
  margin-top: 20px;
}
.small:not(:first-child) {
  margin-left: -35px;
}
</style>
