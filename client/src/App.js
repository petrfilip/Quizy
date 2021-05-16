import './App.css';
import LessonPage from "./components/lesson/LessonPage";
import { BrowserRouter as Router, Route, Switch, useParams } from "react-router-dom";
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

function App() {

  // const { user } = useAuth()

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
    // {
    //   title: "user.user_mail",
    //   to: "/profile",
    //   icon: <AccountCircleIcon/>
    // },
    {
      title: "",
      to: "/logout",
      icon: <ExitToAppIcon/>
    }
  ]

  return (
    <div className="App">


      <Router>
        <div>
          <Navbar items={nav}/>


          {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
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
              <Route path="/">
                <Dashboard/>
              </Route>
            </Switch>
          </div>
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

export default App;
