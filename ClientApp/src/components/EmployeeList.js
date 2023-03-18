import React, { useState, useEffect } from "react";
import "../style.css";

function EmployeeListItem({ employee, onDelete, onEdit }) {
  const [name, setName] = useState(employee.name);
  const [value, setValue] = useState(employee.value);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleValueChange = (event) => {
    setValue(event.target.value);
  };

  const handleDelete = () => {
    fetch(`http://localhost:41478/employees`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(employee.id),
    })
      .then(() => onDelete(employee.id))
      .catch((error) => console.error(error));
  };
  const handleEdit = () => {
    const newEmployee = {
      ...employee,
      name,
      value: parseInt(value),
    };
    //console.log(newEmployee)

    fetch(`http://localhost:41478/employees/${employee.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newEmployee),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update employee");
        }
        return response.json();
      })
      .then((data) => {
        onEdit(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <>
      <tr>
        <td>
          <span>{employee.id}</span>
        </td>
        <td>
          <input type="text" value={name} onChange={handleNameChange} />
        </td>
        <td>
          <input type="number" value={value} onChange={handleValueChange} />
        </td>
        <td>
          <button className="delete" onClick={handleDelete}>
            Delete
          </button>
          <button onClick={handleEdit}>Save</button>
        </td>
      </tr>
    </>
  );
}

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [filterValue, setFilterValue] = useState("");

  const handleDelete = (id) => {
    setEmployees((prevEmployees) => prevEmployees.filter((e) => e.id !== id));
  };

  const handleEdit = (editedEmployee) => {
    setEmployees((prevEmployees) =>
      prevEmployees.map((e) =>
        e.id === editedEmployee.id ? editedEmployee : e
      )
    );
  };

  function handleAddEmployee() {
    // Get a unique id for the new employee
    const newId = Math.max(...employees.map((e) => e.id)) + 1;
    const newEmployee = {
      Id: newId,
      name: "New Employee",
      value: 0,
    };

    fetch("http://localhost:41478/employees", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newEmployee),
    })
      .then((response) => {
        if (!response.ok) {
          console.log(response);
          throw new Error("Failed to add employee");
        }
        return response.json();
      })
      .then((data) => {
        setEmployees((prevEmployees) => [...prevEmployees, data]);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  useEffect(() => {
    fetch("http://localhost:41478/employees")
      .then((response) => response.json())
      .then((data) => setEmployees(data))
      .catch((error) => console.error(error));
  }, []);

  const filteredEmployees = employees.filter((employee) =>
    `${employee.id} ${employee.name}`
      .toLowerCase()
      .includes(filterValue.toLowerCase())
  );

  return (
    <div className="container-table">
      <h1>Employee List</h1>
      <input
        type="text"
        className="imput-filter"
        placeholder="Search by ID or name"
        value={filterValue}
        onChange={(event) => setFilterValue(event.target.value)}
      />
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Value</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
        {filteredEmployees.map((employee) => (
            <EmployeeListItem
              key={employee.id}
              employee={employee}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}
        </tbody>
      </table>
      <button onClick={handleAddEmployee}>Add Employee</button>
    </div>
  );
}

export default EmployeeList;
