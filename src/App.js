import React, { Suspense } from "react";
import { Switch, Route } from "react-router-dom";

const Category = React.lazy(() => import("./components/Category"));

function App() {
  return (
    <>
      <Suspense
        fallback={
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        }
      >
        <Switch>
          <Route component={Category} />
        </Switch>
      </Suspense>
    </>
  );
}

export default App;
