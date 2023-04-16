<template>
  <teleport to="body">
    <transition name="form-fade" mode="in-out" appear>
      <div class="form-fade" @click="emit('close')">
        <div class="form-popup" @click.stop="">
          <form class="form" @submit.prevent="submitHandler">
            <h3 class="form__title">Обратная связь</h3>

            <div class="form__item">
              <input v-model="formData.name" type="text" name="name" class="form__input" placeholder="Имя:" />
              <label class="error" v-if="v$.name.required.$invalid"> Введите имя </label>
            </div>

            <div class="form__item">
              <input
                v-model="formData.email"
                type="text"
                name="email"
                class="form__input form__input-email"
                placeholder="E-mail:"
              />
              <label class="error" v-if="v$.email.required.$invalid"> Введите email </label>
              <label class="error" v-if="v$.email.email.$invalid"> Введите email в корректном формате </label>
            </div>

            <div class="form__item">
              <textarea
                v-model="formData.message"
                name="message"
                class="from__message"
                placeholder="Сообщение:"
              ></textarea>
              <label class="error" v-if="v$.message.required.$invalid"> Введите сообщение </label>
            </div>

            <button type="submit" class="form-popup__btn" :disabled="isSending">Отправить сообщение</button>

            <button @click="emit('close')" class="form-popup__close">
              <img src="/images/contacts/close.svg" alt="close" />
            </button>
          </form>

          <div v-show="showSuccessMsg" class="contact-form__success">
            <h2>
              Заявка принята!<br />
              Мы свяжемся с&nbsp;Вами в&nbsp;ближайшее время!
            </h2>
          </div>

          <div v-show="showErrorMessage" class="contact-form__error">
            <h2>Произошла ошибка, попробуйте еще раз</h2>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script lang="ts" setup>
import { computed, ref, reactive, onMounted } from "vue";
import type { Ref } from "vue";
import { useEventsStore } from "@/stores/events";
import useValidate from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";

const emit = defineEmits<{
  (e: "close"): void;
}>();

const { sendEmail } = useEventsStore();

const isSending: Ref<boolean> = ref(false);
const showSuccessMsg: Ref<boolean> = ref(false);
const showErrorMessage: Ref<boolean> = ref(false);
const formData = reactive({
  name: "",
  email: "",
  message: "",
});

const rules = computed(() => ({
  name: { required },
  email: { email, required },
  message: { required },
}));

const v$ = useValidate(rules, formData, { $lazy: true });
const submitHandler = async () => {
  isSending.value = true;

  await resetMessages();
  await v$.value.$validate();

  if (v$.value.$error) return;

  await sendEmail(formData).then(res => {
    if (res.status === "success") {
      showSuccessMsg.value = true;
      return;
    }

    showErrorMessage.value = true;
  });

  isSending.value = false;
  setTimeout(() => {
    emit("close");
  }, 2000);
};

const resetMessages = () => {
  showSuccessMsg.value = false;
  showErrorMessage.value = false;
};

onMounted(() => {
  resetMessages();
});
</script>

<style lang="scss" scoped>
@import "@/assets/scss/components/feedback-form";

.form-fade-enter-active,
.form-fade-leave-active {
  transition: all 0.5s ease;
}

.form-fade-enter-from,
.form-fade-leave-to {
  transform: scale(1.2);
  opacity: 0;
}
</style>
