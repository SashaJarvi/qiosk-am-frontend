<template>
  <main class="policy">
    <div class="container">
      <article class="policy__content">
        <router-link to="/" class="read-more">
          <span>Вернуться назад</span> <img src="/images/arrows/arrow-left.svg" alt="arrow-left" />
        </router-link>

        <h1 class="">
          Возврат билетов, приобретенных на сайте qiosk.am, осуществляется с удержанием сервисного сбора.
        </h1>
        <br />

        <div class="">
          Размер сервисного сбора:
          <ul class="">
            <li>
              – При возврате билета более чем за 7 дней до начала мероприятия сервисный сбор составляет 10% от
              стоимости.
            </li>
            <li>– При возврате билета менее 7, но более 3 дней до начала мероприятия сервисный сбор составляет 20%.</li>
            <li>- На мероприятия, которые начинаются через 72 часа или менее билеты не возвращаются.</li>
          </ul>
        </div>
        <br />

        <div>
          В случае отмены или переноса мероприятия организаторами, деньги за билеты возвращаются без удержания
          сервисного сбора.
        </div>
        <br />

        <div>
          Возврат денег производится банком в срок до 7 рабочих дней и повлиять на срок зачисления денег мы не можем.
        </div>
      </article>
    </div>
  </main>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<style lang="scss" scoped>
@import "@/assets/scss/elements/btns";

.policy {
  &__content {
    padding: 48px 0;
    font-size: 18px;

    .read-more {
      height: 50px;
      margin-bottom: 30px;
    }
  }
}

.policy-list {
  li::before {
    content: "• ";
    color: rgb(241, 220, 100);
  }
}
</style>
