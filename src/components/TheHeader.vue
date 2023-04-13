<template>
  <header class="header">
    <div class="container">
      <div class="header__info">
        <router-link to="/" class="header__logo">
          <img src="/images/logo/logo-header.svg" alt="Logo header" />
        </router-link>

        <div class="header__links">
          <div class="header__contacts">
            <a href="tel:37477233503" class="header__contacts-number">+374 77 233 503</a>
            <a href="mailto:Info@qiosk.am" class="header__contacts-email">Info@qiosk.am</a>
          </div>

          <button class="write-btn">Написать нам!</button>
        </div>
      </div>

      <div class="form-fade none">
        <div class="form-popup">
          <form action="#" class="form">
            <h3 class="form__title">Заполните форму</h3>
            <div class="form__descr">
              <p>
                Свяжемся с Вами в ближайшее для <br class="br" />
                обсуждения деталей
              </p>
            </div>
            <div class="form__item">
              <input type="text" name="name" class="form__input" placeholder="Имя:" />
            </div>
            <div class="form__item">
              <input type="email" name="email" class="form__input form__input-email" placeholder="E-mail:" />
            </div>
            <div class="form__item">
              <textarea name="message" class="from__message" placeholder="Сообщение:"></textarea>
            </div>
            <button type="submit" class="form-popup__btn">Отправить заявку</button>
            <button class="form-popup__close">
              <img src="/images/contacts/close.svg" alt="close" />
            </button>
          </form>

          <div id="answer"></div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
@import "@/assets/scss/elements/btns";
@import "@/assets/scss/components/the-header";
</style>
