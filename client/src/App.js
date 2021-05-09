import './App.css';
import Quiz from "./components/quiz/Quiz";
import LessonPage from "./components/lesson/LessonPage";
import { BrowserRouter as Router, Link, Route, Switch, useParams } from "react-router-dom";
import LessonItem from "./components/lesson/LessonItem";
import Navbar from "./components/layout/Navbar";
import HomeIcon from "@material-ui/icons/Home";
import MenuBookIcon from "@material-ui/icons/MenuBook";
import ViewComfyIcon from "@material-ui/icons/ViewComfy";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { useAuth } from "./components/layout/AuthContext";

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
      to: "/course",
      icon: <ViewComfyIcon/>
    },
    // {
    //   title: user.user_mail,
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
                <Route path="/course/:slug">
                  <CourseItemPage />
                </Route>
                <Route path="/course">
                  <LessonPage/>
                </Route>
                <Route path="/">
                  <Home/>
                </Route>
              </Switch>
            </div>
          </div>
        </Router>


    </div>
  );
}

function CourseItemPage() {
  let { slug } = useParams();
  return <><LessonItem slug={slug}/></>;
}

function Home() {
  return <h2>Dashboard</h2>;
}

export default App;
