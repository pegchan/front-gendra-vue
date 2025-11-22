<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div class="flex items-center space-x-4">
            <router-link to="/" class="flex items-center space-x-2">
              <div class="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-xl">G</span>
              </div>
              <span class="text-xl font-bold text-gray-900">KYC</span>
            </router-link>
          </div>
          <nav class="flex items-center space-x-4">
            <router-link
              to="/verifications"
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              active-class="text-primary-600 bg-primary-50"
            >
              Solicitudes
            </router-link>
            <router-link
              to="/verifications/new"
              class="btn btn-primary text-sm"
            >
              Nueva Solicitud
            </router-link>
          </nav>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <p class="text-center text-gray-500 text-sm">
         Verificacion de Identidad
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// App component - no logic needed
</script>

<style>
html, body {
  height: 100%;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}
</style>
