import React from "react";
import { BrowserRouter as Router, Redirect, Route, Switch, useParams } from "react-router-dom";
import LessonManager from "../components/lesson/LessonManager";
import LessonItemManager from "../components/lesson/LessonItemManager";
import UsersLoader from "../components/user/UsersLoader";
import "./Main.css"
import Navbar from "./Navbar";
import PeopleIcon from '@material-ui/icons/People';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import HomeIcon from '@material-ui/icons/Home';
import ViewComfyIcon from '@material-ui/icons/ViewComfy';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Login from "./Login";
import { useAuth } from "./AuthContext";
import Profile from "./Profile";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Init from "./Init";
import CourseManager from "../components/course/CourseManager";
import CourseItemManager from "../components/course/CourseItemManager";
import FileManager from "../components/file-manager/FileManager";
import { Container } from "@material-ui/core";
import PermMediaIcon from '@material-ui/icons/PermMedia';
import Typography from "@material-ui/core/Typography";
import AddUsers from "../components/user/AddUsers";
import UserDetails from "../components/user/UserDetails";
import UsersLabelsOverview from "../components/user/UsersLabelsOverview";

export default function Main() {
  const { user } = useAuth()

  const nav = user && [
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
      title: "Users",
      to: "/users",
      icon: <PeopleIcon/>
    },
    {
      title: "File manager",
      to: "/file-manager",
      icon: <PermMediaIcon/>
    },
    {
      title: user.user_mail,
      to: "/profile",
      icon: <AccountCircleIcon/>
    },
    {
      title: "",
      to: "/logout",
      icon: <ExitToAppIcon/>
    }
  ]

  const authenticatedRoutes = (
    <Router>
      <div>
        <Navbar items={nav}/>
        <div className={"page-content"}>
          <Switch>
            <Route path="/courses/:slug"><CourseItemManagerPage/></Route>
            <Route path="/courses"><CourseManager/></Route>
            <Route path="/lessons/:slug"><LessonItemManagerPage/></Route>
            <Route path="/lessons"><LessonManagerPage/></Route>
            <Route path="/users/new"><AddUsers/></Route>
            <Route path="/users/labels/:labels"><UsersLabelsPage /></Route>
            <Route path="/users/labels/"><UsersLabelsPage /></Route>
            <Route path="/users/:id"><UserDetailsPage /></Route>
            <Route path="/users"><UsersLoader/></Route>
            <Route path="/file-manager/:location"> <FileManagerPage/></Route>
            <Route path="/file-manager"> <FileManagerPage/></Route>
            <Route path="/profile"><Profile/></Route>
            <Route path="/logout"><Logout/></Route>
            <Route render={() => <Redirect to="/"/>}/>
            <Route path="/"><Home/></Route>
          </Switch>
        </div>
      </div>
    </Router>
  );

  const nonAuthenticatedRoutes = (<Router>
    <Switch>
      <Route path="/login"><Login/></Route>
      <Route exact path="/init"><Init/></Route>
      <Route render={() => <Redirect to="/login"/>}/>
    </Switch>
  </Router>)

  return user ? authenticatedRoutes : nonAuthenticatedRoutes

}

function Home() {
  return <h2>Dashboard</h2>;
}

function LessonManagerPage() {
  return <>
    <LessonManager/></>;
}

function LessonItemManagerPage() {
  let { slug } = useParams();
  return <><LessonItemManager slug={slug}/></>;
}

function CourseItemManagerPage() {
  let { slug } = useParams();
  return <><CourseItemManager slug={slug}/></>;
}

function UserDetailsPage() {
  let { id } = useParams();
  return <UserDetails userId={id}/>;
}
function UsersLabelsPage() {
  let { labels } = useParams();
  return <div style={{marginLeft:"30px", marginRight: "30px"}}><UsersLabelsOverview labels={labels }/></div>;
}

function FileManagerPage() {
  let { location } = useParams();
  return <>
    <Container>
      <Typography variant="h4">File manager</Typography>
      <FileManager location={location} />
    </Container>
  </>;
}

function Logout() {
  const { removeTokens } = useAuth()
  removeTokens()
  return <Redirect to="/"/>;
}


