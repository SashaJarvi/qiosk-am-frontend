<template>
  <div class="form-fade" @click.self="emit('close')">
    <transition name="form-fade" mode="in-out" appear>
      <div class="form-popup">
        <form class="form" @submit.prevent="submitHandler">
          <h3 class="form__title">{{ $t("forms.feedback") }}</h3>

          <div class="form__item">
            <input
              v-model="formData.name"
              type="text"
              name="name"
              class="form__input"
              :placeholder="`${$t('forms.name')}:`"
            />
            <label class="error" v-if="v$.name.required.$invalid"> {{ $t("forms.enter-name") }} </label>
          </div>

          <div class="form__item">
            <input
              v-model="formData.email"
              type="text"
              name="email"
              class="form__input form__input-email"
              placeholder="E-mail:"
            />
            <label class="error" v-if="v$.email.required.$invalid"> {{ $t("forms.enter-email") }} </label>
            <label class="error" v-if="v$.email.email.$invalid"> {{ $t("forms.enter-correct-email") }} </label>
          </div>

          <div class="form__item">
            <textarea
              v-model="formData.message"
              name="message"
              class="from__message"
              :placeholder="$t('forms.message')"
            ></textarea>
            <label class="error" v-if="v$.message.required.$invalid"> {{ $t("forms.enter-message") }} </label>
          </div>

          <button type="submit" class="form-popup__btn" :disabled="isSending">{{ $t("forms.send-message") }}</button>

          <button @click="emit('close')" class="form-popup__close">
            <img src="/images/contacts/close.svg" alt="close" />
          </button>
        </form>

        <div v-show="showSuccessMsg" class="contact-form__success">
          <h2>
            {{ $t("forms.request-accepted") }}<br />
            {{ $t("forms.we-will-contact") }}
          </h2>
        </div>

        <div v-show="showErrorMessage" class="contact-form__error">
          <h2>{{ $t("forms.error") }}</h2>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, reactive, onMounted } from "vue";
import type { Ref } from "vue";
import useValidate from "@vuelidate/core";
import { useEventsStore } from "@/stores/events";
import { required, email } from "@vuelidate/validators";

interface IFormData {
  name: string;
  email: string;
  message: string;
}

const emit = defineEmits<{
  (e: "close"): void;
}>();

const { sendEmail } = useEventsStore();

const isSending: Ref<boolean> = ref(false);
const showSuccessMsg: Ref<boolean> = ref(false);
const showErrorMessage: Ref<boolean> = ref(false);
const formData = reactive<IFormData>({
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

  if (v$.value.$error) {
    isSending.value = false;
    return;
  }

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
  }, 1000);
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
  transition: all 0.5s ease-in-out;
}

.form-fade-enter-from,
.form-fade-leave-to {
  opacity: 0;
  transform: translateY(50px);
}
</style>
