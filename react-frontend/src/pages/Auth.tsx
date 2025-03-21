import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router";
import { useDispatch } from "react-redux";
import { ArrowLeft, Eye, EyeOff, Lock, Mail } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { setUser } from "@/redux/slices/userSlice";
import { UserRole } from "@/types";
import { loginUser, registerUser } from "@/api/authservice";
import { AxiosError } from "axios";
import { useNavigate } from "react-router";

export const Auth = () => {
  const dispatch = useDispatch();

  // State for login
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  // State for registration
  const [registerData, setRegisterData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: UserRole.PATIENT,
    confirmPassword: "",
  });
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "login" | "register"
  ) => {
    const { id, value } = e.target;
    if (type === "login") {
      setLoginData((prev) => ({ ...prev, [id]: value }));
    } else {
      setRegisterData((prev) => ({ ...prev, [id]: value }));
    }
  };

  // Login API Call
  const handleLogin = async () => {
    setLoginError(null);
    try {
      console.log(loginData);
      const res = await loginUser(loginData.email, loginData.password);

      const { data } = res;
      console.log(res);
      if (res.status !== 201) throw new Error("Login failed");

      // Store token in Redux
      dispatch(setUser(data));
      alert("Login successful");
      navigate("/dashboard");
    } catch (error) {
      const errorMessage =
        (error as AxiosError<{ message: string }>)?.response?.data?.message ||
        "Something went wrong!";
      setLoginError(errorMessage);
    } finally {
      setLoginData({ email: "", password: "" });
    }
  };

  // Register API Call
  const handleRegister = async () => {
    setRegisterError(null);
    if (registerData.password !== registerData.confirmPassword) {
      setRegisterError("Passwords do not match");
      return;
    }

    try {
      const res = await registerUser(
        registerData.fullName,
        registerData.email,
        registerData.role,
        registerData.password
      );

      const { data } = res;
      if (res.status !== 201)
        throw new Error(data.message || "Registration failed");
      alert("Registration successful. Please login.");
    } catch (error) {
      const errorMessage =
        (error as AxiosError<{ message: string }>)?.response?.data?.message ||
        "Something went wrong!";
      setRegisterError(errorMessage);
    } finally {
      setRegisterData({
        fullName: "",
        email: "",
        password: "",
        role: UserRole.PATIENT,
        confirmPassword: "",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-blue-50 p-4">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="inline-flex items-center text-sm font-medium text-primary mb-6 hover:underline"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          {/* Login Form */}
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Welcome back</CardTitle>
                <CardDescription>Sign in to your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      className="pl-10"
                      value={loginData.email}
                      onChange={(e) => handleChange(e, "login")}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10"
                      value={loginData.password}
                      onChange={(e) => handleChange(e, "login")}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-10 w-10 text-gray-400"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                {loginError && (
                  <p className="text-red-500 text-sm">{loginError}</p>
                )}
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={handleLogin}>
                  Sign In
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Register Form */}
          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Create an account</CardTitle>
                <CardDescription>Enter your details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    placeholder="John Doe"
                    className="pl-10"
                    value={registerData.fullName}
                    onChange={(e) => handleChange(e, "register")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registerEmail">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="pl-10"
                    value={registerData.email}
                    onChange={(e) => handleChange(e, "register")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registerPassword">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      className="pl-10"
                      value={registerData.password}
                      onChange={(e) => handleChange(e, "register")}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-1/2 -translate-y-1/2 h-10 w-10 text-gray-400"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      className="pl-10"
                      value={registerData.confirmPassword}
                      onChange={(e) => handleChange(e, "register")}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-10 w-10 text-gray-400"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                {/* User Role Dropdown */}
                <div className="space-y-2">
                  <Label htmlFor="userRole">User Role</Label>
                  <select
                    id="userRole"
                    className="w-full border rounded-md p-2"
                    value={registerData.role}
                    onChange={(e) =>
                      setRegisterData((prev) => ({
                        ...prev,
                        role: e.target.value as UserRole,
                      }))
                    }
                  >
                    {Object.values(UserRole).map((role) => (
                      <option key={role} value={role}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                {registerError && (
                  <p className="text-red-500 text-sm">{registerError}</p>
                )}
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={handleRegister}>
                  Create Account
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
