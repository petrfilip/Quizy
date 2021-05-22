import './App.css';
import LessonPage from "./components/lesson/LessonPage";
import { BrowserRouter as Router, Redirect, Route, Switch, useParams } from "react-router-dom";
import LessonItem from "./components/lesson/LessonItem";
import Navbar from "./components/layout/Navbar";
import HomeIcon from "@material-ui/icons/Home";
import MenuBookIcon from "@material-ui/icons/MenuBook";
import ViewComfyIcon from "@material-ui/icons/ViewComfy";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import CoursePage from "./components/course/CoursePage";
import Profile from "./components/user/Profile";
import Dashboard from "./components/layout/Dashboard";
import CourseItem from "./components/course/CourseItem";
import { useAuth } from "./components/layout/AuthContext";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import Login from "./components/layout/Login";
import useUser from "./components/layout/UserHook";
import { ExamProvider } from "./components/layout/ExamContext";
import { useTranslation } from "react-i18next";

function App() {

  const { user } = useUser();
  const { t } = useTranslation();

  const nav = user ? [
    {
      title: t('navbar_dashboard'),
      to: "/",
      icon: <HomeIcon/>
    },
    {
      title: t('navbar_lessons'),
      to: "/lessons",
      icon: <MenuBookIcon/>
    },
    {
      title: t('navbar_courses'),
      to: "/courses",
      icon: <ViewComfyIcon/>
    },
    {
      title: user.mail,
      to: "/profile",
      icon: <AccountCircleIcon/>
    },
    {
      title: "",
      to: "/logout",
      icon: <ExitToAppIcon/>
    }
  ] : [
    {
      title: t('navbar_dashboard'),
      to: "/",
      icon: <HomeIcon/>
    },
    {
      title: t('navbar_lessons'),
      to: "/lessons",
      icon: <MenuBookIcon/>
    },
    {
      title: t('navbar_courses'),
      to: "/courses",
      icon: <ViewComfyIcon/>
    },
    {
      title: t('navbar_login'),
      to: "/login",
      icon: <AccountCircleIcon/>
    },
  ]

  return (
    <div className="App">
      <Router>
        <div>
          <ExamProvider>
            <Navbar items={nav}/>
            <div className={"page-content"}>
              <Switch>
                <Route path="/lessons/:slug">
                  <LessonItemPage/>
                </Route>
                <Route path="/lessons">
                  <LessonPage/>
                </Route>
                <Route path="/courses/:slug">
                  <CourseItemPage/>
                </Route>
                <Route path="/courses">
                  <CoursePage/>
                </Route>
                <Route path="/profile">
                  <Profile/>
                </Route>
                <Route path="/login">
                  <Login/>
                </Route>
                <Route path="/logout">
                  <Logout/>
                </Route>
                <Route path="/">
                  <Dashboard/>
                </Route>
              </Switch>
            </div>
          </ExamProvider>
        </div>
      </Router>


    </div>
  );
}

function LessonItemPage() {
  let { slug } = useParams();
  return <><LessonItem slug={slug}/></>;
}

function CourseItemPage() {
  let { slug } = useParams();
  return <><CourseItem slug={slug}/></>;
}

function Logout() {
  const { removeTokens } = useAuth()
  removeTokens();
  return <Redirect to="/"/>;
}

export default App;
