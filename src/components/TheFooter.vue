<template>
  <footer class="py-[16px] sm:py-[18px] text-black-base bg-yellow-base">
    <div class="container mx-auto px-[16px]">
      <div class="flex items-center justify-between gap-[16px] flex-wrap">
        <div class="flex flex-col gap-[4px]">
          <h2 class="font-grotesk text-[16px] sm:text-[20px] font-bold">qiosk.am</h2>
        </div>

        <div class="grid grid-cols-[repeat(4,40px)] sm:grid-cols-[repeat(4,60px)] gap-[4px] h-fit">
          <div
            v-for="paymentItem in paymentSystems"
            :key="paymentItem"
            class="grid place-items-center bg-white rounded-[5px]"
          >
            <img class="max-w-full h-auto object-cover" :src="`/images/icons/${paymentItem}.svg`" :alt="paymentItem" />
          </div>
        </div>
      </div>
    </div>

    <hr class="w-full h-[1px] my-[16px] sm:my-[18px] bg-black-base border-0" />

    <div class="container mx-auto px-[18px]">
      <div class="flex justify-between items-center gap-[16px] flex-wrap">
        <div class="flex gap-[8px]">
          <a
            v-for="{ href, icon } in socialLinks"
            :key="href"
            class="grid place-items-center w-[18px] h-[18px] sm:w-[24px] sm:h-[24px]"
            :href="href"
            target="_blank"
          >
            <img :src="`/images/icons/${icon}.svg`" :alt="icon" />
          </a>
        </div>

        <p class="text-[14px] sm:text-[16px] font-medium">© {{ currentYear }} qiosk.am</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
interface ISocialLink {
  href: string;
  icon: string;
}

const currentYear: number = new Date().getFullYear();
const paymentSystems: string[] = ["visa", "mastercard", "mir", "arca"];
const socialLinks: ISocialLink[] = [
  { href: "https://www.instagram.com/yerevankino", icon: "instagram" },
  { href: "https://www.facebook.com/yerevankino", icon: "facebook" },
  { href: "https://t.me/YerevanKino", icon: "telegram" },
];
</script>

<style scoped></style>
