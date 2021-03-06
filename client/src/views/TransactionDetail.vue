<template>
  <div class="container">
    <div class="mx-auto row w-100" id="cart" v-if="transaction">
      <div class="col-12 ml-md-5 text-center text-md-left">
        <div>
          <p class="mb-0 text-muted">
            {{ transaction.updatedAt | formatDate }}
          </p>
          <h3>Total Price: {{ transaction.totalPrice | formatCurrency }}</h3>
          <p>
            Status:
            {{
              transaction.status[0].toUpperCase() + transaction.status.slice(1)
            }}
          </p>
        </div>
      </div>
      <div
        class="ml-0 ml-md-5 d-flex flex-wrap justify-content-center justify-content-md-start text-center w-100"
      >
        <b-button
          class="mx-3 my-2 my-sm-0"
          variant="outline-accent"
          size="lg"
          active-class
          to="/transactions"
          >Back</b-button
        >
        <b-button
          class="mx-2 my-2 my-sm-0"
          variant="primary"
          size="lg"
          v-if="transaction.status == 'delivering'"
          @click="delivered"
          >Confirm Delivered</b-button
        >
        <b-button
          class="mx-2 my-2 my-sm-0"
          variant="outline-danger"
          size="lg"
          v-if="transaction.status == 'confirming'"
          id="cancel-transaction"
          >Cancel Transaction</b-button
        >

        <b-popover
          target="cancel-transaction"
          triggers="click blur"
          placement="right"
        >
          <template v-slot:title>Are you sure?</template>
          <p>
            If you change your mind later, you have to make new transaction
            instead.
          </p>
          <b-button class="text-center" variant="outline-danger" @click="cancel"
            >Yes, Cancel It</b-button
          >
        </b-popover>
      </div>
      <div
        class="item col-12 d-flex flex-column flex-md-row align-items-center justify-content-center justify-content-md-start my-3 rounded"
        v-for="item in transaction.items"
        :key="item.name"
      >
        <b-img class="pt-2" :src="item.image" width="300" fluid></b-img>
        <div class="mt-2 mt-md-0 text-center text-sm-left">
          <h4 class="mb-0">{{ item.name }}</h4>
          <small class="text-muted">
            {{ item.amount }} pcs x
            {{ item.price | formatCurrency }}
          </small>
          <h5 class="mt-4">
            {{ (item.price * item.amount) | formatCurrency }}
          </h5>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['id'],
  data() {
    return {
      transaction: null
    }
  },
  methods: {
    delivered() {
      const loader = this.$loading.show()
      this.$store
        .dispatch('CONFIRM_DELIVERED', this.transaction._id)
        .then(({ data }) => {
          this.$toasted.show(data.message)
          this.$router.push('/transactions')
        })
        .catch(({ response }) => {
          this.password = ''
          if (response) {
            const message = response.data.message
            if (typeof message != 'string') {
              response.data.message.forEach(msg => {
                this.$toasted.show(msg, { className: 'bg-danger' })
              })
            } else {
              this.$toasted.show(response.data.message, {
                className: 'bg-danger'
              })
            }
          } else {
            this.$toasted.show('Something went wrong', {
              className: 'bg-danger'
            })
          }
        })
        .finally(() => loader.hide())
    },
    cancel() {
      const loader = this.$loading.show()
      this.$store
        .dispatch('CANCEL_TRANSACTION', this.transaction._id)
        .then(({ data }) => {
          this.$toasted.show(data.message)
          this.$router.push('/transactions')
        })
        .catch(({ response }) => {
          this.password = ''
          if (response) {
            const message = response.data.message
            if (typeof message != 'string') {
              response.data.message.forEach(msg => {
                this.$toasted.show(msg, { className: 'bg-danger' })
              })
            } else {
              this.$toasted.show(response.data.message, {
                className: 'bg-danger'
              })
            }
          } else {
            this.$toasted.show('Something went wrong', {
              className: 'bg-danger'
            })
          }
        })
        .finally(() => loader.hide())
    }
  },
  created() {
    this.$store.dispatch('FETCH_USER_DATA').then(() => {
      if (!this.$store.state.user.onSession) {
        this.$router.replace(`/session?from=/transactions/${this.id}&on=signin`)
      } else {
        this.$store
          .dispatch('GET_TRANSACTION_DETAIL', this.id)
          .then(({ data }) => {
            this.transaction = data.data
          })
          .catch(() => {
            this.$router.replace('/')
          })
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  padding-top: 5.7rem;
}
</style>
