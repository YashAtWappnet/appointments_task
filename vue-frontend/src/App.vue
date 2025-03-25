<template>
  <div>
    <header class="border-b flex items-center justify-center bg-white">
      <div
        class="container flex h-16 items-center justify-between px-4 md:px-6"
      >
        <router-link to="/" class="flex items-center gap-2">
          <span class="text-xl font-bold text-primary">MediBook</span>
        </router-link>

        <nav class="hidden md:flex gap-6">
          <router-link
            to="#features"
            class="text-sm font-medium hover:text-primary"
          >
            Features
          </router-link>
          <router-link to="#" class="text-sm font-medium hover:text-primary">
            About
          </router-link>
          <router-link to="#" class="text-sm font-medium hover:text-primary">
            Contact
          </router-link>
        </nav>

        <div class="flex items-center gap-4">
          <template v-if="!store.user">
            <router-link to="/auth">
              <Button variant="outline" size="sm" class="hidden md:flex">
                Sign In
              </Button>
            </router-link>
            <router-link to="/auth">
              <Button size="sm">Get Started</Button>
            </router-link>
          </template>
          <template v-else>
            <Button
              variant="outline"
              size="sm"
              class="hidden md:flex bg-red-400 text-white"
              @click="store.removeUser"
            >
              Sign out
            </Button>
          </template>
        </div>
      </div>
    </header>

    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useUserStore } from "@/stores/user"; // Import the Pinia store
import { Button } from "@/components/ui/button"; // Adjust path to your Button component

export default defineComponent({
  name: "App",
  components: {
    Button,
  },
  setup() {
    const store = useUserStore(); // Initialize the store

    return {
      store, // Expose the entire store to the template
    };
  },
});
</script>

<style scoped>
/* TailwindCSS handles styling */
</style>
