using InterviewTest.Model;
using System.Collections.Generic;

namespace InterviewTest.Stores
{
    public interface IEmployeeStore
    {
        public List<Employee> GetAllEmployees();
        public void AddEmployee(Employee employee);
        public void DeleteEmployee(int id);
        public void UpdateEmployee(Employee employee);
    }
}
