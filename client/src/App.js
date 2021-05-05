import './App.css';
import Quiz from "./components/quiz/Quiz";
import LessonPage from "./components/lesson/LessonPage";
import { BrowserRouter as Router, Link, Route, Switch, useParams } from "react-router-dom";
import LessonItem from "./components/lesson/LessonItem";

function App() {

  return (
    <div className="App">


        <Router>
          <div>
            <nav>
              <Link to="/">Dashboard</Link>
              <Link to="/course">Quizzes</Link>
            </nav>

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
