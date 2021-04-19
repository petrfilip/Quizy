import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link, useParams
} from "react-router-dom";
import QuizManager from "../components/QuizManager";
import QuizItemManager from "../components/QuizItemManager";

export default function Main() {


  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Dashboard</Link>
            </li>
            <li>
              <Link to="/quiz">Quizzes</Link>
            </li>
            <li>
              <Link to="/users">Users</Link>
            </li>
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/quiz/:slug">
            <QuizItemManagerPage />
          </Route>
          <Route path="/quiz">
            <QuizManagerPage />
          </Route>
          <Route path="/users">
            <Users />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );

}

function Home() {
  return <h2>Dashboard</h2>;
}

function QuizManagerPage() {
  return <><h2>QuizManager</h2><QuizManager/></>;
}
function QuizItemManagerPage() {
  let { slug } = useParams();
  return <><h2>QuizManager</h2><QuizItemManager slug={slug}/></>;
}

function Users() {
  return <h2>Users</h2>;
}