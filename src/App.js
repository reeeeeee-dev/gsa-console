import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import {Sidenav} from './common/navigation/component/Sidenav';
import {Transaction} from './pages/transaction/component/Transaction';
import {ProductListing} from './pages/products/component/ProductListing';
import {EmployeeDetails} from './pages/employee/component/EmployeeDetails';
import {SalesReport} from './pages/salesReport/component/SalesReport';
import {CashierReport} from './pages/cashierReport/component/CashierReport';
import './App.scss';

function App() {
  let [employees, setEmployees ] = useState([]);
  useEffect(() => {
    fetch("https://gsa-backend-api.herokuapp.com/employees", {
      method: 'GET',
      redirect: 'follow'
    })
    .then(response => response.text())
    .then(result => {
      let list = JSON.parse(result);
      console.log(list);
      setEmployees(list);
    })
    .catch(error => console.log('error', error));
  }, []);

/*puts side nav in, setting routes for each link, directly renders each part and sends that part of the website out*/
  return (
      <Router>
        <Switch>
          <Route path="/transaction">{/*link to these, basically copy what hes done here, This is the URL path */}
            <Transaction/>{/*This is basically redrwaing the pageon same canvas*/}
            {/* Insert Transaction Page Component this will be shown to user
            generate compontents and call components here
            take the nav folder from common, and make a new folder called page, and make
            starter page for each page. */}
          </Route>
          <Route path="/productListing">
          <ProductListing/>{/* Insert Products Page Component */}
          </Route>
          <Route path="/employeeDetails">
          <EmployeeDetails/>{/* Insert User Page Component */}
          </Route>
          <Route path="/salesReport">
          <SalesReport/>{/* Insert Sales Report Page Component */}
          </Route>
          <Route path="/cashierReport">
          <CashierReport/> {/* Insert User Report Page Component */}
          </Route>

          <Route path="/">
            <div className="App">
              {/* <Sidenav/> */}
              <ul>
                {
                  employees.length < 1 ? <h3>No employees found!</h3>
                  : employees.map((emp, id) => {
                    return <li key={id}>
                      <h3>{emp.firstName} {emp.lastName}</h3>
                      <p>{emp.address}, {emp.city}</p>
                    </li>
                  })
                }
              </ul>
            </div>
          </Route>
        </Switch>
      </Router>

  );


}

// function validateUser(id, password)
// {
//   if(id != "" && isNumeric(id) && password != "")
//   {
//     return true;
//   }
//   return false;
// }

export default App;
