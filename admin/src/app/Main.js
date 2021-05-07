import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link, useParams
} from "react-router-dom";
import LessonLoader from "../components/LessonLoader";
import LessonItemManager from "../components/LessonItemManager";
import UsersLoader from "../components/user/UsersLoader";
import "./Main.css"
import Navbar from "./Navbar";
import PeopleIcon from '@material-ui/icons/People';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import HomeIcon from '@material-ui/icons/Home';
import ViewComfyIcon from '@material-ui/icons/ViewComfy';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Login from "./Login";
import AddUser from "../components/user/AddUser";

export default function Main() {
  const nav = [
    {
      title: "Dashboard",
      to: "/",
      icon: <HomeIcon/>
    },
    {
      title: "Lessons",
      to: "/lessons",
      icon: <MenuBookIcon/>
    },
    {
      title: "Courses",
      to: "/courses",
      icon: <ViewComfyIcon/>
    },
    {
      title: "",
      to: "/users",
      icon: <PeopleIcon/>
    },
    {
      title: "",
      to: "/profile",
      icon: <AccountCircleIcon/>
    }
  ]

  return (
    <Router>
      <div>
        <Navbar items={nav}/>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <div className={"page-content"}>
          <Switch>
            <Route path="/lessons/:slug">
              <QuizItemManagerPage/>
            </Route>
            <Route path="/lessons">
              <QuizManagerPage/>
            </Route>
            <Route path="/users/new">
              <AddUser/>
            </Route>
            <Route path="/users">
              <UsersLoader/>
            </Route>
            <Route path="/login">
              <Login/>
            </Route>
            <Route path="/profile">
              <Profile/>
            </Route>
            <Route path="/">
              <Home/>
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );

}

function Home() {
  return <h2>Dashboard</h2>;
}

function QuizManagerPage() {
  return <><LessonLoader/></>;
}

function QuizItemManagerPage() {
  let { slug } = useParams();
  return <><LessonItemManager slug={slug}/></>;
}

function Profile() {
  return <h2>Profile</h2>;
}

