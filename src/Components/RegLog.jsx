import React, { useContext, useState, useRef, useEffect } from "react";
import { FaChevronRight } from "react-icons/fa6";
import { FaChevronLeft } from "react-icons/fa6";
import "./RegLog.css";
import { ScrollContext } from "../context/ScrollContext";
import { setDoc, doc } from "firebase/firestore";
import { db, auth, provider } from "../firebase/firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { FaGoogle } from "react-icons/fa";
import getUserDetailsWithId from "../firebase/getUserDetailsWithID";
import { Bounce, toast } from "react-toastify";

function RegLog({ logrefsection, settriggerUserEffect }) {
  const [toggle, setToggle] = useState(false);
  const scrollRefx = useRef(null);
  const { setScrollRef } = useContext(ScrollContext);
  const [isLoading, setisLoading] = useState(false);

  function handleToggle() {
    setToggle((prev) => !prev);
  }

  useEffect(() => {
    setScrollRef(scrollRefx);
  }, []);

  async function handleRegister(e) {
    setisLoading(true);
    e.preventDefault();
    const data = {
      name: e.target[0].value.trim(),
      email: e.target[1].value.trim(),
      password: e.target[2].value.trim(),
    };

    try {
      // Create a new user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      // Send email verification
      await sendEmailVerification(userCredential.user);
      console.log("Verification email sent");
      toast.success("Verification email sent");

      // Save user data in Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        name: data.name,
        email: data.email,
        id: userCredential.user.uid,
        createdAt: new Date(),
        isSubscribed: true,
        isLeetcode: false,
        leetcodeUsername: "",
        difficulty: "Easy",
        category: ["All"],
      });
      signOut(auth);
      console.log("User registered and data saved");
    } catch (err) {
      console.log("Error during registration:", err.message);
      if (err.message == "Firebase: Error (auth/email-already-in-use).") {
        toast.error("Email already exist !");
      } else if (
        err.message ==
        "Firebase: Password should be at least 6 characters (auth/weak-password)."
      ) {
        toast.error("Password should be at least 6 characters !");
      }
    } finally {
      setisLoading(false);
    }
  }

  async function handelLogin(e) {
    setisLoading(true);
    e.preventDefault();
    const data = {
      email: e.target[0].value.trim(),
      password: e.target[1].value.trim(),
    };
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const user = userCredential.user;
      if (user.emailVerified) {
        localStorage.setItem("email", data.email);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("uid", user.uid);
        settriggerUserEffect((prev) => !prev);
        console.log("Login succesfull");
        toast.success("Login succesfull");
      } else {
        console.log("Email is not verified");
        toast.warn("Email is not verified!");
      }
    } catch (err) {
      console.log(err.message);
      toast.error("Invalid credential!");
    } finally {
      setisLoading(false);
    }
  }

  async function handelSignInWithGoodle() {
    try {
      setisLoading(true);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      localStorage.setItem("email", user.email);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("uid", user.uid);
      const userDetail = await getUserDetailsWithId(user.uid);
      if (!userDetail) {
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName,
          email: user.email,
          id: user.uid,
          createdAt: new Date(),
          isSubscribed: true,
          isLeetcode: false,
          leetcodeUsername: "",
          difficulty: "Easy",
          category: ["All"],
        });
      }
      settriggerUserEffect((prev) => !prev);
      console.log("Login succesfull");
      toast.success("Login succesfull");
    } catch (err) {
      console.log(err);
    } finally {
      setisLoading(false);
    }
  }

  return (
    <div
      className="h-screen pl-20 pr-20  flex flex-col items-center justify-center"
      ref={scrollRefx}
    >
      <div className={`container ${toggle ? "active" : ""}`} id="container">
        <div className="form-container sign-up">
          <form onSubmit={handleRegister}>
            <h1>Create Account</h1>
            <div className="">
              <div
                className="flex items-center gap-2 border border-black h-[40px] m-[10px] p-5 rounded-[10px] cursor-pointer"
                onClick={handelSignInWithGoodle}
              >
                <FaGoogle />
                <p className="font-[500]">Sign in with Google</p>
              </div>
            </div>
            <span>or use your email for registration</span>
            <input type="text" placeholder="Name" />
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <button
              type="submit"
              className={`${isLoading ? "pointer-events-none" : ""} w-full`}
            >
              {isLoading ? "..." : "Sign Up"}
            </button>
          </form>
        </div>
        <div className="form-container sign-in">
          <form onSubmit={handelLogin}>
            <h1>Sign In</h1>
            <div className="">
              <div
                className="flex items-center gap-2 border border-black h-[40px] m-[10px] p-5 rounded-[10px] cursor-pointer"
                onClick={handelSignInWithGoodle}
              >
                <FaGoogle />
                <p className="font-[500]">Sign in with Google</p>
              </div>
            </div>
            <span>or use your email password</span>
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <span>Forget Your Password?</span>
            <button
              type="submit"
              className={`${isLoading ? "pointer-events-none" : ""} w-full`}
            >
              {" "}
              {isLoading ? "..." : "Sign In"}
            </button>
          </form>
        </div>
        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h1>Welcome Back!</h1>
              <p>Enter your personal details to use all of site features</p>
              <p
                className="border border-white p-2 rounded cursor-pointer flex items-center gap-2"
                onClick={handleToggle}
              >
                <FaChevronLeft /> Go to Sign In
              </p>
            </div>
            <div className="toggle-panel toggle-right">
              <h1>Hello, Friend!</h1>
              <p>
                Don't have an account ? <br />
                Register with your personal details to use all of site features
              </p>
              <p
                className="border border-white p-2 rounded cursor-pointer flex gap-2 items-center"
                onClick={handleToggle}
              >
                Go to Sign Up <FaChevronRight />
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegLog;
