<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtLoadingIndicator :throttle="0" color="gray" />
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
