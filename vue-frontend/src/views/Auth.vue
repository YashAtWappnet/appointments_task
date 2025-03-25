<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-blue-50 p-4"
  >
    <div class="w-full max-w-md">
      <router-link
        to="/"
        class="inline-flex items-center text-sm font-medium text-primary mb-6 hover:underline"
      >
        <ArrowLeft class="mr-2 h-4 w-4" />
        Back to Home
      </router-link>

      <Tabs v-model="activeTab" class="w-full">
        <TabsList class="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>

        <!-- Login Form -->
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle class="text-2xl">Welcome back</CardTitle>
              <CardDescription>Sign in to your account</CardDescription>
            </CardHeader>
            <CardContent class="space-y-4">
              <div class="space-y-2">
                <Label for="email">Email</Label>
                <div class="relative">
                  <Mail class="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    class="pl-10"
                    v-model="loginData.email"
                  />
                </div>
              </div>
              <div class="space-y-2">
                <Label for="password">Password</Label>
                <div class="relative">
                  <Lock class="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="••••••••"
                    class="pl-10 pr-10"
                    v-model="loginData.password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    class="absolute right-0 top-0 h-10 w-10 text-gray-400"
                    @click="showPassword = !showPassword"
                  >
                    <EyeOff v-if="showPassword" class="h-4 w-4" />
                    <Eye v-else class="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p v-if="loginError" class="text-red-500 text-sm">
                {{ loginError }}
              </p>
            </CardContent>
            <CardFooter>
              <Button class="w-full" @click="handleLogin">Sign In</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <!-- Register Form -->
        <TabsContent value="register">
          <Card>
            <CardHeader>
              <CardTitle class="text-2xl">Create an account</CardTitle>
              <CardDescription>Enter your details</CardDescription>
            </CardHeader>
            <CardContent class="space-y-4">
              <div class="space-y-2">
                <Label for="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  class="pl-10"
                  v-model="registerData.name"
                />
              </div>
              <div class="space-y-2">
                <Label for="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  class="pl-10"
                  v-model="registerData.email"
                />
              </div>
              <div class="space-y-2">
                <Label for="password">Password</Label>
                <div class="relative">
                  <Input
                    id="password"
                    :type="showPassword ? 'text' : 'password'"
                    class="pl-10"
                    v-model="registerData.password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    class="absolute right-0 top-1/2 -translate-y-1/2 h-10 w-10 text-gray-400"
                    @click="showPassword = !showPassword"
                  >
                    <EyeOff v-if="showPassword" class="h-4 w-4" />
                    <Eye v-else class="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div class="space-y-2">
                <Label for="confirmPassword">Confirm Password</Label>
                <div class="relative">
                  <Input
                    id="confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    class="pl-10"
                    v-model="registerData.confirmPassword"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    class="absolute right-0 top-0 h-10 w-10 text-gray-400"
                    @click="showConfirmPassword = !showConfirmPassword"
                  >
                    <EyeOff v-if="showConfirmPassword" class="h-4 w-4" />
                    <Eye v-else class="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div class="space-y-2">
                <Label for="userRole">User Role</Label>
                <select
                  id="userRole"
                  class="w-full border rounded-md p-2"
                  v-model="registerData.role"
                >
                  <option
                    v-for="role in Object.values(userRoleEnum)"
                    :key="role"
                    :value="role"
                  >
                    {{ role.charAt(0).toUpperCase() + role.slice(1) }}
                  </option>
                </select>
              </div>
              <p v-if="registerError" class="text-red-500 text-sm">
                {{ registerError }}
              </p>
            </CardContent>
            <CardFooter>
              <Button class="w-full" @click="handleRegister">
                Create Account
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user"; // Import UserRole from store
import { UserRole } from "@/types";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye, EyeOff, Lock, Mail } from "lucide-vue-next";
import api from "@/services/api";

export default defineComponent({
  name: "AuthPage",
  components: {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
    Label,
    Input,
    Button,
    ArrowLeft,
    Eye,
    EyeOff,
    Lock,
    Mail,
  },
  setup() {
    const router = useRouter();
    const store = useUserStore();

    // Login state
    const loginData = ref({ email: "", password: "" });
    const loginError = ref<string | null>(null);
    const showPassword = ref(false);

    // Register state
    const registerData = ref({
      name: "",
      email: "",
      password: "",
      role: UserRole.PATIENT,
      confirmPassword: "",
    });
    const registerError = ref<string | null>(null);
    const showConfirmPassword = ref(false);

    // Tabs state
    const activeTab = ref("login");

    // Expose UserRole enum to the template
    const userRoleEnum = UserRole;

    // Login handler
    const handleLogin = async () => {
      loginError.value = null;
      try {
        console.log("loginData", loginData.value);
        const res = await api.post("/users/login", {
          email: loginData.value.email,
          password: loginData.value.password,
        });

        if (res.status !== 201) throw new Error("Login failed");

        const { access_token, user } = res.data;
        localStorage.setItem("access_token", access_token); // Store token
        store.setUser(user); // Update Pinia store
        alert("Login successful");
        router.push("/dashboard");
      } catch (error) {
        const errorMessage =
          (error as any)?.response?.data?.message || "Something went wrong!";
        loginError.value = errorMessage;
      } finally {
        loginData.value = { email: "", password: "" };
      }
    };

    // Register handler
    const handleRegister = async () => {
      registerError.value = null;
      if (registerData.value.password !== registerData.value.confirmPassword) {
        registerError.value = "Passwords do not match";
        return;
      }

      try {
        const res = await api.post("/users/register", {
          name: registerData.value.name,
          email: registerData.value.email,
          role: registerData.value.role,
          password: registerData.value.password,
        });

        if (res.status !== 201) throw new Error("Registration failed");
        alert("Registration successful. Please login.");
        activeTab.value = "login"; // Switch to login tab
      } catch (error) {
        const errorMessage =
          (error as any)?.response?.data?.message || "Something went wrong!";
        registerError.value = errorMessage;
      } finally {
        registerData.value = {
          name: "",
          email: "",
          password: "",
          role: UserRole.PATIENT,
          confirmPassword: "",
        };
      }
    };

    return {
      activeTab,
      loginData,
      loginError,
      showPassword,
      registerData,
      registerError,
      showConfirmPassword,
      handleLogin,
      handleRegister,
      userRoleEnum, // Expose UserRole to the template
    };
  },
});
</script>

<style scoped>
/* TailwindCSS handles styling */
</style>
