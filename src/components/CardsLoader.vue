<template>
  <div class="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-[16px] py-[48px]">
    <div v-for="i in 4" :key="i" class="border border-grey-4">
      <div class="animate-pulse flex flex-col">
        <div class="w-full h-[200px] bg-slate-300"></div>

        <div class="flex flex-col py-[16px] px-[22px]">
          <div class="flex-1 space-y-6 py-1">
            <div class="h-2 bg-slate-300 rounded"></div>

            <div class="space-y-3">
              <div class="grid grid-cols-3 gap-4">
                <div class="h-2 bg-slate-300 rounded col-span-2"></div>

                <div class="h-2 bg-slate-300 rounded col-span-1"></div>
              </div>

              <div class="h-2 bg-slate-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style scoped></style>
