<template>
  <div
    class="min-h-screen bg-gray-100 flex flex-col items-center justify-center gap-4"
  >
    <h1 class="text-4xl font-bold text-blue-500">Count: {{ counter.count }}</h1>
    <Button @click="counter.increment">Increment</Button>
    <p v-if="post">Post Title: {{ post.title }}</p>
    <p v-else>Loading...</p>
  </div>
</template>

<script>
import { Button } from "@/components/ui/button";
import { useCounterStore } from "@/stores/counter";
import api from "@/services/api";

export default {
  name: "App",
  components: { Button },
  data() {
    return {
      post: null,
    };
  },
  setup() {
    const counter = useCounterStore();
    return { counter };
  },
  async created() {
    try {
      const response = await api.get("/posts/3");
      this.post = response.data;
    } catch (error) {
      console.error("Error fetching post:", error);
    }
  },
};
</script>
