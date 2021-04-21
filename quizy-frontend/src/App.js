import './App.css';
import Quiz from "./components/quiz/Quiz";
import CoursePage from "./components/course/CoursePage";
import { BrowserRouter as Router, Link, Route, Switch, useParams } from "react-router-dom";
import CourseItem from "./components/course/CourseItem";

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
                  <CoursePage/>
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
  return <><h2>QuizManager</h2><CourseItem slug={slug}/></>;
}

function Home() {
  return <h2>Dashboard</h2>;
}

export default App;
