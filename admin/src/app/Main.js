import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link, useParams
} from "react-router-dom";
import LessonLoader from "../components/LessonLoader";
import LessonItemManager from "../components/LessonItemManager";
import "./Main.css"

export default function Main() {

  return (
    <Router>
      <div>
        <nav>
          <Link to="/">Dashboard</Link>
          <Link to="/quiz">Quizzes</Link>
          <Link to="/users">Users</Link>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <div className={"page-content"}>
          <Switch>
            <Route path="/quiz/:slug">
              <QuizItemManagerPage/>
            </Route>
            <Route path="/quiz">
              <QuizManagerPage/>
            </Route>
            <Route path="/users">
              <Users/>
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
  return <><h2>QuizManager</h2><LessonLoader/></>;
}

function QuizItemManagerPage() {
  let { slug } = useParams();
  return <><h2>QuizManager</h2><LessonItemManager slug={slug}/></>;
}

function Users() {
  return <h2>Users</h2>;
}