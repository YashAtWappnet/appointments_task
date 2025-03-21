import { Button } from "@/components/ui/button";
import { removeUser } from "@/redux/slices/userSlice";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet } from "react-router";

export const RootLayout = () => {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  return (
    <>
      <header className="border-b flex items-center justify-center bg-white">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary">MediBook</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link
              to="#features"
              className="text-sm font-medium hover:text-primary"
            >
              Features
            </Link>
            <Link to="#" className="text-sm font-medium hover:text-primary">
              About
            </Link>
            <Link to="#" className="text-sm font-medium hover:text-primary">
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            {!user.user ? (
              <>
                <Link to="/auth">
                  <Button
                    variant="outline"
                    size="sm"
                    className="hidden md:flex"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            ) : (
              <div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => dispatch(removeUser())}
                  className="hidden md:flex bg-red-400 text-white"
                >
                  Sign out
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>
      <Outlet />
    </>
  );
};
